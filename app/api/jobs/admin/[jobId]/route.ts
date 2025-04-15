import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import jwt from 'jsonwebtoken';

// Validate required env
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('Missing JWT_SECRET in environment variables.');

// ✅ Correct dynamic param parsing for Next.js 15+
export async function DELETE(req: NextRequest, context: { params: any }) {
  try {
    const { jobId } = context.params;

    if (!jobId) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    // ✅ Check for Bearer token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      jwt.verify(token, JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // ✅ Execute DELETE query
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [jobId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Job deleted successfully', job: result.rows[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting job:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
