'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './HeroCarousel.css';

interface HeroSlide {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string;
  author: { name: string };
  category: { name: string; slug: string; color_code: string };
  published_at?: string;
  created_at: string;
}

interface TrendItem {
  id: number;
  title: string;
  slug: string;
  featured_image: string;
  category: { name: string; slug: string };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  trends: TrendItem[];
}

export default function HeroCarousel({ slides, trends }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = slides.length;

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, totalSlides]);

  const currentSlide = slides[activeIndex];
  if (!currentSlide) return null;

  // Elapsed time
  const publishDate = new Date(currentSlide.published_at || currentSlide.created_at);
  const elapsed = Date.now() - publishDate.getTime();
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const timeAgo = hours < 1 ? "Il y a moins d'1 heure" : hours < 24 ? `Il y a ${hours}h` : `Il y a ${Math.floor(hours / 24)}j`;

  return (
    <section className="hero-carousel" aria-label="À la une">
      <div className="container">
        <div className="hero-carousel__grid">
          {/* ====== Slider principal ====== */}
          <div
            className="hero-carousel__main"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slides.map((slide, index) => (
              <Link
                key={slide.id}
                href={`/${slide.category.slug}/${slide.slug}`}
                className={`hero-carousel__slide ${index === activeIndex ? 'hero-carousel__slide--active' : ''}`}
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={slide.featured_image}
                  alt={slide.title}
                  fill
                  className="hero-carousel__slide-img"
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                />
                <div className="hero-carousel__slide-overlay"></div>
                <div className="hero-carousel__slide-content">
                  <span className="hero-carousel__badge">
                    {slide.category.name.toUpperCase()}
                  </span>
                  <h2 className="hero-carousel__slide-title">{slide.title}</h2>
                  <p className="hero-carousel__slide-excerpt">{slide.excerpt}</p>
                  <div className="hero-carousel__slide-meta">
                    Par {slide.author.name} • {timeAgo}
                  </div>
                </div>
              </Link>
            ))}

            {/* Indicateurs de progression */}
            <div className="hero-carousel__indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`hero-carousel__indicator ${index === activeIndex ? 'hero-carousel__indicator--active' : ''}`}
                  onClick={(e) => { e.preventDefault(); goToSlide(index); }}
                  aria-label={`Slide ${index + 1}`}
                >
                  <span className="hero-carousel__indicator-fill"></span>
                </button>
              ))}
            </div>

            {/* Compteur de slide */}
            <div className="hero-carousel__counter">
              <span className="hero-carousel__counter-current">{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="hero-carousel__counter-sep">/</span>
              <span className="hero-carousel__counter-total">{String(totalSlides).padStart(2, '0')}</span>
            </div>
          </div>

          {/* ====== Sidebar Tendances avec miniatures ====== */}
          <aside className="hero-carousel__sidebar">
            <div className="hero-carousel__sidebar-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hero-carousel__trend-icon">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <h3>Actualités</h3>
            </div>
            <ul className="hero-carousel__trend-list">
              {trends.slice(0, 4).map((trend) => (
                <li key={trend.id} className="hero-carousel__trend-item">
                  <Link href={`/${trend.category.slug}/${trend.slug}`} className="hero-carousel__trend-link">
                    <div className="hero-carousel__trend-thumb">
                      <Image
                        src={trend.featured_image}
                        alt={trend.title}
                        width={80}
                        height={56}
                        className="hero-carousel__trend-thumb-img"
                        sizes="80px"
                      />
                    </div>
                    <div className="hero-carousel__trend-info">
                      <h4 className="hero-carousel__trend-title">{trend.title}</h4>
                      <span className="hero-carousel__trend-meta">{trend.category.name}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
