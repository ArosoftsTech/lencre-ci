<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('uploads', $filename, 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'filename' => $filename,
            'size' => $file->getSize(),
        ], 201);
    }

    public function index()
    {
        $files = collect(\Illuminate\Support\Facades\Storage::disk('public')->files('uploads'))
            ->map(function ($file) {
                return [
                    'filename' => basename($file),
                    'url' => asset('storage/' . $file),
                    'size' => \Illuminate\Support\Facades\Storage::disk('public')->size($file),
                ];
            })
            ->sortByDesc('filename')
            ->values();

        return response()->json($files);
    }

    public function destroy($filename)
    {
        $path = 'uploads/' . $filename;

        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Fichier introuvable'], 404);
        }

        \Illuminate\Support\Facades\Storage::disk('public')->delete($path);

        return response()->json(['message' => 'Fichier supprimé'], 200);
    }
}
