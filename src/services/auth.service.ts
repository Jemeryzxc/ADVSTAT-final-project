import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();
  if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) throw new Error('An account with this email already exists.');
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({ data: { name: name.trim(), email: normalizedEmail, passwordHash }, select: { id: true, name: true, email: true } });
}
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return { id: user.id, name: user.name, email: user.email };
}
