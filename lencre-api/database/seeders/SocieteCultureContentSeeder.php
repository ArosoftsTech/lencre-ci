<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Str;

class SocieteCultureContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@lencre.ci')->first() ?: User::first();
        
        $cats = Category::whereIn('slug', ['societe', 'culture'])->get()->keyBy('slug');

        $articlesData = [
            [
                'category' => 'societe',
                'articles' => [
                    [
                        'title' => "Éducation pour tous : Le défi des zones rurales en Côte d'Ivoire",
                        'excerpt' => "L'accès à une éducation de qualité reste un enjeu majeur dans les campements de l'ouest ivoirien.",
                        'content' => "<p>Dans les profondeurs de la région de la Nawa, l'école est parfois un luxe. Malgré les efforts du gouvernement, de nombreux enfants parcourent encore plusieurs kilomètres pour atteindre leur salle de classe. L'enjeu n'est pas seulement la construction de bâtiments, mais aussi le logement des enseignants et l'accès à l'eau potable.</p><p>Des initiatives locales portées par des coopératives de cacao commencent à changer la donne en finançant des cantines scolaires, un levier essentiel pour maintenir les enfants à l'école. Notre reportage explore ces solutions communautaires qui redonnent espoir aux familles.</p>",
                        'image' => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'title' => "Transport urbain : Le métro d'Abidjan entre dans sa phase finale de terrassement",
                        'excerpt' => "Le grand projet qui doit révolutionner la mobilité dans la capitale économique avance à grands pas.",
                        'content' => "<p>Abidjan respire déjà. Le chantier du métro, tant attendu, est désormais visible sur tout son tracé nord-sud. Les travaux de terrassement et de déplacement des réseaux sont achevés à 90 %. Ce projet titanesque promet de transporter plus de 500 000 passagers par jour, reliant Anyama à l'Aéroport.</p><p>Au-delà du transport, c'est toute l'économie urbaine qui se réorganise autour des futures gares. Les prix de l'immobilier s'envolent, signe de l'attractivité nouvelle des quartiers desservis.</p>",
                        'image' => 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'title' => "Environnement : L'initiative 'Villes Vertes' s'étend aux communes de l'intérieur",
                        'excerpt' => "Après le plateau, plusieurs mairies adoptent des chartes écologiques pour lutter contre la chaleur urbaine.",
                        'content' => "<p>Le réchauffement climatique n'est plus une abstraction dans nos villes. Pour lutter contre les îlots de chaleur, le programme 'Villes Vertes' prévoit le reboisement intensif des artères principales et la création de parcs urbains. Bouaké et Korhogo ont officiellement rejoint l'initiative cette semaine.</p><p>Cette transition écologique s'accompagne d'une gestion plus rigoureuse des déchets plastiques, impliquant les populations dans un système de tri et de collecte innovant.</p>",
                        'image' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800'
                    ]
                ]
            ],
            [
                'category' => 'culture',
                'articles' => [
                    [
                        'title' => "Musée des Civilisations : Une nouvelle exposition sur les masques Dan",
                        'excerpt' => "Une plongée fascinante dans la spiritualité et l'art d'un des peuples les plus emblématiques de l'Ouest.",
                        'content' => "<p>Le Musée des Civilisations de Côte d'Ivoire à Abidjan accueille depuis hier une collection exceptionnelle de masques Dan, dont certains reviennent de collections privées européennes. Ces pièces, au-delà de leur beauté esthétique, racontent l'organisation sociale et la sagesse ancestrale de l'ouest montagneux.</p><p>L'exposition met également en lumière le travail de jeunes sculpteurs contemporains qui s'inspirent de ces codes pour créer des œuvres modernes. Un pont nécessaire entre passé et futur.</p>",
                        'image' => 'https://images.unsplash.com/photo-1518991021182-038bbd2bdf34?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'title' => "Littérature : Prix de l'Encre 2026, les finalistes annoncés",
                        'excerpt' => "Le prestigieux trophée littéraire met cette année l'accent sur les premiers romans et les voix féminines.",
                        'content' => "<p>Le jury du Prix de l'Encre a rendu son verdict. Sur les cinquante ouvrages en lice, quatre ont été retenus pour la finale. La sélection de cette année se distingue par son audace thématique : exil, résilience et reconstruction sont les fils conducteurs de ces œuvres.</p><p>Le lauréat sera dévoilé le mois prochain lors d'une cérémonie solennelle au Palais de la Culture. L'Encre s'engage une nouvelle fois à promouvoir la richesse de l'imaginaire francophone.</p>",
                        'image' => 'https://images.unsplash.com/photo-1495446815901-a7297e63bdef?auto=format&fit=crop&q=80&w=800'
                    ],
                    [
                        'title' => "Patrimoine : Grand-Bassam célèbre ses 10 ans au patrimoine mondial de l'UNESCO",
                        'excerpt' => "La ville historique prépare un festival grandiose pour fêter son inscription à l'inventaire mondial.",
                        'content' => "<p>Grand-Bassam, l'ancienne capitale, rayonne. Dix ans après son inscription au patrimoine mondial, la ville coloniale témoigne d'une ferveur culturelle intacte. Le quartier France, avec ses façades restaurées, accueille de nouveaux ateliers d'artistes et des galeries d'art.</p><p>Le festival anniversaire, qui se tiendra en fin de semaine, réunira historiens, artistes et touristes autour de concerts, de conférences et de circuits guidés inédits.</p>",
                        'image' => 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800'
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
                    'status' => 'published'
                ]);
            }
        }
    }
}
