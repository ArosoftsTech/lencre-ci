'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './JobSearchForm.css';

const SECTORS = [
  'BTP / Architecture',
  'Banque / Finance',
  'Commerce / Vente',
  'Informatique / Telecom',
  'RH / Formation',
  'Transport / Logistique',
  'Santé / Médical',
  'Éducation / Enseignement',
  'Agriculture / Agroalimentaire',
  'Énergie / Environnement',
  'Juridique / Droit',
  'Communication / Médias',
];

const EDUCATION_LEVELS = [
  { label: 'BAC', value: 'BAC' },
  { label: 'BAC+2 / BTS / DUT', value: 'BAC+2' },
  { label: 'BAC+3 / Licence', value: 'BAC+3' },
  { label: 'BAC+4 / Maîtrise', value: 'BAC+4' },
  { label: 'BAC+5 et plus', value: 'BAC+5' },
];

const DATE_RANGES = [
  { label: "Aujourd'hui", value: 'today' },
  { label: 'Cette semaine', value: 'week' },
  { label: 'Ce mois', value: 'month' },
];

const JOB_TYPES = [
  { label: 'Emploi', value: 'emploi' },
  { label: 'Stage', value: 'stage' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Consultance', value: 'consultance' },
];

interface JobSearchFormProps {
  totalOffers: number;
}

export default function JobSearchForm({ totalOffers }: JobSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [sector, setSector] = useState(searchParams.get('sector') || '');
  const [educationLevel, setEducationLevel] = useState(searchParams.get('education_level') || '');
  const [dateRange, setDateRange] = useState(searchParams.get('date_range') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    const params = new URLSearchParams();

    if (sector) params.set('sector', sector);
    if (educationLevel) params.set('education_level', educationLevel);
    if (dateRange) params.set('date_range', dateRange);
    if (type) params.set('type', type);
    if (search) params.set('search', search);
    if (code) params.set('code', code);

    const queryString = params.toString();
    router.push(`/etude-emploi${queryString ? `?${queryString}` : ''}`);

    // Reset spinner after navigation
    setTimeout(() => setIsSearching(false), 1500);
  }, [sector, educationLevel, dateRange, type, search, code, router]);

  const handleReset = useCallback(() => {
    setSector('');
    setEducationLevel('');
    setDateRange('');
    setType('');
    setSearch('');
    setCode('');
    router.push('/etude-emploi');
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Check if any filter is active
  const hasActiveFilters = sector || educationLevel || dateRange || type || search || code;

  return (
    <div className="job-search-form">
      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="job-search-form__active-filters">
          <span className="job-search-form__active-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filtres actifs :
          </span>
          {sector && (
            <button className="job-search-form__tag" onClick={() => { setSector(''); }} type="button">
              {sector} <span className="job-search-form__tag-close">×</span>
            </button>
          )}
          {educationLevel && (
            <button className="job-search-form__tag" onClick={() => { setEducationLevel(''); }} type="button">
              {EDUCATION_LEVELS.find(e => e.value === educationLevel)?.label || educationLevel} <span className="job-search-form__tag-close">×</span>
            </button>
          )}
          {dateRange && (
            <button className="job-search-form__tag" onClick={() => { setDateRange(''); }} type="button">
              {DATE_RANGES.find(d => d.value === dateRange)?.label || dateRange} <span className="job-search-form__tag-close">×</span>
            </button>
          )}
          {type && (
            <button className="job-search-form__tag" onClick={() => { setType(''); }} type="button">
              {JOB_TYPES.find(t => t.value === type)?.label || type} <span className="job-search-form__tag-close">×</span>
            </button>
          )}
          {search && (
            <button className="job-search-form__tag" onClick={() => { setSearch(''); }} type="button">
              « {search} » <span className="job-search-form__tag-close">×</span>
            </button>
          )}
          <button className="job-search-form__clear-all" onClick={handleReset} type="button">
            Tout effacer
          </button>
        </div>
      )}

      {/* Selects Row */}
      <div className="job-search-form__selects">
        <div className="job-search-form__select-wrapper">
          <select
            id="filter-sector"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            aria-label="Secteur d'activité"
          >
            <option value="">Secteur d&apos;activité</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <svg className="job-search-form__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="job-search-form__select-wrapper">
          <select
            id="filter-education"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            aria-label="Niveau d'études"
          >
            <option value="">Niveau d&apos;études</option>
            {EDUCATION_LEVELS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          <svg className="job-search-form__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="job-search-form__select-wrapper">
          <select
            id="filter-date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Date de publication"
          >
            <option value="">Date de publication</option>
            {DATE_RANGES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <svg className="job-search-form__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="job-search-form__select-wrapper">
          <select
            id="filter-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Type d'offres"
          >
            <option value="">Type d&apos;offres</option>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <svg className="job-search-form__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Text Inputs Row */}
      <div className="job-search-form__inputs">
        <div className="job-search-form__input-wrapper">
          <svg className="job-search-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="filter-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Recherche par mots-clés (poste, entreprise...)"
            aria-label="Recherche par mots-clés"
          />
        </div>
        <div className="job-search-form__input-wrapper">
          <svg className="job-search-form__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            id="filter-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Recherche par codes (réf. offre)"
            aria-label="Recherche par codes"
          />
        </div>
      </div>

      {/* Actions Row */}
      <div className="job-search-form__actions">
        <div className="job-search-form__action-group">
          <button
            id="btn-search"
            className="job-search-form__btn job-search-form__btn--primary"
            onClick={handleSearch}
            disabled={isSearching}
            type="button"
          >
            {isSearching ? (
              <span className="job-search-form__spinner" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </button>
          {hasActiveFilters && (
            <button
              className="job-search-form__reset-link"
              onClick={handleReset}
              type="button"
            >
              Réinitialiser les filtres
            </button>
          )}
          <p className="job-search-form__result-count">
            <strong>{totalOffers}</strong> offre{totalOffers !== 1 ? 's' : ''} trouvée{totalOffers !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
