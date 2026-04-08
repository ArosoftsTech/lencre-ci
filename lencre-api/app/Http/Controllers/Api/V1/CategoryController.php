<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::withCount('articles')->get());
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
            'color_code' => 'nullable|string|max:7',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['color_code'] = $validated['color_code'] ?? '#0D1B2A';

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:categories,name,' . $category->id,
            'color_code' => 'nullable|string|max:7',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->articles()->count() > 0) {
            return response()->json(['message' => 'Impossible de supprimer une catégorie contenant des articles.'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Catégorie supprimée'], 200);
    }
}
