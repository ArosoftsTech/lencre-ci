<?php

namespace App\Http\Controllers\Api\Internal;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Article;
use App\Models\AiAnalysisReport;
use App\Models\AiFlag;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiCallbackController extends Controller
{
    public function store(Request $request)
    {
        // Simple internal authentication (for example with a pre-shared token in headers)
        // if ($request->header('X-AI-Internal-Token') !== env('AI_INTERNAL_TOKEN')) {
        //     abort(401, 'Unauthorized');
        // }

        $validated = $request->validate([
            'article_id' => 'required|exists:articles,id',
            'score' => 'required|integer|min:0|max:100',
            'level' => 'required|string', // FIABLE | CORRECTIONS | BLOQUE
            'recommendation' => 'required|string', // PUBLIER | CORRIGER | BLOQUER
            'task_id' => 'required|string',
            'processing_time_ms' => 'nullable|integer',
            'analyzed_at' => 'nullable|date',
        ]);

        $article = Article::findOrFail($validated['article_id']);

        // Only accept AI reports if the article was waiting for it
        if ($article->status !== 'ai_review_pending') {
            Log::warning("AI Report received for article {$article->id} but status is {$article->status}");
            // We can still save the report, but we might not change the status automatically
        }

        // Create the report
        $report = AiAnalysisReport::create([
            'article_id' => $article->id,
            'task_id' => $validated['task_id'],
            'score' => $validated['score'],
            'level' => $validated['level'],
            'recommendation' => $validated['recommendation'],
            'report' => $request->except(['article_id', 'task_id', 'score', 'level', 'recommendation', 'processing_time_ms', 'analyzed_at']),
            'processing_time_ms' => $validated['processing_time_ms'] ?? null,
            'analyzed_at' => $validated['analyzed_at'] ?? now(),
        ]);

        // Save flags (corrections needed)
        if ($request->has('corrections_for_journalist') && is_array($request->corrections_for_journalist)) {
            foreach ($request->corrections_for_journalist as $correction) {
                AiFlag::create([
                    'report_id' => $report->id,
                    'flag_type' => $correction['issue'] ?? 'UNKNOWN',
                    'severity' => $correction['severity'] ?? 'LOW',
                    'description' => $correction['detail'] ?? '',
                    'paragraph_index' => $correction['paragraph'] ?? null,
                ]);
            }
        }

        // Update Article Status and AI fields
        $newStatus = 'review_pending'; // Default to sending to editor

        if ($validated['score'] < 40) {
            $newStatus = 'ai_blocked';
        } elseif ($validated['score'] >= 40 && $validated['score'] < 70) {
            $newStatus = 'ai_corrections_required';
        }

        $article->update([
            'status' => $newStatus,
            'ai_score' => $validated['score'],
            'ai_level' => $validated['level'],
            'ai_reviewed_at' => now(),
            'ai_override' => false,
            'ai_override_by' => null,
            'ai_override_reason' => null,
        ]);

        return response()->json(['message' => 'AI report processed successfully', 'new_status' => $newStatus]);
    }
}
