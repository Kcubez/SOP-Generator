import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

// Vercel serverless function config
export const maxDuration = 60; // Vercel Hobby plan max

// Sanitize strings for PostgreSQL - remove null bytes and other invalid characters
function sanitizeForDB(value: string | null | undefined): string | null {
  if (!value) return null;
  // Remove null bytes (\0) which PostgreSQL UTF-8 encoding rejects
  // eslint-disable-next-line no-control-regex
  return value.replace(/\x00/g, '').trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's API key from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { geminiApiKey: true },
    });

    const apiKey = user?.geminiApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'Please set your Gemini API key before generating SOPs.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Detect content type: FormData (modify with file) or JSON (new SOP)
    const contentType = req.headers.get('content-type') || '';
    let data: Record<string, string>;
    let uploadedFileBuffer: ArrayBuffer | null = null;
    let uploadedFileName = '';
    let uploadedFileMimeType = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      data = {
        type: (formData.get('type') as string) || '',
        problems: (formData.get('problems') as string) || '',
        additionalReq: (formData.get('additionalReq') as string) || '',
        uploadedSOPContent: (formData.get('uploadedSOPContent') as string) || '',
        businessName: (formData.get('businessName') as string) || '',
        outputLanguage: (formData.get('outputLanguage') as string) || 'english',
      };
      const file = formData.get('file') as File | null;
      if (file) {
        uploadedFileBuffer = await file.arrayBuffer();
        uploadedFileName = file.name;
        uploadedFileMimeType =
          file.type ||
          (file.name.endsWith('.pdf')
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      }
    } else {
      data = await req.json();
    }

    const { type } = data;
    let title = '';

    // ─── Strategy ──────────────────────────────────────────────────────
    // 1. Create DB record FIRST with empty content → get the SOP ID
    // 2. Send SOP ID immediately as the first chunk
    // 3. Stream AI content chunk-by-chunk (keeps connection alive)
    // 4. Update DB record with full content at the end (best effort)
    // This ensures the client always gets the SOP ID, even if the
    // function times out during the final DB update.

    const encoder = new TextEncoder();
    const userId = session.user.id;

    // ─── Pre-create the SOP record ─────────────────────────────────────
    let sopId: string;
    try {
      if (type === 'NEW') {
        title = data.businessName || 'Untitled SOP';
        const sop = await prisma.sOP.create({
          data: {
            type: 'NEW',
            title: sanitizeForDB(title) || title,
            generatedContent: '',
            businessName: sanitizeForDB(data.businessName),
            businessType: sanitizeForDB(data.businessType),
            purpose: sanitizeForDB(data.purpose),
            progressStartEnd: sanitizeForDB(data.progressStartEnd),
            scope: sanitizeForDB(data.scope),
            stakeholders: sanitizeForDB(data.stakeholders),
            responsibility: sanitizeForDB(data.responsibility),
            approvalAuthority: sanitizeForDB(data.approvalAuthority),
            stepByStep: sanitizeForDB(data.stepByStep),
            decisionPoints: sanitizeForDB(data.decisionPoints),
            tools: sanitizeForDB(data.tools),
            referenceDocuments: sanitizeForDB(data.referenceDocuments),
            complianceStandards: sanitizeForDB(data.complianceStandards),
            dosAndDonts: sanitizeForDB(data.dosAndDonts),
            risks: sanitizeForDB(data.risks),
            controls: sanitizeForDB(data.controls),
            expectedOutput: sanitizeForDB(data.expectedOutput),
            kpiMetrics: sanitizeForDB(data.kpiMetrics),
            versionNo: sanitizeForDB(data.versionNo),
            effectiveDate: sanitizeForDB(data.effectiveDate),
            reviewCycle: sanitizeForDB(data.reviewCycle),
            revisionHistory: sanitizeForDB(data.revisionHistory),
            trainingMethod: sanitizeForDB(data.trainingMethod),
            inductionProcess: sanitizeForDB(data.inductionProcess),
            updateNotification: sanitizeForDB(data.updateNotification),
            uploadedSOPContent: null,
            problems: sanitizeForDB(data.problems),
            additionalReq: sanitizeForDB(data.additionalReq),
            userId,
          },
        });
        sopId = sop.id;
      } else if (type === 'MODIFIED') {
        title = data.businessName || `Modified SOP - ${new Date().toLocaleDateString()}`;
        const sop = await prisma.sOP.create({
          data: {
            type: 'MODIFIED',
            title: sanitizeForDB(title) || title,
            generatedContent: '',
            businessName: sanitizeForDB(data.businessName),
            businessType: null,
            purpose: null,
            progressStartEnd: null,
            scope: null,
            stakeholders: null,
            responsibility: null,
            approvalAuthority: null,
            stepByStep: null,
            decisionPoints: null,
            tools: null,
            referenceDocuments: null,
            complianceStandards: null,
            dosAndDonts: null,
            risks: null,
            controls: null,
            expectedOutput: null,
            kpiMetrics: null,
            versionNo: null,
            effectiveDate: null,
            reviewCycle: null,
            revisionHistory: null,
            trainingMethod: null,
            inductionProcess: null,
            updateNotification: null,
            uploadedSOPContent: sanitizeForDB(
              uploadedFileBuffer ? `[File uploaded: ${uploadedFileName}]` : data.uploadedSOPContent
            ),
            problems: sanitizeForDB(data.problems),
            additionalReq: sanitizeForDB(data.additionalReq),
            userId,
          },
        });
        sopId = sop.id;
      } else {
        return NextResponse.json({ error: 'Invalid SOP type' }, { status: 400 });
      }
    } catch (dbError) {
      console.error('Failed to create SOP record:', dbError);
      return NextResponse.json(
        { error: 'GENERATION_FAILED', message: 'Failed to create SOP record.' },
        { status: 500 }
      );
    }
    // ─── Return SOP ID ─────────────────────────────────────────────
    return NextResponse.json({ sopId, success: true });
  } catch (error) {
    console.error('SOP Creation Error:', error);
    return NextResponse.json(
      { error: 'CREATE_FAILED', message: 'Failed to create SOP record.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where = session.user.role === 'ADMIN' ? {} : { userId: session.user.id };

    const sops = await prisma.sOP.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        businessName: true,
        createdAt: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({ sops });
  } catch (error) {
    console.error('Fetch SOPs error:', error);
    return NextResponse.json({ error: 'Failed to fetch SOPs' }, { status: 500 });
  }
}
