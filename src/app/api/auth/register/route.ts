import { NextResponse } from 'next/server';
import { registerSchema } from '@/validators/auth.validator';
import { registerUser } from '@/services/auth.service';
import { createSession } from '@/lib/session';
export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' }, { status: 400 });
    const user = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password);
    await createSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to register.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
