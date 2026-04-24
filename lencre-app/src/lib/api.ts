import { Article, Category, Multimedia, PaginatedResponse } from '@/types';

export interface JobOffer {
  id: number;
  title: string;
  slug: string;
  company_name: string;
  company_logo: string | null;
  description: string | null;
  sector: string | null;
  education_level: string | null;
  type: string;
  location: string;
  featured_image: string | null;
  is_featured: boolean;
  published_at: string | null;
  deadline_at: string | null;
  external_link: string | null;
  status: string;
  author_id: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  type_label?: string;
  type_color?: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  sector: string | null;
  is_featured: boolean;
  sort_order: number;
  active_offers_count?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function getArticles(params?: { category?: string; author_id?: number; search?: string }): Promise<PaginatedResponse<Article>> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.category) urlParams.append('category', params.category);
    if (params?.author_id) urlParams.append('author_id', params.author_id.toString());
    if (params?.search) urlParams.append('search', params.search);

    const response = await fetch(`${API_URL}/articles?${urlParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
    return response.json();
  } catch (error) {
    console.error('getArticles error:', error);
    return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  }
}

export async function getTrendingArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_URL}/articles/trending`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('getTrendingArticles error:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await fetch(`${API_URL}/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('getArticleBySlug error:', error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

/** Job Offers APIs */
export async function getJobOffers(params?: {
  sector?: string;
  education_level?: string;
  type?: string;
  search?: string;
  date_range?: string;
  page?: number;
}): Promise<PaginatedResponse<JobOffer>> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.sector) urlParams.append('sector', params.sector);
    if (params?.education_level) urlParams.append('education_level', params.education_level);
    if (params?.type) urlParams.append('type', params.type);
    if (params?.search) urlParams.append('search', params.search);
    if (params?.date_range) urlParams.append('date_range', params.date_range);
    if (params?.page) urlParams.append('page', params.page.toString());

    const response = await fetch(`${API_URL}/job-offers?${urlParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
    return response.json();
  } catch (error) {
    console.error('getJobOffers error:', error);
    return { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };
  }
}

export async function getJobOfferStats(): Promise<{ total_active: number, by_type: Record<string, number> }> {
  const response = await fetch(`${API_URL}/job-offers/stats`, {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error('Failed to fetch job offer stats');
  return response.json();
}

/** Company Profiles APIs */
export async function getCompanyProfiles(featuredOnly = false): Promise<CompanyProfile[]> {
  try {
    const url = new URL(`${API_URL}/company-profiles`);
    if (featuredOnly) url.searchParams.append('featured_only', '1');

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('getCompanyProfiles error:', error);
    return [];
  }
}

export async function getCompanyProfileBySlug(slug: string): Promise<{ company: CompanyProfile; offers: JobOffer[] } | null> {
  try {
    const response = await fetch(`${API_URL}/company-profiles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('getCompanyProfileBySlug error:', error);
    return null;
  }
}

export async function getJobOfferBySlug(slug: string): Promise<JobOffer | null> {
  try {
    const response = await fetch(`${API_URL}/job-offers/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('getJobOfferBySlug error:', error);
    return null;
  }
}

/** Multimedia APIs */
export async function getMultimedia(params?: {
  type?: 'video' | 'podcast';
  featured_only?: boolean;
  search?: string;
  per_page?: number;
}): Promise<PaginatedResponse<Multimedia>> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.type) urlParams.append('type', params.type);
    if (params?.featured_only) urlParams.append('featured_only', '1');
    if (params?.search) urlParams.append('search', params.search);
    if (params?.per_page) urlParams.append('per_page', params.per_page.toString());

    const response = await fetch(`${API_URL}/multimedia?${urlParams.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 };
    return response.json();
  } catch (error) {
    console.error('getMultimedia error:', error);
    return { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 };
  }
}

export async function getMultimediaBySlug(slug: string): Promise<Multimedia | null> {
  try {
    const response = await fetch(`${API_URL}/multimedia/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('getMultimediaBySlug error:', error);
    return null;
  }
}
