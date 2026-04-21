export interface Category {
  id: number;
  name: string;
  slug: string;
  color_code: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  role: string;
  bio: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  is_trending: boolean;
  is_urgent: boolean;
  published_at: string;
  created_at: string;
  category: Category;
  author: Author;
  shares_count: number;
}

export interface Multimedia {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  type: 'video' | 'podcast';
  external_url: string;
  embed_url: string | null;
  thumbnail: string | null;
  duration: string | null;
  is_featured: boolean;
  status: string;
  views_count: number;
  author_id: number;
  author?: Author;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
