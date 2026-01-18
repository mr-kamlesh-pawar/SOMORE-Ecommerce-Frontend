// app/search/page.tsx
"use client";

import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { motion } from "framer-motion";
import { Search, X, Filter, Grid3x3, List, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAppwriteImageUrl } from "@/lib/appwriteImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Product {
  $id: string;
  name: string;
  slug: string;
  price: number;
  marketprice?: number;
  shortDescription?: string;
  badge?: string;
  averagerating?: number;
  reviewcount?: number;
  images: string[];
  category: string;
  searcharr: string[];
  $updatedAt: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q")?.toLowerCase().trim() || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (price: number, marketprice?: number) => {
    if (!marketprice || marketprice <= price) return 0;
    return Math.round(((marketprice - price) / marketprice) * 100);
  };

  // Fetch search results
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
        
        if (searchTerms.length === 0) {
          setProducts([]);
          return;
        }

        // Try exact match first in searcharr
        let exactMatchRes;
        try {
          exactMatchRes = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
            [
              Query.equal("isActive", true),
              Query.contains("searcharr", query.toLowerCase()),
              Query.limit(20),
              Query.orderDesc("$createdAt")
            ]
          );
        } catch (error) {
          console.log("Exact match search failed, trying alternative...");
          exactMatchRes = { documents: [], total: 0 };
        }

        // If no exact matches, try partial matches
        let partialMatchRes;
        if (exactMatchRes.total === 0 && searchTerms.length > 0) {
          const searchQueries = searchTerms.map(term => 
            Query.contains("searcharr", term.toLowerCase())
          );
          
          try {
            partialMatchRes = await databases.listDocuments(
              process.env.NEXT_PUBLIC_APPWRITE_DB_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
              [
                Query.equal("isActive", true),
                Query.or(searchQueries),
                Query.limit(20),
                Query.orderDesc("$createdAt")
              ]
            );
          } catch (error) {
            console.log("Partial match search failed");
            partialMatchRes = { documents: [], total: 0 };
          }
        }

        // Combine results (remove duplicates)
        const exactMatches = exactMatchRes.documents as unknown as Product[];
        const partialMatches = partialMatchRes?.documents as unknown as Product[] || [];
        
        const allProducts = [...exactMatches, ...partialMatches];
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.$id === product.$id)
        );

        setProducts(uniqueProducts);

        // Generate related searches from searcharr of found products
        const allSearchTerms = uniqueProducts.flatMap(p => p.searcharr || []);
        const termFrequency: Record<string, number> = {};
        
        allSearchTerms.forEach(term => {
          if (term && !searchTerms.includes(term.toLowerCase())) {
            termFrequency[term] = (termFrequency[term] || 0) + 1;
          }
        });
        
        const sortedTerms = Object.entries(termFrequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([term]) => term);
        
        setRelatedSearches(sortedTerms);

      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Handle related search click
  const handleRelatedSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Handle category filter
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  // Get unique categories from products
  const categoryArray = products
  .map(p => p.category)
  .filter(Boolean) as string[];
  
