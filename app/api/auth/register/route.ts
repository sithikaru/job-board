import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/app/lib/db'; // <--- our pg connection from lib/db.ts

export async function POST(request: Request) {
  try {
    // 1. Parse incoming JSON body
    const { email, password } = await request.json();

    // 2. Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing email or password' },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    // 6. Respond with success
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser.rows[0].id,
          email: newUser.rows[0].email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
