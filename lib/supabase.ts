import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create supabase client only when we have valid credentials
let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey && 
      supabaseUrl.startsWith('https://') && 
      !supabaseUrl.includes('dummy') &&
      supabaseAnonKey.length > 20) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    console.log('✅ Supabase client initialized successfully');
  } else {
    console.warn('⚠️ Supabase credentials missing or invalid. Using dummy client.');
    console.warn('URL:', supabaseUrl ? 'Set' : 'Missing', 'Key:', supabaseAnonKey ? 'Set' : 'Missing');
    // Create dummy client for build time
    supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  }
} catch (error) {
  console.error('❌ Supabase initialization error:', error);
  // Fallback for any initialization errors
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
}

// Helper functions for common operations
export const supabaseClient = supabase;

// Auth helpers
export const auth = {
  signIn: (email: string, password: string) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signUp: (email: string, password: string, fullName?: string) => 
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student', // All sign-ups are students by default
        },
      },
    }),
  
  signInWithGoogle: () => 
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback',
      },
    }),
  
  signInWithGoogleAdmin: () => 
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/admin/dashboard`,
      },
    }),
  
  signOut: () => 
    supabase.auth.signOut(),
  
  getUser: () => 
    supabase.auth.getUser(),
  
  onAuthStateChange: (callback: (user: unknown) => void) => 
    supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    }),
};

// Database helpers
export const db = {
  // Blog posts
  getBlogPosts: (published?: boolean) => {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (published !== undefined) {
      query = query.eq('published', published);
    }
    
    return query;
  },

  getPublishedBlogPostBySlug: (slug: string) =>
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle(),

  createBlogPost: (data: Record<string, unknown>) =>
    supabase.from('blog_posts').insert(data).select().single(),

  updateBlogPost: (id: string, data: Record<string, unknown>) =>
    supabase.from('blog_posts').update(data).eq('id', id).select().single(),

  deleteBlogPost: (id: string) =>
    supabase.from('blog_posts').delete().eq('id', id),

  // Contact messages
  getContactMessages: () =>
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false }),

  createContactMessage: (data: Record<string, unknown>) =>
    supabase.from('contact_messages').insert(data).select().single(),

  updateContactMessage: (id: string, data: Record<string, unknown>) =>
    supabase.from('contact_messages').update(data).eq('id', id),

  deleteContactMessage: (id: string) =>
    supabase.from('contact_messages').delete().eq('id', id),

  // Site Settings
  getSettings: () =>
    supabase.from('site_settings').select('*').order('key', { ascending: true }),

  getSetting: (key: string) =>
    supabase.from('site_settings').select('*').eq('key', key).maybeSingle(),

  updateSetting: (key: string, value: Record<string, unknown>, description?: string) => {
    const data: Record<string, unknown> = {
      value,
      updated_at: new Date().toISOString(),
    };
    if (description) {
      data.description = description;
    }
    return supabase
      .from('site_settings')
      .upsert({ key, ...data }, { onConflict: 'key' })
      .select()
      .single();
  },

  // Classes
  getClasses: () =>
    supabase
      .from('classes')
      .select('*')
      .order('class_date', { ascending: true }),

  createClass: (data: Record<string, unknown>) =>
    supabase.from('classes').insert(data).select().single(),

  // Generate classes automatically based on weekly schedule
  generateClassesFromWeeklySchedule: async (
    studentId: string,
    studentName: string,
    studentEmail: string,
    weeklySchedule: Array<{ day_of_week: number; time: string }>,
    totalLessons: number,
    startDate?: string
  ) => {
    const classes: Array<Record<string, unknown>> = [];
    const today = startDate ? new Date(startDate) : new Date();
    
    // Find the first available date for each day of week
    const scheduledDates: Date[] = [];
    let lessonCount = 0;
    let weekOffset = 0;
    const maxIterations = 100; // Safety limit to prevent infinite loops
    let iterations = 0;
    
    console.log('Starting class generation:', {
      totalLessons,
      weeklySchedule,
      today: today.toISOString()
    });
    
    while (lessonCount < totalLessons && iterations < maxIterations) {
      iterations++;
      for (const schedule of weeklySchedule) {
        if (lessonCount >= totalLessons) break;
        
        // Calculate date for this week's occurrence of this day
        const currentDay = today.getDay();
        let daysUntilNext = (schedule.day_of_week - currentDay + 7) % 7;
        if (daysUntilNext === 0) {
          // If it's the same day, check if the time has passed
          const currentTime = today.getHours() * 60 + today.getMinutes();
          const scheduleTime = parseInt(schedule.time.split(':')[0]) * 60 + parseInt(schedule.time.split(':')[1]);
          if (currentTime >= scheduleTime) {
            // Time has passed today, schedule for next week
            daysUntilNext = 7;
          }
        }
        
        const classDate = new Date(today);
        classDate.setDate(today.getDate() + daysUntilNext + (weekOffset * 7));
        classDate.setHours(parseInt(schedule.time.split(':')[0]), parseInt(schedule.time.split(':')[1]), 0, 0);
        
        // Ensure date is not in the past
        if (classDate < today) {
          classDate.setDate(classDate.getDate() + 7);
        }
        
        scheduledDates.push(new Date(classDate));
        lessonCount++;
      }
      weekOffset++;
    }
    
    if (iterations >= maxIterations) {
      console.error('Max iterations reached, stopping class generation');
      return { data: null, error: { message: 'Max iterations reached while generating classes' } };
    }
    
    console.log(`Generated ${scheduledDates.length} class dates`);
    
    // Sort dates chronologically
    scheduledDates.sort((a, b) => a.getTime() - b.getTime());
    
    // Create classes
    for (let i = 0; i < scheduledDates.length; i++) {
      const classDate = scheduledDates[i];
      const isFirstClass = i === 0;
      
      // Calculate payment amount (first class is free)
      const lessonPrice = 2000; // 2000 rubles per lesson
      const paymentAmount = isFirstClass ? 0 : lessonPrice;
      
      classes.push({
        student_id: studentId,
        student_name: studentName,
        student_email: studentEmail,
        class_date: classDate.toISOString(),
        duration_minutes: 50,
        class_type: 'Individual',
        status: 'pending_payment',
        payment_status: 'pending',
        payment_amount: paymentAmount,
        topic: null,
        notes: null,
      });
    }
    
    console.log(`Attempting to insert ${classes.length} classes into database`);
    console.log('Classes to insert:', classes.map(c => ({
      student_name: c.student_name,
      class_date: c.class_date,
      payment_amount: c.payment_amount
    })));
    
    // Insert all classes
    const { data, error } = await supabase
      .from('classes')
      .insert(classes)
      .select();
    
    if (error) {
      console.error('Error inserting classes:', error);
      return { data: null, error };
    }
    
    console.log(`Successfully inserted ${data?.length || 0} classes`);
    
    return { data, error };
  },

  updateClass: (id: string, data: Record<string, unknown>) =>
    supabase.from('classes').update(data).eq('id', id).select().single(),

  deleteClass: (id: string) =>
    supabase.from('classes').delete().eq('id', id),

  // Homework
  getHomework: () =>
    supabase
      .from('homework')
      .select('*')
      .order('due_date', { ascending: true }),

  createHomework: (data: Record<string, unknown>) =>
    supabase.from('homework').insert(data).select().single(),

  updateHomework: (id: string, data: Record<string, unknown>) =>
    supabase.from('homework').update(data).eq('id', id).select().single(),

  deleteHomework: (id: string) =>
    supabase.from('homework').delete().eq('id', id),

  // Payment Notifications
  getPaymentNotifications: () =>
    supabase
      .from('payment_notifications')
      .select('*')
      .order('created_at', { ascending: false }),

  createPaymentNotification: (data: Record<string, unknown>) =>
    supabase.from('payment_notifications').insert(data).select().single(),

  updatePaymentNotification: (id: string, data: Record<string, unknown>) =>
    supabase.from('payment_notifications').update(data).eq('id', id).select().single(),

  deletePaymentNotification: (id: string) =>
    supabase.from('payment_notifications').delete().eq('id', id),

  // Real-time subscriptions
  subscribeToBlogPosts: (callback: (payload: unknown) => void) =>
    supabase
      .channel('blog_posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, callback)
      .subscribe(),

  subscribeToMessages: (callback: (payload: unknown) => void) =>
    supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, callback)
      .subscribe(),

  subscribeToClasses: (callback: (payload: unknown) => void) =>
    supabase
      .channel('classes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classes' }, callback)
      .subscribe(),

  subscribeToHomework: (callback: (payload: unknown) => void) =>
    supabase
      .channel('homework_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, callback)
      .subscribe(),

  subscribeToPaymentNotifications: (callback: (payload: unknown) => void) =>
    supabase
      .channel('payment_notifications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_notifications' }, callback)
      .subscribe(),

  // Class Requests
  getClassRequests: () =>
    supabase
      .from('class_requests')
      .select('*')
      .order('created_at', { ascending: false }),

  createClassRequest: (data: Record<string, unknown>) =>
    supabase.from('class_requests').insert(data).select().single(),

  updateClassRequest: (id: string, data: Record<string, unknown>) =>
    supabase.from('class_requests').update(data).eq('id', id).select().single(),

  deleteClassRequest: (id: string) =>
    supabase.from('class_requests').delete().eq('id', id),

  subscribeToClassRequests: (callback: (payload: unknown) => void) =>
    supabase
      .channel('class_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'class_requests' }, callback)
      .subscribe(),

  // Users - Admin only
  getAllUsers: async () => {
    try {
      // First, try to fetch from API route (uses service role key to get all users)
      try {
        // Get the current session token
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (token) {
          const response = await fetch('/api/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
              console.log('getAllUsers - Fetched from API:', result.data.length, 'students');
              return { data: result.data, error: null };
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.warn('getAllUsers - API route failed:', response.status, errorData);
          }
        } else {
          console.warn('getAllUsers - No session token, falling back to table queries');
        }
      } catch (apiError) {
        console.warn('getAllUsers - API route error, falling back to table queries:', apiError);
      }

      // Fallback: Fetch users from multiple sources (if API route not available or no service key)
      const [classesResult, homeworkResult, classRequestsResult] = await Promise.all([
        supabase
          .from('classes')
          .select('student_id, student_name, student_email')
          .order('student_name'),
        supabase
          .from('homework')
          .select('student_id, student_name, student_email')
          .order('student_name'),
        supabase
          .from('class_requests')
          .select('student_id, student_name, student_email')
          .order('student_name')
      ]);
      
      // Log results for debugging
      console.log('getAllUsers - Classes:', classesResult.data?.length || 0, classesResult.error ? 'ERROR: ' + classesResult.error.message : 'OK');
      console.log('getAllUsers - Homework:', homeworkResult.data?.length || 0, homeworkResult.error ? 'ERROR: ' + homeworkResult.error.message : 'OK');
      console.log('getAllUsers - Class Requests:', classRequestsResult.data?.length || 0, classRequestsResult.error ? 'ERROR: ' + classRequestsResult.error.message : 'OK');
      
      // Combine all sources (ignore errors, use what we can get)
      const allUsers: Array<{ student_id: string; student_name: string; student_email: string }> = [
        ...(classesResult.data || []),
        ...(homeworkResult.data || []),
        ...(classRequestsResult.data || [])
      ];
      
      console.log('getAllUsers - Total combined:', allUsers.length);
      
      // Debug: Show sample of what we're getting
      if (allUsers.length > 0) {
        const sampleIds = [...new Set(allUsers.slice(0, 5).map(u => u.student_id).filter(Boolean))];
        const sampleEmails = [...new Set(allUsers.slice(0, 5).map(u => u.student_email).filter(Boolean))];
        console.log('getAllUsers - Sample student_ids:', sampleIds);
        console.log('getAllUsers - Sample emails:', sampleEmails);
      }
      
      // Get unique users by student_id (include those with student_id)
      // Also group by email for students without student_id
      const userMapById = new Map<string, { student_id: string; student_name: string; student_email: string }>();
      const userMapByEmail = new Map<string, { student_id: string; student_name: string; student_email: string }>();
      
      allUsers
        .filter(item => item && (item.student_id || item.student_email)) // Include items with student_id OR email
        .forEach(item => {
          if (item.student_id && item.student_id.trim() !== '') {
            // Group by student_id
            if (!userMapById.has(item.student_id)) {
              userMapById.set(item.student_id, {
                student_id: item.student_id,
                student_name: item.student_name || 'Unknown',
                student_email: item.student_email || 'No email'
              });
            }
          } else if (item.student_email && item.student_email.trim() !== '') {
            // Group by email for students without student_id
            const emailKey = item.student_email.toLowerCase().trim();
            if (!userMapByEmail.has(emailKey)) {
              userMapByEmail.set(emailKey, {
                student_id: '', // No student_id
                student_name: item.student_name || 'Unknown',
                student_email: item.student_email
              });
            }
          }
        });
      
      // Combine both maps, prioritizing student_id entries
      const uniqueUsers = [
        ...Array.from(userMapById.values()),
        ...Array.from(userMapByEmail.values())
      ].sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''));
      
      console.log('getAllUsers - Unique users by ID:', userMapById.size);
      console.log('getAllUsers - Unique users by email:', userMapByEmail.size);
      console.log('getAllUsers - Total unique users:', uniqueUsers.length);
      if (uniqueUsers.length > 0) {
        console.log('getAllUsers - First 3 users:', uniqueUsers.slice(0, 3).map(u => ({ name: u.student_name, email: u.student_email, id: u.student_id })));
      }
      
      // Return error if any critical query failed, but still return what we have
      const hasError = classesResult.error || homeworkResult.error || classRequestsResult.error;
      if (hasError && uniqueUsers.length === 0) {
        return { 
          data: null, 
          error: classesResult.error || homeworkResult.error || classRequestsResult.error 
        };
      }
      
      return { data: uniqueUsers, error: null };
    } catch (error) {
      console.error('getAllUsers - Unexpected error:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Unknown error fetching users') 
      };
    }
  },

};

// Storage helpers
export const storage = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  },

  deleteImage: (bucket: string, path: string) =>
    supabase.storage.from(bucket).remove([path]),
};

export default supabase;