const uniqueCategories = Array.from(new Set(categoryArray));
const categories = ["all", ...uniqueCategories];

  // Filter products by category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    router.push("/search");
  };

  // Product Card Component (Grid View)
  const ProductCard = ({ product }: { product: Product }) => {
    const discountPercent = getDiscountPercentage(product.price, product.marketprice);

    return (
      <Link href={`/products/${product.slug}`} className="group block h-full">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full">
          {/* Image Container */}
          <div className="relative aspect-square bg-gray-50 flex-shrink-0">
            {product.images?.[0] && (
              <Image
                src={getAppwriteImageUrl(product.images[0], product.$updatedAt)}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/placeholder.png";
                }}
              />
            )}
            
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge variant={
                  product.badge === 'Sale' ? 'destructive' :
                  product.badge === 'New' ? 'default' :
                  product.badge === 'Bestseller' ? 'secondary' : 'outline'
                }>
                  {product.badge}
                </Badge>
              </div>
            )}
            
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {discountPercent}% OFF
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="font-medium text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              
              {product.marketprice && product.marketprice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.marketprice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            <div className="mt-auto">
              {(product.averagerating && product.averagerating > 0) || (product.reviewcount && product.reviewcount > 0) ? (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => {
                      const rating = product.averagerating || 0;
                      return (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      );
                    })}
                  </div>
                  
                  {/* Show rating number */}
                  {product.averagerating && product.averagerating > 0 && (
                    <span className="text-xs text-gray-600 ml-1">
                      {product.averagerating.toFixed(1)}
                    </span>
                  )}
                  
                  {/* Show review count */}
                  {product.reviewcount && product.reviewcount > 0 && (
                    <span className="text-xs text-gray-600">
                      ({product.reviewcount})
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400">
                  No reviews yet
                </span>
              )}
            </div>
            
            {/* Category */}
            {product.category && (
              <div className="mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // Product Row Component (List View)
  const ProductRow = ({ product }: { product: Product }) => {
    const discountPercent = getDiscountPercentage(product.price, product.marketprice);

    return (
      <Link href={`/products/${product.slug}`} className="group">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-48 relative aspect-square md:aspect-auto bg-gray-50">
              {product.images?.[0] && (
                <Image
                  src={getAppwriteImageUrl(product.images[0], product.$updatedAt)}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 192px"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.png";
                  }}
                />
              )}
            </div>
            
            {/* Details */}
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-col gap-2">
                      {product.badge && (
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {product.badge}
                        </Badge>
                      )}
                      {discountPercent > 0 && (
                        <Badge variant="destructive" className="whitespace-nowrap">
                          {discountPercent}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Price and Rating */}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.marketprice && product.marketprice > product.price && (
                        <span className="text-base text-gray-500 line-through">
                          {formatPrice(product.marketprice)}
                        </span>
                      )}
                    </div>
                    
                    {(product.averagerating && product.averagerating > 0) || (product.reviewcount && product.reviewcount > 0) ? (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => {
                            const rating = product.averagerating || 0;
                            return (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.floor(rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            );
                          })}
                        </div>
                        {product.averagerating && product.averagerating > 0 && (
                          <span className="text-sm text-gray-600">
                            {product.averagerating.toFixed(1)}
                          </span>
                        )}
                        {product.reviewcount && product.reviewcount > 0 && (
                          <span className="text-sm text-gray-600">
                            ({product.reviewcount})
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                    {product.searcharr && product.searcharr.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.searcharr.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {product.searcharr.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{product.searcharr.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* View Button */}
                <Button className="mt-4 md:mt-0">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  // Skeleton Loader
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <Input
                type="text"
                placeholder="Search for products, brands, categories..."
                className="pl-12 pr-24 py-6 text-lg w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
                <Button type="submit" className="px-6">
                  Search
                </Button>
              </div>
            </form>
            
            {query && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-600 mt-4"
              >
                Showing results for: <span className="font-semibold">"{query}"</span>
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          // Loading State
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
            <p className="text-gray-600">Searching products...</p>
          </div>
        ) : !query ? (
          // Empty Search State
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600 mb-6">
              Enter a product name, category, or keyword to find what you're looking for
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["wheatgrass", "herbal", "powder", "ayurvedic", "supplements"].map((term) => (
                <button
                  key={term}
                  onClick={() => handleRelatedSearch(term)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          // No Results State
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found for "{query}"
            </h3>
            <p className="text-gray-600 mb-6">
              Try different keywords or check for spelling mistakes
            </p>
            
            {/* Related Searches */}
            {relatedSearches.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Try searching for:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {relatedSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleRelatedSearch(term)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <Button onClick={clearSearch}>
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          // Results Found
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                {/* Results Count */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    for "{query}"
                  </p>
                </div>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Filter size={16} />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedCategory === category
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category === "all" ? "All Categories" : category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Related Searches */}
                {relatedSearches.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Related Searches
                    </h3>
                    <div className="space-y-2">
                      {relatedSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRelatedSearch(term)}
                          className="block w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Area */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Filter size={20} />
                    <span>Filters</span>
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="ml-2">
                        1
                      </Badge>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {filteredProducts.length} products
                    </span>
                    <div className="flex border rounded overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                      >
                        <Grid3x3 size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filters Dropdown */}
                {showFilters && (
                  <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategoryFilter(category);
                            setShowFilters(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${
                            selectedCategory === category
                              ? 'bg-green-50 text-green-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {category === "all" ? "All Categories" : category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters */}
              {selectedCategory !== "all" && (
                <div className="mb-6 flex items-center gap-2">
                  <Badge variant="secondary" className="gap-2">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")}>
                      <X size={12} />
                    </button>
                  </Badge>
                </div>
              )}

              {/* Products Grid/List */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
              }>
                {filteredProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <motion.div
                      key={product.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={product.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductRow product={product} />
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}