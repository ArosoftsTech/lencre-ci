<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CompanyProfileController extends Controller
{
    /**
     * Liste des entreprises (publique).
     * Par défaut: les featured, triées par sort_order.
     */
    public function index(Request $request)
    {
        $query = CompanyProfile::orderBy('sort_order');

        if ($request->boolean('featured_only', false)) {
            $query->featured();
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $companies = $query->get()->map(function ($company) {
            $company->active_offers_count = $company->active_offers_count;
            return $company;
        });

        return response()->json($companies);
    }

    /**
     * Détail d'une entreprise + ses offres actives.
     */
    public function show($slug)
    {
        $company = CompanyProfile::where('slug', $slug)->firstOrFail();

        $offers = JobOffer::active()
            ->where('company_name', $company->name)
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'company' => $company,
            'offers'  => $offers,
        ]);
    }

    /**
     * Créer une entreprise (CMS).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'logo'        => 'nullable|string',
            'description' => 'nullable|string',
            'website'     => 'nullable|url|max:500',
            'sector'      => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order'  => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        // Vérifier l'unicité du slug
        $baseSlug = $validated['slug'];
        $counter = 1;
        while (CompanyProfile::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $baseSlug . '-' . $counter++;
        }

        $company = CompanyProfile::create($validated);

        return response()->json($company, 201);
    }

    /**
     * Modifier une entreprise (CMS).
     */
    public function update(Request $request, $id)
    {
        $company = CompanyProfile::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'logo'        => 'nullable|string',
            'description' => 'nullable|string',
            'website'     => 'nullable|url|max:500',
            'sector'      => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'sort_order'  => 'integer',
        ]);

        $company->update($validated);

        return response()->json($company);
    }

    /**
     * Supprimer une entreprise (CMS).
     */
    public function destroy($id)
    {
        $company = CompanyProfile::findOrFail($id);
        $company->delete();

        return response()->json(['message' => 'Entreprise supprimée']);
    }
}
