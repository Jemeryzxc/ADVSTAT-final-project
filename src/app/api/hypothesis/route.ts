import { NextResponse } from 'next/server';
import { calculateTwoSampleZTest, calculateZTest } from '@/utils/statistics';
export async function POST(request: Request) { try { const body = await request.json(); return NextResponse.json(body.sampleType === 'two' ? calculateTwoSampleZTest(body) : calculateZTest(body)); } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Could not run test.'},{status:400}); } }
