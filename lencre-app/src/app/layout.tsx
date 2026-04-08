import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "L'Encre — Journalisme d'Investigation & Actualités",
  description: "Plateforme d'information de référence en Côte d'Ivoire. Actualités, analyses et enquêtes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
