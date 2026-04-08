<?php

namespace App\Http\Controllers\Api\Redaction;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ActivityLog;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $path = 'redacteurs/user_' . $user->id;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json([]);
        }

        $files = collect(Storage::disk('public')->files($path))
            ->map(function ($file) {
                return [
                    'filename' => basename($file),
                    'url' => asset('storage/' . $file),
                    'size' => Storage::disk('public')->size($file),
                ];
            })
            ->sortByDesc('filename')
            ->values();

        return response()->json($files);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $user = $request->user();
        $file = $request->file('file');
        
        $sizeMb = $file->getSize() / 1048576; // bytes to MB
        
        if ($user->storage_used_mb + $sizeMb > $user->storage_quota_mb) {
            return response()->json(['error' => 'Quota de stockage dépassé'], 403);
        }

        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('redacteurs/user_' . $user->id, $filename, 'public');

        // Update quota
        $user->increment('storage_used_mb', ceil($sizeMb));

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'media_uploaded',
            'subject_type' => 'media',
            'subject_id' => 0,
        ]);

        return response()->json([
            'url' => asset('storage/' . $path),
            'filename' => $filename,
            'size' => $file->getSize(),
        ], 201);
    }

    public function destroy(Request $request, $filename)
    {
        $user = $request->user();
        $path = 'redacteurs/user_' . $user->id . '/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Fichier introuvable'], 404);
        }

        $sizeMb = Storage::disk('public')->size($path) / 1048576;
        
        Storage::disk('public')->delete($path);

        $user->decrement('storage_used_mb', ceil($sizeMb));
        if ($user->storage_used_mb < 0) {
            $user->update(['storage_used_mb' => 0]);
        }
        
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'media_deleted',
            'subject_type' => 'media',
            'subject_id' => 0,
        ]);

        return response()->json(['message' => 'Fichier supprimé'], 200);
    }
}
