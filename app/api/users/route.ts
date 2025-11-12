import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // If service role key is available, use it to verify user and get all users
    if (supabaseServiceKey) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // If we have a token, verify the user is admin
      if (token) {
        const { data: { user }, error: userError } = await adminClient.auth.getUser(token);
        
        if (userError || !user) {
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
      } else {
        // No token provided - require authentication
        return NextResponse.json(
          { error: 'Unauthorized - No token provided' },
          { status: 401 }
        );
      }

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

