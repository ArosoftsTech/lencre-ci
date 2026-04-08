<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessAiAnalysis implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $article;

    /**
     * Create a new job instance.
     */
    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $aiServiceUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8001');
        Log::info("Starting AI analysis job for article {$this->article->id} at {$aiServiceUrl}");

        $payload = [
            'article_id' => $this->article->id,
            'title' => $this->article->title,
            'content' => strip_tags($this->article->content ?? ''),
            'category' => $this->article->category ? $this->article->category->name : 'Général',
            'author' => $this->article->author ? $this->article->author->name : 'Inconnu',
        ];

        try {
            $response = Http::timeout(30)->post("{$aiServiceUrl}/api/analyze", $payload);
            
            $status = $response->status();
            $body = $response->body();

            if ($status >= 400) {
                Log::error("AI Service error for article {$this->article->id} (Status: {$status})", [
                    'body' => $body
                ]);
                $this->fail(new \Exception("AI Service returned error status {$status}"));
            } else {
                $data = $response->json();
                Log::info("AI Analysis successfully queued for article {$this->article->id}. Task ID: " . ($data['task_id'] ?? 'unknown'));
            }
        } catch (\Exception $e) {
            Log::error("Connection error to AI service for article {$this->article->id}: " . $e->getMessage());
            $this->fail($e);
        }
    }
}
