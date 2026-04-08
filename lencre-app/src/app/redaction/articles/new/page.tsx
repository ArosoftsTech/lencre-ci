'use client';

import RedactionArticleForm from '@/components/redaction/ArticleForm';

export default function RedactionNewArticlePage() {
  return (
    <div>
      <div className="cms-header">
        <h1>Rédiger un nouvel article</h1>
      </div>
      <RedactionArticleForm />
    </div>
  );
}
