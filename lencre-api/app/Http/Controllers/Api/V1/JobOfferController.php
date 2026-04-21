<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JobOfferController extends Controller
{
    /**
     * Liste publique des offres (paginée, avec filtres).
     */
    public function index(Request $request)
    {
        $query = JobOffer::with('author')->orderBy('published_at', 'desc');

        // Par défaut en public on ne montre que les publiées
        if (!$request->has('show_all')) {
            $query->published();
        }

        // Filtres
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        if ($request->filled('sector')) {
            $query->inSector($request->sector);
        }

        if ($request->filled('education_level')) {
            $query->requiresEducation($request->education_level);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_range')) {
            $query->where('published_at', '>=', match ($request->date_range) {
                'today' => now()->startOfDay(),
                'week'  => now()->startOfWeek(),
                'month' => now()->startOfMonth(),
                default => now()->subYear(),
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->integer('per_page', 15);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Détail d'une offre par slug.
     */
    public function show($slug)
    {
        $offer = JobOffer::with('author')->where('slug', $slug)->firstOrFail();

        // Incrémenter les vues
        $offer->increment('views_count');

        return response()->json($offer);
    }

    /**
     * Stats publiques.
     */
    public function stats()
    {
        return response()->json([
            'total_active' => JobOffer::active()->count(),
            'by_type' => [
                'emploi'      => JobOffer::active()->ofType('emploi')->count(),
                'stage'       => JobOffer::active()->ofType('stage')->count(),
                'freelance'   => JobOffer::active()->ofType('freelance')->count(),
                'consultance' => JobOffer::active()->ofType('consultance')->count(),
            ],
        ]);
    }

    /**
     * Créer une offre (CMS).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'company_name'    => 'required|string|max:255',
            'company_logo'    => 'nullable|string',
            'description'     => 'nullable|string',
            'sector'          => 'nullable|string|max:100',
            'education_level' => 'nullable|string|max:50',
            'type'            => 'required|in:emploi,stage,freelance,consultance',
            'location'        => 'nullable|string|max:100',
            'featured_image'  => 'nullable|string',
            'is_featured'     => 'boolean',
            'published_at'    => 'nullable|date',
            'deadline_at'     => 'nullable|date',
            'external_link'   => 'nullable|url|max:500',
            'status'          => 'in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['author_id'] = auth('api')->id();
        $validated['location'] = $validated['location'] ?? 'Abidjan';

        if (($validated['status'] ?? 'draft') === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $offer = JobOffer::create($validated);

        return response()->json($offer->load('author'), 201);
    }

    /**
     * Modifier une offre (CMS).
     */
    public function update(Request $request, $id)
    {
        $offer = JobOffer::findOrFail($id);

        $validated = $request->validate([
            'title'           => 'sometimes|required|string|max:255',
            'company_name'    => 'sometimes|required|string|max:255',
            'company_logo'    => 'nullable|string',
            'description'     => 'nullable|string',
            'sector'          => 'nullable|string|max:100',
            'education_level' => 'nullable|string|max:50',
            'type'            => 'sometimes|required|in:emploi,stage,freelance,consultance',
            'location'        => 'nullable|string|max:100',
            'featured_image'  => 'nullable|string',
            'is_featured'     => 'boolean',
            'published_at'    => 'nullable|date',
            'deadline_at'     => 'nullable|date',
            'external_link'   => 'nullable|url|max:500',
            'status'          => 'in:draft,published,expired,archived',
        ]);

        $offer->update($validated);

        return response()->json($offer->load('author'));
    }

    /**
     * Supprimer une offre (CMS).
     */
    public function destroy($id)
    {
        $offer = JobOffer::findOrFail($id);
        $offer->delete();

        return response()->json(['message' => 'Offre supprimée']);
    }

    /**
     * Toggle le statut publish/archive (CMS).
     */
    public function toggleStatus($id)
    {
        $offer = JobOffer::findOrFail($id);

        if ($offer->status === 'published') {
            $offer->update(['status' => 'archived']);
        } else {
            $offer->update([
                'status'       => 'published',
                'published_at' => $offer->published_at ?? now(),
            ]);
        }

        return response()->json(['message' => 'Statut mis à jour', 'offer' => $offer]);
    }
}
