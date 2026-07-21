import { createClient } from "@/lib/supabase/server";

export type ProductColor = {
  id: number;
  product_id: number;
  name: string;
  hex_code: string;
  image_url: string | null;
  stock: number;
};

export type StoreProduct = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  brand_id: number | null;
  product_colors?: ProductColor[];
};

type GetProductsOptions = {
  limit?: number;
  category?: string;
  brandId?: number;
};

export async function getProducts({
  limit,
  category,
  brandId,
}: GetProductsOptions = {}): Promise<StoreProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      image_url,
      stock,
      category,
      brand_id
    `,
    )
    .eq("is_active", true)
    .order("created_at", {
      ascending: false,
    });

  if (category && category.toLowerCase() !== "all") {
    query = query.ilike("category", category.trim());
  }

  if (typeof brandId === "number") {
    query = query.eq("brand_id", brandId);
  }

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load Supabase products:", error.message);

    return [];
  }

  return data ?? [];
}

export async function getProduct(id: string): Promise<StoreProduct | null> {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  const supabase = await createClient();

  const [
    { data: product, error: productError },
    { data: colors, error: colorsError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        price,
        image_url,
        stock,
        category,
        brand_id
      `,
      )
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle(),

    supabase
      .from("product_colors")
      .select(
        `
        id,
        product_id,
        name,
        hex_code,
        image_url,
        stock
      `,
      )
      .eq("product_id", productId)
      .order("id", { ascending: true }),
  ]);

  if (productError) {
    console.error("Unable to load product:", productError.message);
    return null;
  }

  if (!product) {
    return null;
  }

  if (colorsError) {
    console.error("Unable to load product colors:", colorsError.message);
  }

  return {
    ...product,
    product_colors: colors ?? [],
  };
}

export type ProductSearchResult = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
};

export async function searchProducts(
  rawQuery: string,
  limit = 8,
): Promise<ProductSearchResult[]> {
  const query = rawQuery.trim();

  if (!query) {
    return [];
  }

  const supabase = await createClient();

  // Escape characters that have special meaning inside a PostgREST `or()`
  // filter string so a search like "50% off" doesn't break the query.
  const safeQuery = query.replace(/[%,()]/g, (match) => `\\${match}`);

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image_url, category, stock")
    .eq("is_active", true)
    .or(
      `name.ilike.%${safeQuery}%,description.ilike.%${safeQuery}%,category.ilike.%${safeQuery}%`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Unable to search Supabase products:", error.message);

    return [];
  }

  return data ?? [];
}

export async function getProductCategories(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true)
    .not("category", "is", null);

  if (error) {
    console.error("Unable to load categories:", error.message);

    return [];
  }

  const categories = (data ?? [])
    .map((row) => row.category?.trim())
    .filter((category): category is string => Boolean(category));

  return [...new Set(categories)].sort((first, second) =>
    first.localeCompare(second),
  );
}
