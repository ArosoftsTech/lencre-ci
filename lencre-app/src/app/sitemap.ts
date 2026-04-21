import { MetadataRoute } from 'next';
import { getCategories, getArticles } from '@/lib/api';

/**
 * Sitemap Dynamique — L'Encre
 * 
 * Génère automatiquement le sitemap pour les moteurs de recherche.
 * Inclut les rubriques, les dernières actualités et les pages statiques.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lencre.ci';

  // 1. Pages Statiques
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'always', priority: 1 },
    { url: `${baseUrl}/mon-griot`, lastModified: new Date(), changeFrequency: 'always', priority: 0.9 },
    { url: `${baseUrl}/etude-emploi`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/recherche`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  let categoryPages: MetadataRoute.Sitemap = [];
  let articlePages: MetadataRoute.Sitemap = [];

  try {
    // 2. Récupérer les catégories
    const categories = await getCategories();
    categoryPages = categories.map((cat) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    }));

    // 3. Récupérer les 100 derniers articles pour le sitemap
    const articlesRes = await getArticles();
    if (articlesRes && articlesRes.data) {
      articlePages = articlesRes.data.map((article) => ({
        url: `${baseUrl}/${article.category?.slug || 'actualite'}/${article.slug}`,
        lastModified: new Date(article.published_at || article.created_at),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap dynamique:', error);
    // En cas d'erreur API (ex: pendant le build), on retourne au moins les pages statiques
  }

  return [...staticPages, ...categoryPages, ...articlePages];
}
