// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // use anon key, not service role
);

const AUTHORIZED_EMAIL = 'Belhadjessghaiertaha@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Only allow your email
    if (email !== AUTHORIZED_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized email address' },
        { status: 401 }
      );
    }

    // Try to sign in
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // If user doesn't exist yet, create it
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({ email, password });

      if (signUpError) {
        return NextResponse.json(
          { error: 'Failed to create account' },
          { status: 500 }
        );
      }

      // Create profile entry linked to user.id
      await supabase.from('profiles').upsert({
        user_id: signUpData.user?.id,
        email,
        name: 'Taha Belhadj Essghaier',
        level: 1,
        xp: 0,
        streak: 0,
      });

      return NextResponse.json({
        token: signUpData.session?.access_token,
        user: {
          email,
          name: 'Taha Belhadj Essghaier',
        },
      });
    }

    // If login succeeded, return token
    return NextResponse.json({
      token: signInData.session?.access_token,
      user: {
        email,
        name: 'Taha Belhadj Essghaier',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}