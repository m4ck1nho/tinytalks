export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  slug: string;
  metaDescription?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  createdAt: string; // Alias for compatibility
  updatedAt: string; // Alias for compatibility
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
  createdAt: string; // Alias for compatibility
}

export interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  created_at: string;
  createdAt: string; // Alias for compatibility
}

export interface AnalyticsData {
  pageViews: number;
  users: number;
  popularPages: {
    path: string;
    views: number;
  }[];
}

export interface Class {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  class_date: string;
  duration_minutes: number;
  class_type?: string;
  topic?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'pending' | 'paid';
  payment_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Homework {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  title: string;
  description: string;
  due_date: string;
  status: 'assigned' | 'submitted' | 'reviewed' | 'completed';
  submission_text?: string;
  submission_file_url?: string;
  submitted_at?: string;
  teacher_feedback?: string;
  grade?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentNotification {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  class_id?: string;
  amount: number;
  payment_method?: string;
  payment_date: string;
  reference_number?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  teacher_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClassRequest {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  preferred_date?: string;
  preferred_time?: string;
  topic?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}