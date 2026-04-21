import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCompanyProfileBySlug } from '@/lib/api';
import './page.css';
import '../../page.css'; // For reusing emploi-card styles

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCompanyProfileBySlug(params.slug);

  if (!data) {
    return { title: 'Entreprise introuvable — L\'Encre' };
  }

  return {
    title: `${data.company.name} - Offres et Profil — L'Encre Emploi`,
    description: data.company.description || `Découvrez le profil et les offres d'emploi de la société ${data.company.name} sur L'Encre.`,
    openGraph: {
      images: data.company.logo ? [data.company.logo] : [],
    },
  };
}

export default async function CompanyProfilePage({ params }: Props) {
  const data = await getCompanyProfileBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { company, offers } = data;

  return (
    <main className="company-profile-page">
      <div className="container py-12">
        {/* En-tête de l'entreprise */}
        <div className="company-header">
          <Link href="/etude-emploi" className="company-header__back">
            ← Retour à l'espace Emploi
          </Link>
          
          <div className="company-header__card">
             <div className="company-header__logo-wrapper">
               {company.logo ? (
                 <Image 
                   src={company.logo} 
                   alt={`Logo ${company.name}`} 
                   width={120} 
                   height={120} 
                   unoptimized
                   className="company-header__logo"
                 />
               ) : (
                 <div className="company-header__logo-placeholder">N/A</div>
               )}
             </div>
             
             <div className="company-header__info">
               <h1 className="company-header__name">{company.name}</h1>
               <div className="company-header__meta">
                 {company.sector && <span className="company-header__sector">{company.sector}</span>}
                 {company.website && (
                   <a href={company.website} target="_blank" rel="noopener noreferrer" className="company-header__website">
                     Visiter le site web ↗
                   </a>
                 )}
               </div>
               {company.description && (
                 <p className="company-header__description">
                   {company.description}
                 </p>
               )}
             </div>
          </div>
        </div>

        {/* Section des offres */}
        <div className="company-offers">
          <div className="company-offers__header">
            <h2 className="company-offers__title">Offres disponibles ({offers.length})</h2>
          </div>

          {offers.length > 0 ? (
            <div className="emploi-grid" style={{ marginTop: '2rem' }}>
              {offers.map((offer) => {
                const publishDate = new Date(offer.published_at || offer.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
                
                const rawDeadline = offer.deadline_at ? new Date(offer.deadline_at) : null;
                const deadlineDate = rawDeadline ? rawDeadline.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : null;
                
                const typeColor = offer.type === 'stage' ? '#2A9D8F' : offer.type === 'freelance' ? '#F59E0B' : offer.type === 'consultance' ? '#6366F1' : '#C1121F';
                
                return (
                  <article key={offer.id} className="emploi-card">
                    <Link href={`/etude-emploi/${offer.slug}`} className="emploi-card__link">
                      <div className="emploi-card__image">
                        {offer.featured_image ? (
                          <Image 
                            src={offer.featured_image} 
                            alt={offer.title} 
                            width={400} 
                            height={250} 
                            unoptimized
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        ) : (
                          <div className="emploi-card__image-placeholder">Aucune image</div>
                        )}
                        <div className="emploi-card__type-badge">
                          <span className="badge" style={{ backgroundColor: typeColor }}>
                            {offer.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="emploi-card__content">
                        <h3 className="emploi-card__title">{offer.title}</h3>
                        <div className="emploi-card__company">{offer.company_name}</div>
                        
                        <div className="emploi-card__meta">
                          <div className="emploi-card__meta-row">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>Publié le : <strong>{publishDate}</strong></span>
                          </div>
                          {deadlineDate && (
                            <div className="emploi-card__meta-row">
                              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              <span>Date limite : <strong className="emploi-card__deadline">{deadlineDate}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="company-offers__empty">
              Aucune offre d'emploi n'est actuellement disponible pour cette entreprise.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
