export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  slug: string;
  slug_en?: string; // English slug for /en/blog/[slug] routes
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
  status: 'pending_payment' | 'scheduled' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'unpaid' | 'paid';
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
  preferred_schedules?: string; // JSON string of array of {date, time}
  weekly_schedule?: string; // JSON string of array of {day_of_week, time} for recurring classes
  payment_preference?: 'weekly' | 'all_at_once';
  topic?: string;
  message?: string;
  lessons_per_week?: number;
  total_lessons?: number;
  first_class_free?: boolean;
  status: 'pending' | 'awaiting_payment' | 'payment_confirmed' | 'approved' | 'rejected' | 'teacher_edited';
  teacher_edits?: string; // JSON string of teacher's proposed changes
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyScheduleSlot {
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  time: string; // HH:MM format
}

export interface ClassPackage {
  id: string;
  student_id: string;
  weekly_schedule: string; // JSON string of WeeklyScheduleSlot[]
  total_lessons: number;
  completed_lessons: number;
  payment_preference: 'weekly' | 'all_at_once';
  first_four_paid: boolean;
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