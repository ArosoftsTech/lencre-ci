<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\Article;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a super-admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@lencre.ci'],
            [
                'name' => 'Admin LEncre',
                'password' => bcrypt('password'),
                'role' => 'super-admin',
                'bio' => 'Administrateur principal du site L\'Encre.'
            ]
        );

        // 2. Create Categories
        $categoriesInput = [
            ['name' => 'Politique', 'color' => '#1D3557'],
            ['name' => 'Société', 'color' => '#E63946'],
            ['name' => 'Économie', 'color' => '#F4A261'],
            ['name' => 'Sport', 'color' => '#2A9D8F'],
            ['name' => 'Culture', 'color' => '#8ECAE6'],
        ];

        $categories = collect();
        foreach ($categoriesInput as $cat) {
            $categories->push(Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                ['name' => $cat['name'], 'color_code' => $cat['color']]
            ));
        }

        // 3. Create Articles using Faker
        $faker = \Faker\Factory::create('fr_FR');

        for ($i = 0; $i < 50; $i++) {
            $title = rtrim($faker->sentence(rand(6, 12)), '.');
            Article::create([
                'title' => $title,
                'slug' => Str::slug($title) . '-' . uniqid(),
                'excerpt' => $faker->paragraph(2),
                'content' => "<p>" . implode("</p><p>", $faker->paragraphs(6)) . "</p>",
                'featured_image' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/800/600',
                'is_trending' => $faker->boolean(20), // 20% chance
                'is_urgent' => $faker->boolean(10), // 10% chance
                'published_at' => $faker->dateTimeBetween('-1 month', 'now'),
                'category_id' => $categories->random()->id,
                'author_id' => $admin->id,
            ]);
        }
    }
}
