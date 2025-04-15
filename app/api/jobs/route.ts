// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, title, company, location, job_type, description, created_at FROM jobs ORDER BY created_at DESC'
    );
    const jobs = result.rows;
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
