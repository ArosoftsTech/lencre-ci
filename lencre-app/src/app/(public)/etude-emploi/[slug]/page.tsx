import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getJobOfferBySlug } from '@/lib/api';
import ShareButtons from '@/components/ShareButtons/ShareButtons';
import './page.css'; // Crée des styles spécifiques ou réutilise ceux existants

type Props = {
  params: { slug: string };
};

// SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offer = await getJobOfferBySlug(params.slug);

  if (!offer) {
    return { title: "Offre introuvable — L'Encre" };
  }

  return {
    title: `${offer.title} | ${offer.company_name} — L'Encre Emploi`,
    description: offer.description || `Découvrez l'offre d'emploi ${offer.title} chez ${offer.company_name}.`,
    openGraph: {
      images: offer.featured_image ? [offer.featured_image] : [],
    },
  };
}

export default async function JobOfferPage({ params }: Props) {
  const offer = await getJobOfferBySlug(params.slug);

  if (!offer) {
    notFound();
  }

  const publishDate = new Date(offer.published_at || offer.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const rawDeadline = offer.deadline_at ? new Date(offer.deadline_at) : null;
  const deadlineDate = rawDeadline ? rawDeadline.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : null;
  
  // Calculate days left
  const daysLeft = rawDeadline ? Math.ceil((rawDeadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : null;

  return (
    <main className="job-offer-page">
      <div className="container job-offer-page__container py-12">
        {/* Colonne Principale (70%) */}
        <article className="job-offer-page__main">
          {/* Header */}
          <header className="job-offer-page__header">
            <div className="job-offer-page__back-link">
              <Link href="/etude-emploi">
                ← Retour aux offres
              </Link>
            </div>
            <div className="job-offer-page__badges">
              <span className={`badge`} style={{ backgroundColor: offer.type === 'stage' ? '#2A9D8F' : offer.type === 'freelance' ? '#F59E0B' : offer.type === 'consultance' ? '#6366F1' : '#C1121F' }}>
                {offer.type.toUpperCase()}
              </span>
              {offer.sector && (
                <span className="job-offer-page__sector">{offer.sector}</span>
              )}
            </div>

            <h1 className="job-offer-page__title">{offer.title}</h1>
            
            <div className="job-offer-page__company-header">
              <div className="job-offer-page__company-info">
                {offer.company_logo ? (
                  <Image src={offer.company_logo} alt={offer.company_name} width={48} height={48} unoptimized className="job-offer-page__logo" />
                ) : (
                  <div className="job-offer-page__logo-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3"/></svg>
                  </div>
                )}
                <div>
                  <h3 className="job-offer-page__company-name">{offer.company_name}</h3>
                  <div className="job-offer-page__location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {offer.location || 'Côte d\'Ivoire'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {offer.featured_image && (
            <figure className="job-offer-page__hero">
              <Image
                src={offer.featured_image}
                alt={offer.title}
                fill
                unoptimized
                className="job-offer-page__hero-img"
                priority
              />
            </figure>
          )}

          {/* Contenu */}
          <div className="job-offer-page__content">
            <h2 className="job-offer-page__subtitle">Description du poste</h2>
            <div className="job-offer-page__body">
              {offer.description || 'Aucune description fournie.'}
            </div>
            {offer.external_link && (
              <div className="job-offer-page__apply">
                <a href={offer.external_link} target="_blank" rel="noopener noreferrer" className="job-offer-page__btn">
                  Postuler directement
                </a>
              </div>
            )}

            <div className="job-offer-page__share-section" style={{ borderTop: '1px solid #eee', marginTop: '2.5rem', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Partager cette offre</h3>
              <ShareButtons 
                contentId={offer.id} 
                title={offer.title} 
                contentType="job" 
                showCount={false} 
              />
            </div>
          </div>
        </article>

        {/* Colonne Latérale (30%) */}
        <aside className="job-offer-page__sidebar">
          {/* Summary Card */}
          <div className="job-offer-sidebar-card">
            <h3 className="job-offer-sidebar-card__title">Détails de l'offre</h3>
            <ul className="job-offer-sidebar-list">
              <li>
                <span className="label">Publié le :</span>
                <strong className="value">{publishDate}</strong>
              </li>
              <li>
                <span className="label">Niveau d'études :</span>
                <strong className="value">{offer.education_level || 'Non spécifié'}</strong>
              </li>
              <li>
                <span className="label">Type de contrat :</span>
                <strong className="value" style={{ textTransform: 'capitalize' }}>{offer.type}</strong>
              </li>
              <li>
                <span className="label">Secteur :</span>
                <strong className="value">{offer.sector || 'Non spécifié'}</strong>
              </li>
              {deadlineDate && (
                <li className="deadline-item">
                  <span className="label deadline-label">Date limite de candidature :</span>
                  <strong className="value deadline-value">{deadlineDate}</strong>
                  {daysLeft !== null && daysLeft >= 0 && (
                     <div className="status-badge status-badge--active">
                       ⏳ Il vous reste {daysLeft} jour{daysLeft > 1 ? 's' : ''} pour postuler
                     </div>
                  )}
                  {daysLeft !== null && daysLeft < 0 && (
                     <div className="status-badge status-badge--expired">
                       ⚠️ L'offre est expirée
                     </div>
                  )}
                </li>
              )}
            </ul>
          </div>

          <div className="job-offer-sidebar-card">
            <h3 className="job-offer-sidebar-card__title">Partagez l'opportunité</h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
              Vous connaissez quelqu'un d'idéal pour ce poste ? Partagez-lui l'annonce.
            </p>
            <ShareButtons 
              contentId={offer.id} 
              title={offer.title} 
              contentType="job" 
              showCount={false} 
            />
          </div>

          <div className="job-offer-sidebar-card">
             <h3 className="job-offer-sidebar-card__title">À propos de l'entreprise</h3>
             {offer.company_logo && (
               <Image src={offer.company_logo} alt={offer.company_name} width={100} height={100} unoptimized className="job-offer-page__company-logo-large" />
             )}
             <p className="job-offer-company-desc">
                Découvrez d'autres annonces ou le profil de <strong>{offer.company_name}</strong> sur leur espace dédié.
             </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
