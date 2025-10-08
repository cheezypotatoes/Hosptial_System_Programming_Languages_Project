<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with('category:id,name')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock_quantity' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $item = Item::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Item added successfully',
            'item' => $item
        ]);
    }
}
