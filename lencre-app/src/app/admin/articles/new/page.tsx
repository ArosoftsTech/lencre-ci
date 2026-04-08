'use client';

import ArticleForm from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div>
      <div className="cms-header">
        <h1>Nouvel Article</h1>
      </div>
      <ArticleForm />
    </div>
  );
}
