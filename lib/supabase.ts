import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create supabase client only when we have valid credentials
let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Create dummy client for build time
    supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  }
} catch {
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
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        data: {
          role: 'student', // Google sign-ups are students by default
        },
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

  // Classes
  getClasses: () =>
    supabase
      .from('classes')
      .select('*')
      .order('class_date', { ascending: true }),

  createClass: (data: Record<string, unknown>) =>
    supabase.from('classes').insert(data).select().single(),

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
    // This will fetch users from auth.users via admin API
    // For now, we'll query from a perspective that students have classes/homework
    const { data: usersData } = await supabase
      .from('classes')
      .select('student_id, student_name, student_email')
      .order('student_name');
    
    // Get unique users
    const uniqueUsers = Array.from(
      new Map((usersData || []).map(item => [item.student_id, item]))
        .values()
    );
    
    return { data: uniqueUsers, error: null };
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

