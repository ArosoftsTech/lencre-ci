'use client';

import { useParams } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';

export default function EditArticlePage() {
  const params = useParams();
  const articleId = parseInt(params.id as string);

  return (
    <div>
      <div className="cms-header">
        <h1>Modifier l&apos;article</h1>
      </div>
      <ArticleForm articleId={articleId} />
    </div>
  );
}
