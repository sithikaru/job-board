import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/app/lib/db';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables.');
}

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

    // 3. Retrieve the user from the database
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    const user = userResult.rows[0];
    
    // 4. Compare the provided password with the stored hash
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // 5. Generate a JWT token
    // Optionally, you can include additional claims like role or expiration here.
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Token will expire in 1 hour
    );
    
    // 6. Send the token in the response
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
