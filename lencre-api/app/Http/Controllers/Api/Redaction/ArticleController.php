<?php

namespace App\Http\Controllers\Api\Redaction;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleVersion;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Article::with(['category'])->where('author_id', $user->id)->orderBy('updated_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(15));
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $article = Article::with(['category', 'reviews', 'versions' => function($q) {
            $q->orderBy('created_at', 'desc')->take(5);
        }])->where('author_id', $user->id)->findOrFail($id);
        
        return response()->json($article);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array',
            'audio_url' => 'nullable|string',
            'credit_photo' => 'nullable|string',
        ]);

        $validated['author_id'] = $user->id;
        
        $submitForReview = $request->boolean('submit_for_review');
        \Log::info('Storing article from redaction', ['submit_for_review' => $submitForReview]);
        
        $articleData = array_merge($validated, [
            'author_id' => $user->id,
            'status' => $submitForReview ? 'review_pending' : 'draft'
        ]);

        $article = Article::create($articleData);

        ArticleVersion::create([
            'article_id' => $article->id,
            'content' => $validated,
            'changed_by' => $user->id,
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => $submitForReview ? 'article_submitted' : 'article_created_draft',
            'subject_type' => get_class($article),
            'subject_id' => $article->id,
        ]);

        return response()->json($article->load(['category']), 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $article = Article::where('author_id', $user->id)->findOrFail($id);

        if (!in_array($article->status, ['draft', 'edit_requested', 'rejected'])) {
            return response()->json(['error' => 'Cet article ne peut plus être modifié (statut en cours: ' . $article->status . ')'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'featured_image' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'meta_title' => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'meta_keywords' => 'nullable|array',
            'audio_url' => 'nullable|string',
            'credit_photo' => 'nullable|string',
        ]);

        $submitForReview = $request->boolean('submit_for_review');
        \Log::info('Updating article from redaction', ['article_id' => $id, 'submit_for_review' => $submitForReview]);
        
        if ($submitForReview) {
            $validated['status'] = 'review_pending';
        } else {
            // Retourne automatiquement en statut brouillon après correction si on ne soumet pas explicitement
            $validated['status'] = 'draft';
        }

        $article->update($validated);

        ArticleVersion::create([
            'article_id' => $article->id,
            'content' => $validated,
            'changed_by' => $user->id,
        ]);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => $submitForReview ? 'article_submitted' : 'article_updated',
            'subject_type' => get_class($article),
            'subject_id' => $article->id,
        ]);

        return response()->json($article->load(['category']));
    }

    public function submit(Request $request, $id)
    {
        $user = $request->user();
        $article = Article::where('author_id', $user->id)->findOrFail($id);

        if (!in_array($article->status, ['draft', 'edit_requested'])) {
            return response()->json(['error' => 'Action impossible, article déjà soumis ou en mauvaise posture.'], 403);
        }

        $article->update(['status' => 'review_pending']);

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'article_submitted',
            'subject_type' => get_class($article),
            'subject_id' => $article->id,
        ]);

        return response()->json(['message' => 'Article soumis avec succès pour revue.', 'article' => $article]);
    }
}
