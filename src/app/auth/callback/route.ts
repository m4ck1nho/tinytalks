import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
        },
      }
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);
    
    // If no explicit 'next' parameter, redirect based on user role
    if (!next && data.user) {
      const userRole = data.user.user_metadata?.role || 'student';
      const redirectPath = userRole === 'admin' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(`${origin}${redirectPath}`);
    }
  }

  // Redirect to the 'next' parameter or default to student dashboard
  return NextResponse.redirect(`${origin}${next || '/dashboard'}`);
}

