<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(): JsonResponse
    {
        $items = Item::with('category')
            ->select('id', 'name', 'description', 'price', 'stock_quantity', 'category_id')
            ->get();

        return response()->json($items);
    }
}
