import { NextResponse } from 'next/server';
import { loginSchema } from '@/validators/auth.validator';
import { authenticateUser } from '@/services/auth.service';
import { createSession } from '@/lib/session';
export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' }, { status: 400 });
    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ user });
  } catch { return NextResponse.json({ error: 'Unable to log in right now.' }, { status: 500 }); }
}
