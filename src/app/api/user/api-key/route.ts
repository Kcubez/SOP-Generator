import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch user's API key (masked)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { geminiApiKey: true },
    });

    const hasKey = !!user?.geminiApiKey;
    const maskedKey = hasKey
      ? `${user!.geminiApiKey!.substring(0, 6)}...${user!.geminiApiKey!.slice(-4)}`
      : null;

    return NextResponse.json({ hasKey, maskedKey });
  } catch (error) {
    console.error('Get API key error:', error);
    return NextResponse.json({ error: 'Failed to fetch API key' }, { status: 500 });
  }
}

// PUT - Update user's API key
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 10) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { geminiApiKey: apiKey.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update API key error:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}
