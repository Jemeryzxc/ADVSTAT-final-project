import { NextResponse } from 'next/server';
import { calculateRegression } from '@/utils/statistics';
export async function POST(request: Request) {
  try { const body = await request.json(); if (!Array.isArray(body.xs) || !Array.isArray(body.ys)) throw new Error('Enter X and Y values as lists.'); return NextResponse.json(calculateRegression(body.xs.map(Number), body.ys.map(Number))); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Could not calculate regression.' }, { status: 400 }); }
}
