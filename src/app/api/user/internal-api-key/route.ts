import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// This route runs on Node.js runtime to use Prisma and next-auth
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { geminiApiKey: true },
    });

    const apiKey = user?.geminiApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'NO_API_KEY' }, { status: 400 });
    }

    // ONLY return to internal server calls (don't expose to public if possible, though protected by session)
    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('Internal API key error:', error);
    return NextResponse.json({ error: 'Failed to fetch API key' }, { status: 500 });
  }
}
