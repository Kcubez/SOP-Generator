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

    // ─── Stream AI content ─────────────────────────────────────────────
    const currentSopId = sopId;
    const currentType = type;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send the SOP ID immediately as the first line
          controller.enqueue(encoder.encode(`__SOP_ID__:${currentSopId}\n`));

          let systemInst = '';
          let fullContent = '';

          if (currentType === 'NEW') {
            systemInst = NEW_SOP_SYSTEM_INSTRUCTION;
            const prompt = buildNewSOPPrompt(data);

            const response = await ai.models.generateContentStream({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction: systemInst,
                temperature: 0.7,
                maxOutputTokens: 16000,
              },
            });

            for await (const chunk of response) {
              const text = chunk.text || '';
              if (text) {
                fullContent += text;
                controller.enqueue(encoder.encode(text));
              }
            }
          } else if (currentType === 'MODIFIED') {
            systemInst = MODIFY_SOP_SYSTEM_INSTRUCTION;

            if (uploadedFileBuffer) {
              const bytes = new Uint8Array(uploadedFileBuffer);
              const base64Data = Buffer.from(bytes).toString('base64');
              const textPrompt = buildModifySOPTextPrompt(data);

              const mimeType = uploadedFileMimeType.includes('pdf')
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

              const response = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        inlineData: {
                          mimeType,
                          data: base64Data,
                        },
                      },
                      {
                        text: textPrompt,
                      },
                    ],
                  },
                ],
                config: {
                  systemInstruction: systemInst,
                  temperature: 0.7,
                  maxOutputTokens: 16000,
                },
              });

              for await (const chunk of response) {
                const text = chunk.text || '';
                if (text) {
                  fullContent += text;
                  controller.enqueue(encoder.encode(text));
                }
              }
            } else {
              const prompt = buildModifySOPPrompt(data);
              const response = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                  systemInstruction: systemInst,
                  temperature: 0.7,
                  maxOutputTokens: 16000,
                },
              });

              for await (const chunk of response) {
                const text = chunk.text || '';
                if (text) {
                  fullContent += text;
                  controller.enqueue(encoder.encode(text));
                }
              }
            }
          }

          // Update the DB record with the generated content (best effort)
          const generatedContent = sanitizeForDB(fullContent) || 'Failed to generate SOP';
          try {
            await prisma.sOP.update({
              where: { id: currentSopId },
              data: { generatedContent },
            });
          } catch (updateErr) {
            console.error('Failed to update SOP content:', updateErr);
          }

          controller.enqueue(encoder.encode('\n__STREAM_DONE__'));
          controller.close();
        } catch (error: unknown) {
          console.error('SOP generation stream error:', error);
          const errMsg = error instanceof Error ? error.message : String(error);

          let errorPayload = '__ERROR__:GENERATION_FAILED';
          if (
            errMsg.includes('429') ||
            errMsg.includes('quota') ||
            errMsg.includes('RESOURCE_EXHAUSTED') ||
            errMsg.includes('rate limit')
          ) {
            errorPayload = '__ERROR__:API_LIMIT_REACHED';
          } else if (
            errMsg.includes('API_KEY_INVALID') ||
            errMsg.includes('401') ||
            errMsg.includes('403')
          ) {
            errorPayload = '__ERROR__:INVALID_API_KEY';
          }

          // Clean up the empty SOP record on error
          try {
            await prisma.sOP.delete({ where: { id: currentSopId } });
          } catch {
            // Ignore cleanup errors
          }

          controller.enqueue(encoder.encode(`\n${errorPayload}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('SOP generation error:', error);

    const errMsg = error instanceof Error ? error.message : String(error);
    if (
      errMsg.includes('429') ||
      errMsg.includes('quota') ||
      errMsg.includes('RESOURCE_EXHAUSTED') ||
      errMsg.includes('rate limit')
    ) {
      return NextResponse.json(
        {
          error: 'API_LIMIT_REACHED',
          message:
            'Your Gemini API key has reached its usage limit. Please change your API key to continue generating SOPs.',
        },
        { status: 429 }
      );
    }

    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('401') || errMsg.includes('403')) {
      return NextResponse.json(
        {
          error: 'INVALID_API_KEY',
          message: 'Your Gemini API key is invalid. Please update your API key.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'GENERATION_FAILED',
        message: 'Failed to generate SOP. Please check your Gemini API key.',
      },
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

// ─── System Instructions ──────────────────────────────────────────────────────

const NEW_SOP_SYSTEM_INSTRUCTION = `You are an expert Standard Operating Procedure (SOP) writer. Create professional, detailed, and well-structured SOPs.

Format the SOP using clean HTML with proper headings, tables, lists, and sections. Use professional styling.
The SOP should follow this structure:
1. Document Header (Title, Version, Date, Department)
2. Purpose & Scope
3. Definitions & Abbreviations
4. Roles & Responsibilities
5. Procedure (Step-by-step with detailed instructions)
6. Decision Points & Flowchart descriptions
7. Tools & Resources Required
8. Standards & Compliance
9. Risk Assessment & Controls
10. KPIs & Expected Outcomes
11. Version Control & Review Schedule
12. Training & Communication Plan
13. Appendices & References

IMPORTANT RULES:
- You MUST use the EXACT Effective Date provided by the user. Do NOT change, modify, or generate a different date. Copy the date value exactly as provided.
- You MUST use the EXACT Version number provided by the user.
- For table headers (<th>), use this style: background-color: #4338ca; color: #ffffff; padding: 10px 14px; text-align: left; font-weight: 600;
- For table cells (<td>), use this style: padding: 8px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;

FONT & STYLE REQUIREMENTS:
- Use consistent font throughout: font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
- All headings (h1, h2, h3) must use the same font family as body text.
- Do NOT mix serif and sans-serif fonts.
- Ensure consistent font sizes: h1=1.75rem, h2=1.35rem, h3=1.1rem, body=0.95rem.
- Use consistent line-height: 1.7 throughout.
- Ensure tables have consistent column widths using percentage-based widths.

Use tables where appropriate. Make it comprehensive and ready to use. Format using clean, semantic HTML.
Do NOT use markdown. Use HTML elements like <h1>, <h2>, <h3>, <table>, <ul>, <ol>, <p>, etc.
Wrap everything in a single <div class="sop-document" style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #1e293b;">.
Do NOT wrap the output in a code block. Output raw HTML only.`;

const MODIFY_SOP_SYSTEM_INSTRUCTION = `You are an expert Standard Operating Procedure (SOP) analyst and writer. Your job is to:
1. Analyze the existing SOP document provided
2. Identify and address all problems mentioned by the user
3. Generate an improved, professional SOP that resolves all issues
4. Incorporate any additional requirements specified

CRITICAL DATE RULES:
- You MUST preserve ALL original dates from the uploaded SOP document EXACTLY as they appear.
- Do NOT change, modify, or generate different dates. If the original SOP has "2023-10-27" as the effective date, keep it as "2023-10-27".
- Only change dates if the user specifically requests a date change in their problems or additional requirements.
- The "Last Review Date" or "Modified Date" should reflect the current modification date if appropriate, but the original effective dates must be preserved.

Format the improved SOP using clean HTML with proper headings, tables, lists, and sections.
Maintain the original structure where appropriate but improve where needed.
Add any missing sections that should be in a professional SOP.

FONT & STYLE REQUIREMENTS:
- Use consistent font throughout: font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
- All headings (h1, h2, h3) must use the same font family as body text.
- Do NOT mix serif and sans-serif fonts.
- Ensure consistent font sizes: h1=1.75rem, h2=1.35rem, h3=1.1rem, body=0.95rem.
- Use consistent line-height: 1.7 throughout.
- Ensure tables have consistent column widths using percentage-based widths.
- For table headers (<th>), use: background-color: #4338ca; color: #ffffff; padding: 10px 14px; text-align: left; font-weight: 600;
- For table cells (<td>), use: padding: 8px 14px; border-bottom: 1px solid #e2e8f0; color: #334155;

IMPORTANT: At the very end of the SOP document, you MUST include a special section called "AI Suggestions & Recommendations".
This section should:
- Analyze the problems the user mentioned
- Provide specific, actionable suggestions to resolve each problem
- Recommend best practices and improvements that go beyond the stated problems
- Suggest preventive measures to avoid similar issues in the future
- Highlight any gaps or potential risks that the user may not have considered

Format this section with a distinct visual style using a light blue/info background. Example:
<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-top: 32px;">
  <h2 style="color: #1e40af; margin-bottom: 12px;">💡 AI Suggestions & Recommendations</h2>
  ...suggestions here...
</div>

Do NOT use markdown. Use HTML elements like <h1>, <h2>, <h3>, <table>, <ul>, <ol>, <p>, etc.
Wrap everything in a single <div class="sop-document" style="font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #1e293b;">.
Do NOT wrap the output in a code block. Output raw HTML only.`;

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildNewSOPPrompt(data: Record<string, string>): string {
  return `Create a comprehensive Standard Operating Procedure (SOP) document based on the following information:

## Process / Procedure Information
- Business Name: ${data.businessName || 'N/A'}
- Business Type: ${data.businessType || 'N/A'}
- Purpose / Objective: ${data.purpose || 'N/A'}
- Business Progress (Start to End): ${data.progressStartEnd || 'N/A'}
- Scope (Department / Team): ${data.scope || 'N/A'}

## Stakeholders & Responsibility
- Personnel who must follow this SOP (Roles/Positions): ${data.stakeholders || 'N/A'}
- Responsibilities (Who does what): ${data.responsibility || 'N/A'}
- Approval Authority: ${data.approvalAuthority || 'N/A'}

## Step-by-Step Procedure
- Process steps (what to do, who does it, when/where): ${data.stepByStep || 'N/A'}
- Decision Points (Yes/No): ${data.decisionPoints || 'N/A'}

## Tools, Documents & Resources
- Software / System / Equipment / Tools: ${data.tools || 'N/A'}
- Reference Documents (Policy, Guideline, Form, Template): ${data.referenceDocuments || 'N/A'}

## Standards & Compliance
- Company Policy / Law / Regulation / Quality Standards: ${data.complianceStandards || 'N/A'}
- Dos & Don'ts: ${data.dosAndDonts || 'N/A'}

## Risks & Controls
- Potential Risks: ${data.risks || 'N/A'}
- Control / Prevention Methods: ${data.controls || 'N/A'}

## KPI / Output
- Expected Result / Output: ${data.expectedOutput || 'N/A'}
- Success Measurement KPI / Metrics: ${data.kpiMetrics || 'N/A'}

## Version Control & Review
- SOP Version No.: ${data.versionNo || '1.0'}
- Effective Date: ${data.effectiveDate || new Date().toISOString().split('T')[0]} (YOU MUST USE THIS EXACT DATE IN THE GENERATED DOCUMENT. DO NOT CHANGE IT.)
- Review Cycle: ${data.reviewCycle || 'N/A'}
- Revision History: ${data.revisionHistory || 'N/A'}

## Training & Communication
- Training Method: ${data.trainingMethod || 'N/A'}
- New Staff Induction Process: ${data.inductionProcess || 'N/A'}
- SOP Update Notification Method: ${data.updateNotification || 'N/A'}

Please generate a professional, comprehensive, detailed SOP document with all sections properly formatted.`;
}

function buildModifySOPPrompt(data: Record<string, string>): string {
  return `I have an existing SOP document that needs to be modified and improved. Please analyze the existing SOP, identify the problems mentioned, and generate an improved version that addresses all issues.

## Existing SOP Content:
${data.uploadedSOPContent || 'No content provided'}

## Problems Identified:
${data.problems || 'No specific problems mentioned'}

## Additional Requirements:
${data.additionalReq || 'No additional requirements'}

Please:
1. Analyze the existing SOP for the mentioned problems
2. Address each problem with appropriate solutions
3. Incorporate any additional requirements
4. Generate an improved, professional SOP that resolves all issues
5. Maintain the original structure where appropriate but improve where needed
6. Add any missing sections that should be in a professional SOP
7. At the very end, include an "AI Suggestions & Recommendations" section with specific, actionable suggestions to solve the problems mentioned and prevent future issues`;
}

function buildModifySOPTextPrompt(data: Record<string, string>): string {
  return `The attached document is an existing SOP that needs to be modified and improved. Please analyze it carefully, identify the problems mentioned below, and generate a complete improved version that addresses all issues.

IMPORTANT: Preserve ALL original dates, version numbers, and document identifiers from the uploaded document EXACTLY as they appear. Do NOT change any dates unless specifically requested.

## Problems Identified:
${data.problems || 'No specific problems mentioned'}

## Additional Requirements:
${data.additionalReq || 'No additional requirements'}

Please:
1. Read and understand the attached SOP document completely
2. Analyze the existing SOP for the mentioned problems
3. Address each problem with appropriate solutions
4. Incorporate any additional requirements
5. Generate an improved, professional SOP that resolves all issues
6. Maintain the original structure where appropriate but improve where needed
7. Preserve all original dates, version numbers, and document metadata
8. Add any missing sections that should be in a professional SOP
9. At the very end, include an "AI Suggestions & Recommendations" section with specific, actionable suggestions to solve the problems mentioned and prevent future issues`;
}
