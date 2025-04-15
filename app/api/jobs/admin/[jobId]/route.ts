import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables.');
}

export async function DELETE(
  request: Request,
  { params }: { params: { jobId: string } }
) {
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
    
    const { jobId } = params;
    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }
    
    // Delete the job from the database
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [jobId]);
    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { message: 'Job deleted successfully', job: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
