import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ status: 'ok' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        role: true,
        subscriptionStart: true,
        expiresAt: true,
      },
    });

    if (!user) {
      // Don't reveal that user doesn't exist
      return NextResponse.json({ status: 'ok' });
    }

    // Admins are exempt
    if (user.role === 'ADMIN') {
      return NextResponse.json({ status: 'ok' });
    }

    const now = new Date();

    if (user.subscriptionStart && now < user.subscriptionStart) {
      const startDate = user.subscriptionStart.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return NextResponse.json({
        status: 'blocked',
        reason: 'not_started',
        message: `Your subscription has not started yet. It will be activated on ${startDate}.`,
        messageMM: `သင့် subscription မစတင်ရသေးပါ။ ${startDate} တွင် အသက်ဝင်ပါမည်။`,
      });
    }

    if (user.expiresAt && now > user.expiresAt) {
      return NextResponse.json({
        status: 'blocked',
        reason: 'expired',
        message: 'Your subscription has expired. Please contact admin for renewal.',
        messageMM: 'သင့် subscription သက်တမ်းကုန်ဆုံးသွားပါပြီ။ သက်တမ်းတိုးရန် admin ကို ဆက်သွယ်ပါ။',
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json({ status: 'ok' });
  }
}
