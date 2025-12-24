export async function fetchHomeSectionProducts(
  section: "new-launches" | "herbal" | "organic-powders",
  limit: number
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/home?section=${section}&limit=${limit}`,
    {
      cache: "no-store", // 🔥 VERY IMPORTANT
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }


  return res.json();
}

// PRODUCT
export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// COMMON OFFER
export async function fetchActiveOffer() {
  const res = await fetch(`/api/offers/active`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}