// app/products/page.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getProducts, type Product, type Filters } from '@/lib/product-service';
import { getCategories } from '@/lib/product-service';
import { 
  SlidersHorizontal, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Grid3x3,
  List,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getAppwriteImageUrl } from '@/lib/appwriteImage';
import { formatPrice } from '@/lib/formatPrice';
import { useSearchParams } from 'next/navigation';

const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {

   const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Filters
  const [categories, setCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<Filters>(() => {
    const categoryFromUrl = searchParams.get('category');
    return categoryFromUrl ? { category: categoryFromUrl } : {};
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Ref for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      if (page === 1) {
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getProducts(page, PRODUCTS_PER_PAGE, {
        ...filters,
        search: searchQuery || undefined
      });
       console.log("product res: ", response);

      if (page === 1) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);

       
      }

      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page
  };


  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  const handleSortChange = (sort: Filters['sort']) => {
    handleFilterChange({ sort });
  };

  const handleCategoryChange = (category: string) => {
    handleFilterChange({ 
      category: filters.category === category ? undefined : category 
    });
  };

  const handlePriceFilter = (min?: number, max?: number) => {
    handleFilterChange({ minPrice: min, maxPrice: max });
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Calculate discount percentage
  const getDiscountPercentage = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop Products</h1>
              <p className="text-gray-600 mt-2">
                Discover our collection of premium products
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchQuery}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter size={16} />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`block w-full text-left px-3 py-2 rounded text-sm ${
                      !filters.category
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        filters.category === category
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹500', min: 0, max: 500 },
                    { label: '₹500 - ₹1000', min: 500, max: 1000 },
                    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
                    { label: 'Above ₹2000', min: 2000 }
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceFilter(range.min, range.max)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        filters.minPrice === range.min && filters.maxPrice === range.max
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Newest', icon: Clock },
                    { value: 'price_low', label: 'Price: Low to High', icon: TrendingUp },
                    { value: 'price_high', label: 'Price: High to Low', icon: TrendingUp },
                    { value: 'popular', label: 'Most Popular', icon: Star }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value as Filters['sort'])}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded text-sm ${
                          filters.sort === option.value
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={14} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                <RefreshCw size={14} className="mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Mobile Filter Header */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border p-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <SlidersHorizontal size={20} />
                  <span>Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {Object.keys(filters).length}
                    </Badge>
                  )}
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {products.length} products
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
            </div>

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="secondary" className="gap-2">
                    Category: {filters.category}
                    <button onClick={() => handleCategoryChange(filters.category!)}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                  <Badge variant="secondary" className="gap-2">
                    Price: {filters.minPrice || 0} - {filters.maxPrice || '∞'}
                    <button onClick={() => handlePriceFilter(undefined, undefined)}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
                {filters.sort && (
                  <Badge variant="secondary" className="gap-2">
                    Sorted
                    <button onClick={() => handleSortChange(undefined)}>
                      <X size={12} />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid/List */}
            {initialLoading ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
              }>
                {Array.from({ length: 8 }).map((_, i) => (
                  viewMode === 'grid' ? (
                    <ProductCardSkeleton key={i} />
                  ) : (
                    <ProductRowSkeleton key={i} />
                  )
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
                }>
                  {products.map((product) => (
                    viewMode === 'grid' ? (
                      <ProductCard key={product.$id} product={product} />
                    ) : (
                      <ProductRow key={product.$id} product={product} />
                    )
                  ))}
                </div>

                {/* Load More Trigger */}
                {hasMore && (
                  <div ref={loadMoreRef} className="mt-8 text-center">
                    {loadingMore ? (
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                        Loading more products...
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={loadMore}
                        className="animate-pulse"
                      >
                        Load More Products
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl animate-slide-left">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
              {/* Mobile filter content */}
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          filters.category === category
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Sort By</h4>
                  <div className="space-y-2">
                    {['newest', 'price_low', 'price_high', 'popular'].map((sort) => (
                      <button
                        key={sort}
                        onClick={() => handleSortChange(sort as Filters['sort'])}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          filters.sort === sort
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {sort === 'newest' && 'Newest'}
                        {sort === 'price_low' && 'Price: Low to High'}
                        {sort === 'price_high' && 'Price: High to Low'}
                        {sort === 'popular' && 'Most Popular'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  className="w-full mt-6"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Card Component (Grid View) with Equal Height
function ProductCard({ product }: { product: Product }) {
  const discountPercent = getDiscountPercentage(
    product.price,
    product.compareAtPrice
  );

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
        
        {/* Product Info - This section will stretch to fill remaining space */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title with fixed height */}
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Price - Fixed position */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{formatPrice(product.price)}
            </span>
            
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          {/* Rating - Auto margin to push to bottom */}
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
              // Show "No reviews" text instead of hiding completely
              <span className="text-xs text-gray-400">
                No reviews yet
              </span>
            )}
          </div>
          
          {/* Category Badge - Optional, will be at bottom */}
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
}
// Product Row Component (List View)
function ProductRow({ product }: { product: Product }) {
  const discountPercent = getDiscountPercentage(
    product.price,
    product.compareAtPrice
  );

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
                      ₹{formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-base text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  
                  {product.averagerating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(product.averagerating!) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviewcount || 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Meta Info */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge variant="outline">
                    {product.category}
                  </Badge>
                  {product.quantity > 0 ? (
                    <Badge variant="outline" className="text-green-600">
                      In Stock ({product.quantity})
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600">
                      Out of Stock
                    </Badge>
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
}

// Skeleton Components
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

function ProductRowSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="md:w-48 aspect-square md:aspect-auto" />
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Helper function to get discount percentage
function getDiscountPercentage(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}