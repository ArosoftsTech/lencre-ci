'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { adminFetch } from '@/lib/auth';

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

import ActionModal from './ActionModal';

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'input';
    mode: 'image' | 'link';
    defaultValue: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'input',
    mode: 'image',
    defaultValue: '',
  });

  if (!editor) return null;

  const handleOpenImagePrompt = () => {
    setModalConfig({
      isOpen: true,
      title: 'Insérer une image',
      message: 'Veuillez entrer l\'URL de l\'image :',
      type: 'input',
      mode: 'image',
      defaultValue: '',
    });
  };

  const handleOpenLinkPrompt = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    setModalConfig({
      isOpen: true,
      title: 'Insérer un lien',
      message: 'Veuillez entrer l\'URL du lien :',
      type: 'input',
      mode: 'link',
      defaultValue: previousUrl,
    });
  };

  const handleModalConfirm = (value?: string) => {
    if (!value) {
      setModalConfig(prev => ({ ...prev, isOpen: false }));
      return;
    }

    if (modalConfig.mode === 'image') {
      editor.chain().focus().setImage({ src: value }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    }

    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
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
        <button type="button" onClick={handleOpenImagePrompt} title="Insérer image">
          🖼️ Image
        </button>
        <button type="button" onClick={handleOpenLinkPrompt} title="Insérer lien" className={editor.isActive('link') ? 'is-active' : ''}>
          🔗 Lien
        </button>
      </div>

      <ActionModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type="input"
        defaultValue={modalConfig.defaultValue}
        placeholder="https://..."
        confirmLabel="Insérer"
        onConfirm={handleModalConfirm}
        onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
}

interface ArticleFormProps {
  articleId?: number;
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!articleId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: '',
    immediatelyRender: false,
  });

  const [isLoading, setIsLoading] = useState(!!articleId);

  useEffect(() => {
    // Load categories
    adminFetch('/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  useEffect(() => {
    // Load article if editing
    if (articleId && editor) {
      setIsLoading(true);
      adminFetch(`/articles/${articleId}`)
        .then(async (r) => {
          if (!r.ok) throw new Error('Article non trouvé');
          return r.json();
        })
        .then(article => {
          setTitle(article.title || '');
          setSlug(article.slug || '');
          setExcerpt(article.excerpt || '');
          setCategoryId(String(article.category_id || ''));
          setFeaturedImage(article.featured_image || '');
          setIsTrending(!!article.is_trending);
          setIsUrgent(!!article.is_urgent);
          
          // Set editor content
          if (article.content) {
            editor.commands.setContent(article.content);
          }
          
          setAutoSlug(false);
        })
        .catch(err => {
          console.error('Failed to load article:', err);
          alert('Impossible de charger l\'article. Il a peut-être été supprimé.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [articleId, editor]);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
    if (autoSlug) setSlug(slugify(value));
  }, [autoSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      title,
      slug,
      excerpt,
      content: editor?.getHTML() || '',
      category_id: parseInt(categoryId),
      featured_image: featuredImage || `https://picsum.photos/seed/${slug}/800/450`,
      is_trending: isTrending,
      is_urgent: isUrgent,
    };

    try {
      const method = articleId ? 'PUT' : 'POST';
      const endpoint = articleId ? `/articles/${articleId}` : '/articles';
      const res = await adminFetch(endpoint, {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push('/admin/articles');
      } else {
        const err = await res.json();
        alert(err.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await adminFetch('/media/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFeaturedImage(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="cms-loading-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Chargement des données de l'article...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      <div className="cms-form__group">
        <label className="cms-form__label">Titre</label>
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
          <label className="cms-form__label">Slug</label>
          <input
            className="cms-form__input"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
            placeholder="mon-article"
            required
          />
        </div>
        <div className="cms-form__group">
          <label className="cms-form__label">Catégorie</label>
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

      <div className="cms-form__group">
        <label className="cms-form__label">Image à la une</label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            className="cms-form__input"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="URL de l'image ou uploader ci-dessous"
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

      <div className="cms-form__group">
        <label className="cms-form__label">Contenu</label>
        <div className="tiptap-editor">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="cms-form__row">
        <div className="cms-form__checkbox">
          <input type="checkbox" id="trending" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />
          <label htmlFor="trending">Article tendance (Mon Griot)</label>
        </div>
        <div className="cms-form__checkbox">
          <input type="checkbox" id="urgent" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
          <label htmlFor="urgent">Marquer comme urgent</label>
        </div>
      </div>

      <div className="cms-form__actions">
        <button type="submit" className="cms-btn cms-btn--primary" disabled={saving}>
          {saving ? 'Enregistrement...' : (articleId ? 'Mettre à jour' : 'Publier')}
        </button>
        <button type="button" className="cms-btn cms-btn--secondary" onClick={() => router.push('/admin/articles')}>
          Annuler
        </button>
      </div>
    </form>
  );
}
