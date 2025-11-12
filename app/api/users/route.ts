import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get the current user's session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // Create client to check authentication
    const cookieStore = await cookies();
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    });

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = user.user_metadata?.role || 'student';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // If service role key is available, use it to query auth.users directly
    if (supabaseServiceKey) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Query auth.users to get all users with role 'student' or no role
      const { data: users, error: usersError } = await adminClient.auth.admin.listUsers();

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return NextResponse.json(
          { error: 'Failed to fetch users', details: usersError.message },
          { status: 500 }
        );
      }

      // Filter to only students and format the response
      const students = (users.users || [])
        .filter(u => {
          const role = u.user_metadata?.role || 'student';
          return role === 'student' || !u.user_metadata?.role;
        })
        .map(u => ({
          student_id: u.id,
          student_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Unknown',
          student_email: u.email || 'No email',
        }))
        .sort((a, b) => a.student_name.localeCompare(b.student_name));

      return NextResponse.json({ data: students, error: null });
    }

    // Fallback: If no service role key, return error with instructions
    return NextResponse.json(
      {
        error: 'Service role key not configured',
        message: 'Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables to fetch all users',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

