import { Models, Query } from 'appwrite';
import { databases } from './appwrite';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

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



// lib/product-service.ts



export interface Product extends Models.Document {
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  badge?: 'Sale' | 'New' | 'Bestseller' | 'Limited';
  stock: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
}

export interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high' | 'popular';
  search?: string;
  badge?: string;
  tags?: string[];
}

// Get products with pagination and filters
export async function getProducts(
  page: number = 1,
  limit: number = 12,
  filters: Filters = {}
): Promise<ProductsResponse> {
  try {
    const queries = [];
    
    // Only show active products
    queries.push(Query.equal('isActive', true));
    
    // Apply filters
    if (filters.category) {
      queries.push(Query.equal('category', filters.category));
    }
    
    if (filters.minPrice !== undefined) {
      queries.push(Query.greaterThanEqual('price', filters.minPrice));
    }
    
    if (filters.maxPrice !== undefined) {
      queries.push(Query.lessThanEqual('price', filters.maxPrice));
    }
    
    if (filters.badge) {
      queries.push(Query.equal('badge', filters.badge));
    }
    
    if (filters.search) {
      queries.push(Query.search('title', filters.search));
    }
    
    if (filters.tags && filters.tags.length > 0) {
      queries.push(Query.contains('tags', filters.tags));
    }
    
    // Apply sorting
    let orderField = '$createdAt';
    let orderType = 'desc';
    
    switch (filters.sort) {
      case 'price_low':
        orderField = 'price';
        orderType = 'asc';
        break;
      case 'price_high':
        orderField = 'price';
        orderType = 'desc';
        break;
      case 'popular':
        orderField = 'rating';
        orderType = 'desc';
        break;
      case 'newest':
      default:
        orderField = '$createdAt';
        orderType = 'desc';
    }
    
    queries.push(Query.orderDesc(orderField));
    if (orderField !== '$createdAt') {
      queries.push(Query.orderDesc('$createdAt')); // Secondary sort
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));
    
    // Execute query
    const response = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      queries
    );
    
    // Get total count for pagination
    const totalResponse = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      queries.slice(0, -2) // Remove limit and offset for total count
    );
    
    return {
      products: response.documents as unknown as Product[],
      hasMore: response.documents.length === limit,
      total: totalResponse.total
    };
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      hasMore: false,
      total: 0
    };
  }
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('slug', slug),
        Query.equal('isActive', true)
      ]
    );
    
    if (response.documents.length === 0) return null;
    
    return response.documents[0] as unknown as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get related products
export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('category', category),
        Query.notEqual('$id', productId),
        Query.equal('isActive', true),
        Query.limit(limit),
        Query.orderDesc('$createdAt')
      ]
    );
    
    return response.documents as unknown as Product[];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Get all categories
export async function getCategories(): Promise<string[]> {
  try {
    const response = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.select(['category']),
        Query.equal('isActive', true)
      ]
    );
    
    // Extract unique categories
   const categories = Array.from(
  new Set(response.documents.map(doc => doc.category))
).filter(Boolean);
    
    return categories.sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}




export type ProductForCategory = {
  $id: string;
  slug: string;
  name: string;
  price: number;
  marketprice: number;
  shortDescription?: string;
  badge?: string;
  averagerating?: number;
  reviewcount?: number;
  images: string[];
  category: string;
  $updatedAt: string;
};

export const fetchProductsByCategorySlug = async (
  categorySlug: string,
  page: number,
  limit: number = 12
): Promise<{ items: ProductForCategory[]; total: number }> => {
  try {
    const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
    const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

    const offset = page * limit;
    
    // Fetch total count first
    const totalResponse = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID,
      [
        Query.equal("category", categorySlug),
        Query.equal("isActive", true)
      ]
    );

    // Fetch paginated results
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID,
      [
        Query.equal("category", categorySlug),
        Query.equal("isActive", true),
        Query.limit(limit),
        Query.offset(offset),
        Query.orderDesc("$createdAt")
      ]
    );

    const items = response.documents as unknown as ProductForCategory[];
    return {
      items,
      total: totalResponse.total
    };
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    return { items: [], total: 0 };
  }
};