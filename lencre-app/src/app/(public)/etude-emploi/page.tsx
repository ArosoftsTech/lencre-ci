import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getJobOffers, getCompanyProfiles } from '@/lib/api';
import JobSearchForm from '@/components/JobSearchForm/JobSearchForm';
import './page.css';

const sidebarLinks = [
  'Livres sur la recherche d\'emploi',
  'Cours de développement personnel',
  'Logiciels de bureautique',
  'Guide des métiers en Côte d\'Ivoire',
  'Bourses d\'études disponibles',
];

/* ──────────────────────────────────────────────
   Composant Page
   ────────────────────────────────────────────── */
export default async function EtudeEmploiPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Extract search params
  const { sector, education_level, type, search, date_range, page } = searchParams;
  
  // Fetch data
  const [jobOffersData, companies] = await Promise.all([
    getJobOffers({
      sector,
      education_level,
      type,
      search,
      date_range,
      page: page ? parseInt(page) : 1
    }),
    getCompanyProfiles(false)
  ]);
  
  const jobOffers = jobOffersData.data || [];
  const totalOffers = jobOffersData.total || 0;
  const currentPage = jobOffersData.current_page || 1;
  const lastPage = jobOffersData.last_page || 1;

  // Build pagination URL helper
  const buildPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (sector) params.set('sector', sector);
    if (education_level) params.set('education_level', education_level);
    if (type) params.set('type', type);
    if (search) params.set('search', search);
    if (date_range) params.set('date_range', date_range);
    params.set('page', pageNum.toString());
    return `/etude-emploi?${params.toString()}`;
  };

  // Check if filters are active
  const hasFilters = sector || education_level || type || search || date_range;

  return (
    <div className="emploi-page">
      {/* ═══ HEADER ═══ */}
      <section className="emploi-page__header">
        <div className="emploi-page__header-inner container">
          <div>
            <h1>Étude & Emploi</h1>
            <p>Le portail des offres d&apos;emploi et des opportunités en Côte d&apos;Ivoire</p>
          </div>
          <div className="emploi-page__count">
            <div className="emploi-page__count-number">{totalOffers}</div>
            <div className="emploi-page__count-label">Offres en ligne</div>
          </div>
        </div>
      </section>

      {/* ═══ FILTRES (interactive) ═══ */}
      <div className="container">
        <Suspense fallback={<div className="emploi-filters-skeleton" />}>
          <JobSearchForm totalOffers={totalOffers} />
        </Suspense>

        {/* ═══ CONTENU PRINCIPAL ═══ */}
        <div className="emploi-layout">
          {/* ─── Offres ─── */}
          <div>
            <div className="emploi-section__title">
              <span>
                Offres d&apos;emploi
                {hasFilters && <span className="emploi-section__filter-badge">Filtrées</span>}
              </span>
              {totalOffers > 0 && (
                <span className="emploi-section__count-badge">{totalOffers} résultat{totalOffers > 1 ? 's' : ''}</span>
              )}
            </div>

            {jobOffers.length > 0 ? (
              <div className="emploi-grid">
                {jobOffers.map((job: any) => (
                  <article key={job.id} className="emploi-card">
                    <Link href={`/etude-emploi/${job.slug}`} className="emploi-card__link">
                      <div className="emploi-card__image">
                        <Image
                          src={job.featured_image || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400'}
                          alt={job.title}
                          width={400}
                          height={250}
                          unoptimized
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <div className="emploi-card__type-badge">
                          <span className="badge" style={{ backgroundColor: job.type === 'stage' ? '#2A9D8F' : job.type === 'freelance' ? '#F59E0B' : job.type === 'consultance' ? '#6366F1' : '#C1121F' }}>
                            {job.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="emploi-card__content">
                        <h3 className="emploi-card__title">{job.title}</h3>
                        <div className="emploi-card__company">{job.company_name}</div>
                        {job.location && (
                          <div className="emploi-card__location">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {job.location}
                          </div>
                        )}
                        <div className="emploi-card__meta">
                          <div className="emploi-card__meta-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>Publié le : <strong>{new Date(job.published_at || job.created_at).toLocaleDateString('fr-FR')}</strong></span>
                          </div>
                          {job.deadline_at && (
                            <div className="emploi-card__meta-row">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>Date limite : <strong className="emploi-card__deadline">{new Date(job.deadline_at).toLocaleDateString('fr-FR')}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="emploi-empty">
                <div className="emploi-empty__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h3>Aucune offre trouvée</h3>
                <p>Essayez de modifier vos critères de recherche ou de supprimer certains filtres.</p>
                <Link href="/etude-emploi" className="emploi-empty__btn">
                  Voir toutes les offres
                </Link>
              </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
              <nav className="emploi-pagination" aria-label="Pagination des offres">
                {currentPage > 1 && (
                  <Link href={buildPageUrl(currentPage - 1)} className="emploi-pagination__btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Précédent
                  </Link>
                )}
                <div className="emploi-pagination__pages">
                  {Array.from({ length: lastPage }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 2)
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <span key={p}>
                          {showEllipsis && <span className="emploi-pagination__ellipsis">…</span>}
                          <Link
                            href={buildPageUrl(p)}
                            className={`emploi-pagination__page ${p === currentPage ? 'emploi-pagination__page--active' : ''}`}
                          >
                            {p}
                          </Link>
                        </span>
                      );
                    })}
                </div>
                {currentPage < lastPage && (
                  <Link href={buildPageUrl(currentPage + 1)} className="emploi-pagination__btn">
                    Suivant
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <aside className="emploi-sidebar">
            {/* Appels d'offres */}
            <div className="emploi-sidebar__section emploi-sidebar__tenders-wrapper">
              <Link href="/appels-offres" className="emploi-sidebar__tenders-link">
                <div className="emploi-sidebar__tenders-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className="emploi-sidebar__tenders-info">
                  <span className="emploi-sidebar__tenders-title">Appels d&apos;offres</span>
                  <span className="emploi-sidebar__tenders-desc">Consultez les opportunités</span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="emploi-sidebar__tenders-arrow">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            {/* Voir plus (Ressources) */}
            <div className="emploi-sidebar__section">
              <h3 className="emploi-sidebar__title">Voir plus</h3>
              <ul className="emploi-sidebar__links">
                {sidebarLinks.map((label, i) => (
                  <li key={i} className="emploi-sidebar__link-item">
                    <a href="#">
                      <span>{label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nous Suivre */}
            <div className="emploi-sidebar__section">
              <h3 className="emploi-sidebar__title">Nous Suivre</h3>
              <div className="emploi-social__list">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="emploi-social__item emploi-social__item--fb">
                  <span className="emploi-social__icon">
                    <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </span>
                  <span className="emploi-social__info"><strong>222 000</strong> Fans</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="emploi-social__item emploi-social__item--tw">
                  <span className="emploi-social__icon">
                    <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </span>
                  <span className="emploi-social__info"><strong>3 968</strong> Suiveurs</span>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="emploi-social__item emploi-social__item--yt">
                  <span className="emploi-social__icon">
                    <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </span>
                  <span className="emploi-social__info"><strong>2 440</strong> Abonnés</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="emploi-social__item emploi-social__item--li">
                  <span className="emploi-social__icon">
                    <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </span>
                  <span className="emploi-social__info"><strong>164 708</strong> Abonnés</span>
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ═══ ILS RECRUTENT ACTUELLEMENT ═══ */}
        <div className="emploi-companies" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 className="emploi-companies__title">Ils recrutent actuellement</h2>
          <div className="emploi-companies__grid">
            {companies.map((company, i) => (
              <Link key={company.id || i} href={`/etude-emploi/entreprise/${company.slug}`} className="emploi-company-card text-inherit no-underline">
                <Image
                  src={company.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=120'}
                  alt={company.name}
                  width={60}
                  height={60}
                  unoptimized
                  className="emploi-company-card__logo"
                />
                <div className="emploi-company-card__name">{company.name}</div>
                <span className="emploi-company-card__count">{company.active_offers_count || 0} offres</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
