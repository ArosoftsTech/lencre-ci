<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with(['category', 'author', 'aiAnalysisReports.flags'])->orderBy('created_at', 'desc');

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(15));
    }

    public function show($slug)
    {
        $article = Article::with(['category', 'author', 'aiAnalysisReports.flags'])->where('slug', $slug)->firstOrFail();
        return response()->json($article);
    }

    public function trending()
    {
        $articles = Article::with(['category', 'author'])
                    ->where('is_trending', true)
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get();
        return response()->json($articles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:articles,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'featured_image' => 'nullable|string',
            'is_trending' => 'boolean',
            'is_urgent' => 'boolean',
            'category_id' => 'required|exists:categories,id',
        ]);

        $validated['author_id'] = auth('api')->id();
        $validated['published_at'] = now();

        $article = Article::create($validated);

        return response()->json($article->load(['category', 'author']), 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:articles,slug,' . $article->id,
            'excerpt' => 'nullable|string',
            'content' => 'sometimes|required|string',
            'featured_image' => 'nullable|string',
            'is_trending' => 'boolean',
            'is_urgent' => 'boolean',
            'is_published' => 'boolean',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        if (isset($validated['is_published'])) {
            $validated['published_at'] = $validated['is_published'] ? now() : null;
            unset($validated['is_published']);
        }

        $article->update($validated);

        return response()->json($article->load(['category', 'author']));
    }

    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article supprimé'], 200);
    }

    public function validateArticle(Request $request, $id)
    {
        $article = Article::findOrFail($id);
        
        $updateData = [
            'status' => 'published',
            'published_at' => now(),
        ];

        if ($request->has('ai_override_reason')) {
            $updateData['ai_override'] = true;
            $updateData['ai_override_by'] = auth('api')->id();
            $updateData['ai_override_reason'] = $request->ai_override_reason;
        }

        $article->update($updateData);
        
        \App\Models\ArticleReview::create([
            'article_id' => $article->id,
            'reviewer_id' => auth('api')->id(),
            'action' => 'approved',
        ]);

        return response()->json(['message' => 'Article validé et publié', 'article' => $article]);
    }

    public function rejectArticle(Request $request, $id)
    {
        $request->validate(['motif' => 'required|string']);
        
        $article = Article::findOrFail($id);
        $article->update(['status' => 'rejected']);
        
        \App\Models\ArticleReview::create([
            'article_id' => $article->id,
            'reviewer_id' => auth('api')->id(),
            'action' => 'rejected',
            'motif' => $request->motif,
        ]);

        return response()->json(['message' => 'Article refusé', 'article' => $article]);
    }

    public function requestRevision(Request $request, $id)
    {
        $request->validate(['motif' => 'required|string']);
        
        $article = Article::findOrFail($id);
        $article->update(['status' => 'edit_requested']);
        
        \App\Models\ArticleReview::create([
            'article_id' => $article->id,
            'reviewer_id' => auth('api')->id(),
            'action' => 'edit_requested',
            'motif' => $request->motif,
        ]);

        return response()->json(['message' => 'Corrections demandées', 'article' => $article]);
    }

    public function incrementShare($id)
    {
        $article = Article::findOrFail($id);
        $article->increment('shares_count');
        return response()->json(['shares_count' => $article->shares_count]);
    }
}
