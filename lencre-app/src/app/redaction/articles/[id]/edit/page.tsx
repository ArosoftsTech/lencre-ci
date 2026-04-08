'use client';

import { useParams } from 'next/navigation';
import RedactionArticleForm from '@/components/redaction/ArticleForm';

export default function RedactionEditArticlePage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);

  return (
    <div>
      <div className="cms-header">
        <h1>Brouillon d'article</h1>
      </div>
      <RedactionArticleForm articleId={articleId} />
    </div>
  );
}
