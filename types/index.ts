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
