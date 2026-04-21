<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Multimedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MultimediaController extends Controller
{
    /**
     * Liste publique des médias publiés (filtrable par type).
     */
    public function index(Request $request)
    {
        $query = Multimedia::with('author')
            ->published()
            ->orderBy('published_at', 'desc');

        if ($request->has('type') && in_array($request->type, ['video', 'podcast'])) {
            $query->where('type', $request->type);
        }

        if ($request->has('featured_only') && $request->featured_only) {
            $query->featured();
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($request->get('per_page', 15)));
    }

    /**
     * Détail d'un média publié par son slug.
     */
    public function show($slug)
    {
        $media = Multimedia::with('author')
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        $media->increment('views_count');

        return response()->json($media);
    }

    /**
     * Admin : Liste TOUS les médias (y compris brouillons).
     */
    public function adminIndex(Request $request)
    {
        $query = Multimedia::with('author')->orderBy('created_at', 'desc');

        if ($request->has('type') && in_array($request->type, ['video', 'podcast'])) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Admin : Détail d'un média par son ID (tous statuts).
     */
    public function adminShow($id)
    {
        $media = Multimedia::with('author')->findOrFail($id);
        return response()->json($media);
    }

    /**
     * Admin : Créer un nouveau média.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:video,podcast',
            'external_url' => 'required|url|max:500',
            'embed_url' => 'nullable|string|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'duration' => 'nullable|string|max:20',
            'is_featured' => 'boolean',
            'status' => 'in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['author_id'] = auth('api')->id();

        // Auto-générer l'embed URL si non fournie
        if (empty($validated['embed_url'])) {
            $validated['embed_url'] = Multimedia::generateEmbedUrl($validated['external_url']);
        }

        // Auto-générer la miniature YouTube si non fournie
        if (empty($validated['thumbnail']) && $validated['type'] === 'video') {
            if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $validated['external_url'], $matches)) {
                $validated['thumbnail'] = 'https://img.youtube.com/vi/' . $matches[1] . '/hqdefault.jpg';
            }
        }

        if (($validated['status'] ?? 'draft') === 'published') {
            $validated['published_at'] = now();
        }

        $media = Multimedia::create($validated);

        return response()->json($media->load('author'), 201);
    }

    /**
     * Admin : Mettre à jour un média.
     */
    public function update(Request $request, $id)
    {
        $media = Multimedia::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:video,podcast',
            'external_url' => 'sometimes|required|url|max:500',
            'embed_url' => 'nullable|string|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'duration' => 'nullable|string|max:20',
            'is_featured' => 'boolean',
            'status' => 'in:draft,published',
        ]);

        // Si l'URL externe change, re-générer l'embed
        if (isset($validated['external_url']) && empty($validated['embed_url'])) {
            $validated['embed_url'] = Multimedia::generateEmbedUrl($validated['external_url']);
        }

        // Gestion du statut publication
        if (isset($validated['status'])) {
            if ($validated['status'] === 'published' && !$media->published_at) {
                $validated['published_at'] = now();
            } elseif ($validated['status'] === 'draft') {
                $validated['published_at'] = null;
            }
        }

        $media->update($validated);

        return response()->json($media->load('author'));
    }

    /**
     * Admin : Supprimer un média.
     */
    public function destroy($id)
    {
        $media = Multimedia::findOrFail($id);
        $media->delete();

        return response()->json(['message' => 'Média supprimé avec succès']);
    }

    /**
     * Admin : Valider un média soumis par un journaliste.
     */
    public function validate_media(Request $request, $id)
    {
        $media = Multimedia::findOrFail($id);
        $media->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return response()->json(['message' => 'Média validé et publié', 'media' => $media]);
    }

    /**
     * Admin : Rejeter un média soumis.
     */
    public function reject(Request $request, $id)
    {
        $media = Multimedia::findOrFail($id);
        $media->update(['status' => 'rejected']);

        return response()->json(['message' => 'Média rejeté', 'media' => $media]);
    }
}
