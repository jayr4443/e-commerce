import { NextResponse } from "next/server";

import { searchProducts } from "@/lib/store/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchProducts(query, 8);

  return NextResponse.json({ results });
}
