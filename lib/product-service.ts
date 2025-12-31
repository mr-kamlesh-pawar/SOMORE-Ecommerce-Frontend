// lib/product-service.ts
// ✅ NO CACHE - Always fresh data

export async function fetchHomeSectionProducts(
  section: "new-launches" | "herbal" | "organic-powders",
  limit: number
) {
  const timestamp = Date.now();
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/home?section=${section}&limit=${limit}&_t=${timestamp}`,
    {
      // ✅ Force no cache
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    }
  );

  if (!res.ok) {
    console.error(`Failed to fetch ${section}:`, res.status);
    return [];
  }

  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const timestamp = Date.now();
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${slug}?_t=${timestamp}`,
    {
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );

  if (!res.ok) {
    console.error(`Failed to fetch product ${slug}:`, res.status);
    return null;
  }
  
  return res.json();
}

export async function fetchActiveOffer() {
  const timestamp = Date.now();
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/offers/active?_t=${timestamp}`,
    {
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch offer:", res.status);
    return null;
  }
  
  return res.json();
}