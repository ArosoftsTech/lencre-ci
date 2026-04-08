'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import { redactionFetch } from '@/lib/redactionAuth';

interface Category {
  id: number;
  name: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="tiptap-editor__toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} title="Gras">
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} title="Italique">
        <em>I</em>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} title="Titre H2">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} title="Titre H3">
        H3
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} title="Liste à puces">
        • Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} title="Liste numérotée">
        1. Liste
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} title="Citation">
        ❝ Citation
      </button>
      <button type="button" onClick={() => {
        const url = prompt('URL de l\'image (vous pouvez utiliser l\'URL d\'une image de votre médiathèque) :');
        if (url) editor.chain().focus().setImage({ src: url }).run();
      }} title="Insérer image">
        🖼️ Image
      </button>
      <button type="button" onClick={() => {
        const url = prompt('URL du lien :');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} title="Insérer lien">
        🔗 Lien
      </button>
    </div>
  );
}

interface ArticleFormProps {
  articleId?: number;
}

export default function RedactionArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  
  // Core
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Media
  const [featuredImage, setFeaturedImage] = useState('');
  const [creditPhoto, setCreditPhoto] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState(''); // Comma separated

  // System
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!articleId);
  const [articleStatus, setArticleStatus] = useState('draft');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestReview, setLatestReview] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aiReport, setAiReport] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: '',
    immediatelyRender: false,
  });

  useEffect(() => {
    // Categories endpoint is public
    fetch(process.env.NEXT_PUBLIC_API_URL + '/categories' || 'http://127.0.0.1:8000/api/v1/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);

    if (articleId) {
      redactionFetch(`/redaction/articles/${articleId}`)
        .then(r => r.json())
        .then(article => {
          setTitle(article.title);
          setSlug(article.slug);
          setExcerpt(article.excerpt || '');
          setCategoryId(String(article.category_id));
          setFeaturedImage(article.featured_image || '');
          setCreditPhoto(article.credit_photo || '');
          setAudioUrl(article.audio_url || '');
          
          setMetaTitle(article.meta_title || '');
          setMetaDescription(article.meta_description || '');
          setMetaKeywords(Array.isArray(article.meta_keywords) ? article.meta_keywords.join(', ') : '');
          
          setArticleStatus(article.status);
          
          if (article.reviews && article.reviews.length > 0) {
              setLatestReview(article.reviews[article.reviews.length - 1]);
          }

          if (article.ai_analysis_reports && article.ai_analysis_reports.length > 0) {
              setAiReport(article.ai_analysis_reports[0]);
          }

          if (editor) editor.commands.setContent(article.content || '');
        })
        .catch(console.error);
    }
  }, [articleId, editor]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }, [autoSlug]);

  const handleSubmit = async (submitForReview: boolean) => {
    setSaving(true);

    const body = {
      title,
      slug,
      excerpt,
      content: editor?.getHTML() || '',
      category_id: parseInt(categoryId),
      featured_image: featuredImage || `https://picsum.photos/seed/${slug}/800/450`,
      credit_photo: creditPhoto,
      audio_url: audioUrl,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords.split(',').map(k => k.trim()).filter(k => k),
    };

    try {
      const method = articleId ? 'PUT' : 'POST';
      const endpoint = articleId ? `/redaction/articles/${articleId}` : '/redaction/articles';
      const res = await redactionFetch(endpoint, {
        method,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Erreur lors de la sauvegarde du brouillon');
        setSaving(false);
        return;
      }

      const savedArticle = await res.json();
      
      if (submitForReview) {
          const submitRes = await redactionFetch(`/redaction/articles/${savedArticle.id}/submit`, {
              method: 'POST'
          });
          if (!submitRes.ok) {
              alert('Le brouillon est sauvé, mais la soumission a échoué.');
              setSaving(false);
              return;
          }
      }

      router.push('/redaction/articles');
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await redactionFetch('/redaction/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFeaturedImage(data.url);
    } catch (err) {
      console.error(err);
    }
  };
  
  const isLocked = ['published', 'pending_review', 'ai_review_pending'].includes(articleStatus);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="cms-form">
      {latestReview && ['rejected', 'edit_requested'].includes(articleStatus) && (
          <div style={{ background: '#fffbeb', borderLeft: '4px solid #d97706', padding: '1rem', marginBottom: '1.5rem', borderRadius: 4 }}>
              <h4 style={{ color: '#b45309', marginBottom: '0.5rem' }}>
                  {articleStatus === 'rejected' ? 'Article refusé' : 'Révisions demandées par l\'éditeur'}
              </h4>
              <p style={{ color: '#78350f', margin: 0 }}>Motif : {latestReview.motif}</p>
          </div>
      )}

      {aiReport && ['ai_corrections_required', 'ai_blocked'].includes(articleStatus) && (
          <div style={{ background: '#fff1f2', borderLeft: '4px solid #be123c', padding: '1rem', marginBottom: '1.5rem', borderRadius: 4 }}>
              <h4 style={{ color: '#9f1239', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🤖 {articleStatus === 'ai_blocked' ? 'Publication bloquée par l\'IA' : 'Corrections requises par l\'IA'}
              </h4>
              <p style={{ color: '#881337', margin: 0, marginBottom: '1rem' }}>Score de fiabilité global : <strong>{aiReport.score}/100</strong></p>
              
              {aiReport.flags && aiReport.flags.length > 0 && (
                  <ul style={{ color: '#881337', paddingLeft: '1.5rem', margin: 0 }}>
                      {aiReport.flags.map((flag: any) => (
                          <li key={flag.id} style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ textTransform: 'uppercase' }}>{flag.severity} - {flag.flag_type}</strong> 
                              {flag.paragraph_index ? ` (Paragraphe ${flag.paragraph_index})` : ''} : {flag.description}
                          </li>
                      ))}
                  </ul>
              )}
          </div>
      )}

      {isLocked && (
          <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1rem', marginBottom: '1.5rem', borderRadius: 4 }}>
              <p style={{ color: '#1d4ed8', margin: 0 }}>
                  {articleStatus === 'ai_review_pending' 
                    ? "🤖 L'article est en cours d'analyse par l'intelligence artificielle. Veuillez patienter..."
                    : "Cet article est actuellement en lecture (ou publié). L'édition est bloquée."}
              </p>
          </div>
      )}

      <div style={isLocked ? { opacity: 0.7, pointerEvents: 'none' } : {}}>
          {/* CONTENT TABS */}
          <div className="cms-form__group">
            <label className="cms-form__label">Titre *</label>
            <input
              className="cms-form__input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titre de l'article"
              required
            />
          </div>

          <div className="cms-form__row">
            <div className="cms-form__group">
              <label className="cms-form__label">Slug *</label>
              <input
                className="cms-form__input"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                required
              />
            </div>
            <div className="cms-form__group">
              <label className="cms-form__label">Catégorie *</label>
              <select
                className="cms-form__select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Sélectionner...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="cms-form__group">
            <label className="cms-form__label">Extrait</label>
            <textarea
              className="cms-form__textarea"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé court de l'article..."
              rows={3}
              style={{ minHeight: '80px' }}
            />
          </div>

          {/* MEDIA SECTION */}
          <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>Média de couverture</h3>
          
          <div className="cms-form__group">
            <label className="cms-form__label">Image à la une</label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                className="cms-form__input"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="URL de l'image ou uploader ci-dessous (depuis votre quota)"
                style={{ flex: 1 }}
              />
              <label className="cms-btn cms-btn--secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                📁 Parcourir
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            {featuredImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={featuredImage} alt="Aperçu" style={{ marginTop: '0.75rem', maxHeight: 200, borderRadius: 8, objectFit: 'cover' }} />
            )}
          </div>
          
          <div className="cms-form__row">
              <div className="cms-form__group">
                <label className="cms-form__label">Crédit Photo</label>
                <input
                  className="cms-form__input"
                  value={creditPhoto}
                  onChange={(e) => setCreditPhoto(e.target.value)}
                  placeholder="Ex: AFP / Franck Fife"
                />
              </div>
              <div className="cms-form__group">
                <label className="cms-form__label">Fichier Audio (Vidéo & Audio)</label>
                <input
                  className="cms-form__input"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="URL du fichier podcast.mp3"
                />
              </div>
          </div>

          <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>Corps de l'article</h3>
          <div className="cms-form__group">
            <div className="tiptap-editor">
              <EditorToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
          
          {/* SEO SECTION */}
          <h3 style={{ margin: '2rem 0 1rem', fontSize: '1.2rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>Référencement (SEO)</h3>
          
          <div className="cms-form__group">
            <label className="cms-form__label">Meta Titre</label>
            <input
              className="cms-form__input"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Titre pour les moteurs de recherche (60 char.)"
              maxLength={60}
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Meta Description</label>
            <textarea
              className="cms-form__textarea"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Description courte (160 char.)"
              rows={2}
              maxLength={160}
              style={{ minHeight: '60px' }}
            />
          </div>
          <div className="cms-form__group">
            <label className="cms-form__label">Mots-clés (séparés par des virgules)</label>
            <input
              className="cms-form__input"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              placeholder="article, actualité, afrique"
            />
          </div>
      </div>

      <div className="cms-form__actions" style={{ justifyContent: 'space-between' }}>
        <div>
            <button type="button" className="cms-btn cms-btn--secondary" onClick={() => router.push('/redaction/articles')} style={{ marginRight: '1rem' }}>
              Retour
            </button>
        </div>
        {!isLocked && (
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => handleSubmit(false)} className="cms-btn" style={{ background: '#e5e7eb', color: '#374151' }} disabled={saving}>
                  {saving ? '...' : '💾 Enregistrer le brouillon'}
                </button>
                <button type="button" onClick={() => handleSubmit(true)} className="cms-btn cms-btn--primary" style={{ background: '#3b82f6' }} disabled={saving}>
                  {saving ? 'En cours...' : '🚀 Soumettre à validation'}
                </button>
            </div>
        )}
      </div>
    </form>
  );
}
