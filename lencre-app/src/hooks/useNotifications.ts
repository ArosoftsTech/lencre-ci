'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminFetch } from '@/lib/auth';

export interface PendingItem {
  id: number;
  title: string;
  type: 'article' | 'multimedia';
  author: string;
  created_at: string;
  slug: string;
}

export function useNotifications() {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch articles pending review
      const articlesRes = await adminFetch('/articles?status=review_pending&per_page=10');
      const articlesData = await articlesRes.json();
      
      const articles: PendingItem[] = (articlesData.data || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        type: 'article',
        author: a.author?.name || 'Inconnu',
        created_at: a.created_at,
        slug: a.slug
      }));

      // Fetch multimedia pending review
      // Note: We try to use the same status filter. If the backend doesn't support it, 
      // it might return all or error, but based on the code in multimedia page, it should work.
      const mediaRes = await adminFetch('/multimedia/admin?status=review_pending&per_page=10');
      const mediaData = await mediaRes.json();
      
      const media: PendingItem[] = (mediaData.data || []).map((m: any) => ({
        id: m.id,
        title: m.title,
        type: 'multimedia',
        author: m.author?.name || 'Inconnu',
        created_at: m.created_at,
        slug: m.slug
      }));

      const combined = [...articles, ...media].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setPendingItems(combined);
      setCount(combined.length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { pendingItems, count, loading, refresh: fetchNotifications };
}
