import { Article, Category, PaginatedResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function getArticles(params?: { category?: string; author_id?: number; search?: string }): Promise<PaginatedResponse<Article>> {
  const urlParams = new URLSearchParams();
  if (params?.category) urlParams.append('category', params.category);
  if (params?.author_id) urlParams.append('author_id', params.author_id.toString());
  if (params?.search) urlParams.append('search', params.search);

  const response = await fetch(`${API_URL}/articles?${urlParams.toString()}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
}

export async function getTrendingArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles/trending`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trending articles');
  }

  return response.json();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch article');
  }

  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 3600 }, // Categories change rarely (hourly format)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}
