import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateSalt, hashPassword, validatePasswordComplexity } from '@/utils/password';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { email, name, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then(rows => rows[0]);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    // Create user ID
    const userId = crypto.randomUUID();

    // Create user in database
    await db.insert(users).values({
      id: userId,
      email,
      name: name || null,
      passwordHash: hashedPassword, 
      salt,
      authType: 'credentials',
    });

    // Return success
    return NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
