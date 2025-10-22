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

