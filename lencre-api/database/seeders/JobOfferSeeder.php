<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobOffer;
use App\Models\User;

class JobOfferSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::first();
        if (!$author) {
            $this->command->warn('Aucun utilisateur trouvé. Créez un utilisateur d\'abord.');
            return;
        }

        $offers = [
            [
                'title'           => 'Agent Back-Office Trade',
                'company_name'    => 'NSIA Banque',
                'description'     => 'Nous recherchons un Agent Back-Office Trade pour rejoindre notre équipe Marchés financiers. Le candidat idéal maîtrise les opérations de change, les instruments financiers et la gestion des risques.',
                'sector'          => 'Banque / Finance',
                'education_level' => 'BAC+4',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(7),
            ],
            [
                'title'           => 'Stagiaire Ressources Humaines',
                'company_name'    => 'Orange Côte d\'Ivoire',
                'description'     => 'Stage de 6 mois au sein de la Direction des Ressources Humaines. Participation au recrutement, gestion administrative du personnel et projets RH transverses.',
                'sector'          => 'RH / Formation',
                'education_level' => 'BAC+3',
                'type'            => 'stage',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(5),
            ],
            [
                'title'           => 'Gestionnaire de Page / Community Manager',
                'company_name'    => 'Educarriere.ci',
                'description'     => 'Gestion des réseaux sociaux, création de contenus, veille concurrentielle et analyse des performances des campagnes digitales.',
                'sector'          => 'Informatique / Telecom',
                'education_level' => 'BAC+2',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(12),
            ],
            [
                'title'           => 'Responsable Lot Gros Œuvre (H/F)',
                'company_name'    => 'SGI SA',
                'description'     => 'Pilotage des travaux de gros œuvre sur des chantiers d\'envergure. Coordination des équipes terrain, suivi du planning et gestion du budget.',
                'sector'          => 'BTP / Architecture',
                'education_level' => 'BAC+5',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(6),
            ],
            [
                'title'           => 'Apporteur d\'Affaires Commercial',
                'company_name'    => 'Cabinet Conseil RH',
                'description'     => 'Développement d\'un portefeuille client, prospection terrain et fidélisation. Rémunération attractive basée sur les commissions.',
                'sector'          => 'Commerce / Vente',
                'education_level' => 'BAC+2',
                'type'            => 'freelance',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(15),
            ],
            [
                'title'           => 'Responsable Corps d\'État Techniques',
                'company_name'    => 'COLAS Côte d\'Ivoire',
                'description'     => 'Supervision des lots techniques (électricité, plomberie, CVC) sur des projets d\'infrastructure routière et bâtiment.',
                'sector'          => 'BTP / Architecture',
                'education_level' => 'BAC+5',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(4),
            ],
            [
                'title'           => 'Caissière – Rayonniste',
                'company_name'    => 'Prosuma Distribution',
                'description'     => 'Encaissement des clients, mise en rayon des produits, contrôle des stocks et maintien de la propreté de l\'espace de vente.',
                'sector'          => 'Commerce / Vente',
                'education_level' => 'BAC',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(5),
            ],
            [
                'title'           => 'Agent Logistique (Clerks)',
                'company_name'    => 'Bolloré Transport & Logistics',
                'description'     => 'Gestion des flux logistiques, suivi des expéditions, coordination des opérations portuaires et documentation douanière.',
                'sector'          => 'Transport / Logistique',
                'education_level' => 'BAC+2',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(12),
            ],
            [
                'title'           => 'Commerciale Terrain (H/F)',
                'company_name'    => 'MTN Côte d\'Ivoire',
                'description'     => 'Prospection et développement commercial sur le terrain. Vente de solutions télécoms aux entreprises et particuliers.',
                'sector'          => 'Commerce / Vente',
                'education_level' => 'BAC+3',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(12),
            ],
            [
                'title'           => 'Chef de Service Contrats et Contentieux',
                'company_name'    => 'Port Autonome d\'Abidjan',
                'description'     => 'Gestion des contrats, suivi du contentieux juridique et conseil en droit des affaires pour le compte du Port Autonome.',
                'sector'          => 'Banque / Finance',
                'education_level' => 'BAC+5',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(12),
            ],
            [
                'title'           => 'Gestionnaire des Risques Senior',
                'company_name'    => 'Ecobank Côte d\'Ivoire',
                'description'     => 'Évaluation et gestion des risques opérationnels et de crédit. Mise en conformité réglementaire et reporting.',
                'sector'          => 'Banque / Finance',
                'education_level' => 'BAC+5',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(12),
            ],
            [
                'title'           => 'Formateur / Consultant Digital',
                'company_name'    => 'Africa Digital Academy',
                'description'     => 'Animation de formations en marketing digital, e-commerce et transformation numérique pour les entreprises ivoiriennes.',
                'sector'          => 'Informatique / Telecom',
                'education_level' => 'BAC+4',
                'type'            => 'consultance',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(15),
            ],
            [
                'title'           => 'Développeur Full-Stack Laravel/React',
                'company_name'    => 'Kaizene Technologies',
                'description'     => 'Développement d\'applications web avec Laravel et React. Expérience avec les API REST, bases de données et déploiement cloud.',
                'sector'          => 'Informatique / Telecom',
                'education_level' => 'BAC+3',
                'type'            => 'emploi',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400',
                'is_featured'     => true,
                'deadline_at'     => now()->addDays(20),
            ],
            [
                'title'           => 'Stagiaire Comptabilité',
                'company_name'    => 'Dangote Cement',
                'description'     => 'Stage en comptabilité générale et analytique. Saisie des écritures, rapprochements bancaires et clôture mensuelle.',
                'sector'          => 'Banque / Finance',
                'education_level' => 'BAC+2',
                'type'            => 'stage',
                'location'        => 'Abidjan',
                'featured_image'  => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(10),
            ],
            [
                'title'           => 'Ingénieur Qualité Sécurité Environnement',
                'company_name'    => 'COLAS Côte d\'Ivoire',
                'description'     => 'Mise en place et suivi du système QSE, audits internes, formation du personnel et gestion des incidents.',
                'sector'          => 'BTP / Architecture',
                'education_level' => 'BAC+5',
                'type'            => 'emploi',
                'location'        => 'Yamoussoukro',
                'featured_image'  => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
                'deadline_at'     => now()->addDays(14),
            ],
        ];

        foreach ($offers as $data) {
            $slug = \Illuminate\Support\Str::slug($data['title']) . '-' . \Illuminate\Support\Str::random(5);
            
            JobOffer::create(array_merge($data, [
                'slug'         => $slug,
                'author_id'    => $author->id,
                'status'       => 'published',
                'published_at' => now()->subDays(rand(0, 5)),
                'is_featured'  => $data['is_featured'] ?? false,
            ]));
        }

        $this->command->info('✅ ' . count($offers) . ' offres d\'emploi créées.');
    }
}
