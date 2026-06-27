import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { name, email, password, role, subscriptionStart, expiresAt } = await req.json();

    // If email is being changed, check for uniqueness
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Email already in use by another user' },
          { status: 400 }
        );
      }
    }

    // If password is provided, validate and hash it
    let hashedPassword: string | undefined;
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        );
      }
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Parse and validate dates
    let parsedSubscriptionStart: Date | null | undefined = undefined;
    let parsedExpiresAt: Date | null | undefined = undefined;

    if (subscriptionStart !== undefined) {
      if (subscriptionStart) {
        parsedSubscriptionStart = new Date(subscriptionStart);
        if (isNaN(parsedSubscriptionStart.getTime())) {
          return NextResponse.json({ error: 'Invalid subscription start date' }, { status: 400 });
        }
      } else {
        parsedSubscriptionStart = null;
      }
    }

    if (expiresAt !== undefined) {
      if (expiresAt) {
        parsedExpiresAt = new Date(expiresAt);
        if (isNaN(parsedExpiresAt.getTime())) {
          return NextResponse.json({ error: 'Invalid expiration date' }, { status: 400 });
        }
      } else {
        parsedExpiresAt = null;
      }
    }

    // Validate expiration is after subscription start (when both are provided)
    if (parsedSubscriptionStart && parsedExpiresAt) {
      if (parsedExpiresAt <= parsedSubscriptionStart) {
        return NextResponse.json(
          { error: 'Expiration date must be after subscription start date' },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      ...(name && { name }),
      ...(email && { email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(role && { role }),
    };

    if (parsedSubscriptionStart !== undefined) {
      updateData.subscriptionStart = parsedSubscriptionStart;
    }
    if (parsedExpiresAt !== undefined) {
      updateData.expiresAt = parsedExpiresAt;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStart: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    if (id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
