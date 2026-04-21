<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CompanyProfile;

class CompanyProfileSeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            [
                'name'        => 'Dangote Cement',
                'logo'        => 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=120',
                'description' => 'Leader panafricain de la production de ciment, présent dans plus de 10 pays africains.',
                'website'     => 'https://www.dangotecement.com',
                'sector'      => 'BTP / Architecture',
                'is_featured' => true,
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Cabinet Variance',
                'logo'        => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=120',
                'description' => 'Cabinet de conseil en management et ressources humaines basé à Abidjan.',
                'sector'      => 'RH / Formation',
                'is_featured' => true,
                'sort_order'  => 2,
            ],
            [
                'name'        => 'NSIA Group',
                'logo'        => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=120',
                'description' => 'Groupe leader en assurance et banque en Afrique de l\'Ouest.',
                'website'     => 'https://www.nsiagroupe.com',
                'sector'      => 'Banque / Finance',
                'is_featured' => true,
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Orange Côte d\'Ivoire',
                'logo'        => 'https://images.unsplash.com/photo-1496200186026-4c838c18daac?auto=format&fit=crop&q=80&w=120',
                'description' => 'Premier opérateur de télécommunications en Côte d\'Ivoire.',
                'website'     => 'https://www.orange.ci',
                'sector'      => 'Informatique / Telecom',
                'is_featured' => true,
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Bolloré Transport & Logistics',
                'logo'        => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120',
                'description' => 'Acteur majeur du transport et de la logistique en Afrique.',
                'website'     => 'https://www.bollore-transport-logistics.com',
                'sector'      => 'Transport / Logistique',
                'is_featured' => true,
                'sort_order'  => 5,
            ],
            [
                'name'        => 'COLAS Côte d\'Ivoire',
                'logo'        => 'https://images.unsplash.com/photo-1568992688065-536aad8a12f6?auto=format&fit=crop&q=80&w=120',
                'description' => 'Filiale du groupe Bouygues spécialisée dans la construction routière.',
                'website'     => 'https://www.colas.com',
                'sector'      => 'BTP / Architecture',
                'is_featured' => true,
                'sort_order'  => 6,
            ],
            [
                'name'        => 'Ecobank Côte d\'Ivoire',
                'logo'        => 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=120',
                'description' => 'Banque panafricaine offrant des services financiers innovants.',
                'website'     => 'https://www.ecobank.com',
                'sector'      => 'Banque / Finance',
                'is_featured' => true,
                'sort_order'  => 7,
            ],
            [
                'name'        => 'MTN Côte d\'Ivoire',
                'logo'        => 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=120',
                'description' => 'Opérateur de téléphonie mobile avec un réseau couvrant tout le pays.',
                'website'     => 'https://www.mtn.ci',
                'sector'      => 'Informatique / Telecom',
                'is_featured' => true,
                'sort_order'  => 8,
            ],
        ];

        foreach ($companies as $data) {
            $slug = \Illuminate\Support\Str::slug($data['name']);
            CompanyProfile::create(array_merge($data, ['slug' => $slug]));
        }

        $this->command->info('✅ ' . count($companies) . ' entreprises créées.');
    }
}
