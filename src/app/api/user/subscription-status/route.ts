import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ status: 'unauthenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        expiresAt: true,
        subscriptionStart: true,
      },
    });

    if (!user) {
      return NextResponse.json({ status: 'expired', reason: 'user_not_found' });
    }

    // Admins are exempt
    if (user.role === 'ADMIN') {
      return NextResponse.json({ status: 'active' });
    }

    const now = new Date();

    if (user.expiresAt && now > user.expiresAt) {
      return NextResponse.json({
        status: 'expired',
        reason: 'subscription_expired',
        message: 'Your subscription has expired. Please contact admin for renewal.',
        messageMM: 'သင့် subscription သက်တမ်းကုန်ဆုံးသွားပါပြီ။ သက်တမ်းတိုးရန် admin ကို ဆက်သွယ်ပါ။',
      });
    }

    return NextResponse.json({ status: 'active' });
  } catch (error) {
    console.error('Subscription status check error:', error);
    return NextResponse.json({ status: 'active' });
  }
}
