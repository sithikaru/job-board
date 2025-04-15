// app/api/jobs/admin/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables.');
}

export async function POST(request: Request) {
  try {
    // Check for the Authorization header with Bearer token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    // Parse request body for job details
    const { title, company, location, job_type, description } = await request.json();
    if (!title || !company || !location || !job_type || !description) {
      return NextResponse.json({ message: 'Missing job fields' }, { status: 400 });
    }
    
    // Insert the new job into the database
    const result = await pool.query(
      'INSERT INTO jobs (title, company, location, job_type, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, company, location, job_type, description]
    );
    
    return NextResponse.json(
      { message: 'Job created successfully', job: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
