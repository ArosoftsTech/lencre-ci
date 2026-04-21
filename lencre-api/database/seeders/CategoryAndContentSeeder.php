<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Str;

class CategoryAndContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@lencre.ci')->first();
        if (!$admin) {
            $admin = User::first();
        }

        // 1. Ajouter les catégories manquantes
        $additionalCategories = [
            ['name' => 'Santé', 'slug' => 'sante', 'color' => '#10B981'],
            ['name' => 'Vidéo', 'slug' => 'video', 'color' => '#6366F1'],
            ['name' => 'Audio', 'slug' => 'audio', 'color' => '#F59E0B'],
        ];

        foreach ($additionalCategories as $cat) {
            Category::firstOrCreate(
                ['slug' => $cat['slug']],
                ['name' => $cat['name'], 'color_code' => $cat['color']]
            );
        }

        $cats = Category::all()->keyBy('slug');

        $articlesData = [
            // Économie
            [
                'category' => 'economie',
                'articles' => [
                    [
                        'title' => "L'économie ivoirienne affiche une croissance robuste au premier trimestre 2026",
                        'excerpt' => "La Côte d'Ivoire maintient sa trajectoire de croissance avec des indicateurs au vert pour le début de l'année.",
                        'content' => "<p>Abidjan, le moteur économique de l'Afrique de l'Ouest, continue de briller. Selon les derniers rapports officiels, le PIB ivoirien a progressé de 7,2 % au cours du premier trimestre 2026, porté par le dynamisme du secteur des services et une industrie agroalimentaire en pleine mutation.</p><p>Les investissements directs étrangers ont atteint un niveau record, signe de la confiance renouvelée des partenaires internationaux dans la stabilité et le potentiel du pays. Le gouvernement prévoit de poursuivre les réformes structurelles pour assurer une croissance inclusive.</p>",
                        'image' => 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'title' => "Le cacao ivoirien : vers une transformation locale accrue",
                        'excerpt' => "Le défi de la transformation sur place est en passe d'être relevé avec l'ouverture de nouvelles usines.",
                        'content' => "<p>Premier producteur mondial de fèves, la Côte d'Ivoire s'est lancée dans un pari audacieux : transformer au moins 50 % de sa récolte avant exportation. Trois nouvelles unités de transformation ont été inaugurées ce mois-ci dans la zone industrielle de San Pedro.</p><p>Cette stratégie vise à capter davantage de valeur ajoutée et à créer des milliers d'emplois qualifiés pour la jeunesse ivoirienne. Les acteurs du secteur saluent une avancée historique pour l'autonomie économique du pays.</p>",
                        'image' => 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            // Politique
            [
                'category' => 'politique',
                'articles' => [
                    [
                        'title' => "Élections locales 2026 : Enjeux et perspectives",
                        'excerpt' => "À l'approche des scrutins, la scène politique s'anime et les programmes se précisent.",
                        'content' => "<p>Le calendrier électoral de 2026 est au cœur de toutes les discussions. Les partis politiques affûtent leurs armes pour les élections locales prévues à la fin de l'année. Les observateurs notent une volonté de renouvellement des visages politiques, avec de nombreux jeunes candidats s'engageant pour leur commune.</p><p>La Commission Électorale Indépendante (CEI) multiplie les sessions de sensibilisation pour garantir un scrutin transparent et pacifié. L'enjeu est de taille pour la consolidation de la démocratie locale.</p>",
                        'image' => 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            // Santé
            [
                'category' => 'sante',
                'articles' => [
                    [
                        'title' => "Couverture Maladie Universelle : Un bilan positif après deux ans d'extension",
                        'excerpt' => "L'accès aux soins de base s'améliore significativement pour les populations les plus vulnérables.",
                        'content' => "<p>La Couverture Maladie Universelle (CMU) franchit une étape symbolique. Plus de 80 % de la population cible est désormais enrôlée, permettant un accès facilité aux centres de santé de proximité. Les investissements dans les infrastructures hospitalières commencent à porter leurs fruits.</p><p>Le Ministère de la Santé annonce une nouvelle phase de modernisation incluant la numérisation des dossiers médicaux pour un meilleur suivi des patients à travers tout le territoire national.</p>",
                        'image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            // Sport
            [
                'category' => 'sport',
                'articles' => [
                    [
                        'title' => "CAN 2027 : La Côte d'Ivoire se prépare déjà pour défendre son héritage",
                        'excerpt' => "Après le succès mémorable de 2024, les Éléphants visent l'excellence pour le prochain rendez-vous continental.",
                        'content' => "<p>L'enthousiasme ne retombe pas. La Fédération Ivoirienne de Football a dévoilé le plan de préparation de l'équipe nationale pour la prochaine Coupe d'Afrique des Nations. L'accent est mis sur la détection des jeunes talents évoluant dans le championnat local.</p><p>Les stades hérités de la dernière compétition sont maintenus en excellent état, faisant de la Côte d'Ivoire une destination privilégiée pour les grands événements sportifs internationaux.</p>",
                        'image' => 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            // Vidéo
            [
                'category' => 'video',
                'articles' => [
                    [
                        'title' => "Reportage : Dans les coulisses du Port Autonome d'Abidjan",
                        'excerpt' => "Découvrez le géant logistique de l'Afrique de l'Ouest comme vous ne l'avez jamais vu.",
                        'content' => "<p>Plongez au cœur du Port Autonome d'Abidjan à travers notre reportage exclusif. Véritable poumon de l'économie, le port traite des millions de tonnes de marchandises chaque année. Nos caméras ont pu accéder aux zones de chargement high-tech et aux nouveaux terminaux à conteneurs.</p><div class='ratio ratio-16x9 my-4'><iframe src='https://www.youtube.com/embed/dQw4w9WgXcQ' title='YouTube video' allowfullscreen></iframe></div><p>Ce document exceptionnel montre les prouesses technologiques et humaines qui font de cette infrastructure un leader continental.</p>",
                        'image' => 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            // Audio
            [
                'category' => 'audio',
                'articles' => [
                    [
                        'title' => "Podcast : L'impact de l'IA sur le journalisme moderne",
                        'excerpt' => "Écoutez notre débat sur l'évolution du métier de journaliste à l'ère du numérique.",
                        'content' => "<p>Dans ce nouvel épisode de L'Encre Audio, nous recevons des experts du numérique et des rédacteurs en chef pour discuter de l'influence de l'intelligence artificielle dans les rédactions africaines. Comment concilier rapidité technologique et éthique journalistique ?</p><p>Un débat riche d'enseignements pour comprendre le futur de l'information.</p>",
                        'image' => 'https://images.unsplash.com/photo-1478737270239-2fccd2c7fd14?auto=format&fit=crop&q=80&w=800',
                        'audio_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                    ]
                ]
            ]
        ];

        foreach ($articlesData as $section) {
            $category = $cats->get($section['category']);
            if (!$category) continue;

            foreach ($section['articles'] as $art) {
                Article::create([
                    'title' => $art['title'],
                    'slug' => Str::slug($art['title']) . '-' . uniqid(),
                    'excerpt' => $art['excerpt'],
                    'content' => $art['content'],
                    'featured_image' => $art['image'],
                    'published_at' => now(),
                    'category_id' => $category->id,
                    'author_id' => $admin->id,
                    'status' => 'published',
                    'audio_url' => $art['audio_url'] ?? null
                ]);
            }
        }
    }
}
