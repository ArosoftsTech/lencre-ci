<?php

namespace App\Http\Controllers\Api\Redaction;

use App\Http\Controllers\Controller;
use App\Models\Multimedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MultimediaController extends Controller
{
    /**
     * Lister les médias du journaliste connecté.
     */
    public function index(Request $request)
    {
        $query = Multimedia::where('author_id', auth('api')->id())
            ->orderBy('created_at', 'desc');

        if ($request->has('type') && in_array($request->type, ['video', 'podcast'])) {
            $query->where('type', $request->type);
        }

        return response()->json($query->paginate($request->get('per_page', 20)));
    }

    /**
     * Détail d'un média du journaliste.
     */
    public function show($id)
    {
        $media = Multimedia::where('author_id', auth('api')->id())
            ->findOrFail($id);

        return response()->json($media);
    }

    /**
     * Créer un nouveau média (journaliste).
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
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . Str::random(5);
        $validated['author_id'] = auth('api')->id();
        $validated['status'] = 'draft';

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

        $media = Multimedia::create($validated);

        return response()->json($media, 201);
    }

    /**
     * Modifier un de ses médias (uniquement brouillon ou rejeté).
     */
    public function update(Request $request, $id)
    {
        $media = Multimedia::where('author_id', auth('api')->id())
            ->whereIn('status', ['draft', 'rejected'])
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:video,podcast',
            'external_url' => 'sometimes|required|url|max:500',
            'embed_url' => 'nullable|string|max:500',
            'thumbnail' => 'nullable|string|max:500',
            'duration' => 'nullable|string|max:20',
        ]);

        if (isset($validated['external_url']) && empty($validated['embed_url'])) {
            $validated['embed_url'] = Multimedia::generateEmbedUrl($validated['external_url']);
        }

        $media->update($validated);

        return response()->json($media);
    }

    /**
     * Supprimer un de ses médias (uniquement brouillon).
     */
    public function destroy($id)
    {
        $media = Multimedia::where('author_id', auth('api')->id())
            ->where('status', 'draft')
            ->findOrFail($id);

        $media->delete();

        return response()->json(['message' => 'Média supprimé']);
    }

    /**
     * Soumettre un média pour validation éditoriale.
     */
    public function submit($id)
    {
        $media = Multimedia::where('author_id', auth('api')->id())
            ->whereIn('status', ['draft', 'rejected'])
            ->findOrFail($id);

        $media->update(['status' => 'review_pending']);

        return response()->json(['message' => 'Média soumis pour validation', 'media' => $media]);
    }
}
