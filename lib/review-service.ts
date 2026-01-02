// lib/review-service.ts
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Models } from 'appwrite';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const REVIEWS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!;
const PRODUCTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
export interface Review extends Models.Document{
  $id: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  displayName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  helpfulVotes: number;
  reported: boolean;
}

interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  body: string;
  displayName: string;
  userId: string;
}

// Get reviews for a product by slug
export async function getProductReviews(productSlug: string): Promise<Review[]> {
  try {
    // First get the product by slug
    const products = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.equal('slug', productSlug)]
    );

    if (products.total === 0) {
      return [];
    }

    const product = products.documents[0];
    const productId = product.$id;

    // Then get reviews for that product ID
    const response = await databases.listDocuments(
      DB_ID,
      REVIEWS_COLLECTION_ID,
      [
        Query.equal('productId', productId),
        Query.equal('status', 'approved'),
        Query.orderDesc('$createdAt')
      ]
    );
    
    return response.documents as unknown as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// Get review statistics for a product by slug
export async function getReviewStats(productSlug: string) {
  try {
    const reviews = await getProductReviews(productSlug);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        histogram: Array.from({ length: 5 }, (_, i) => ({
          star: i + 1,
          count: 0,
          percent: 0
        }))
      };
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate histogram
    const histogram = Array.from({ length: 5 }, (_, i) => {
      const star = i + 1;
      const count = reviews.filter(r => r.rating === star).length;
      const percent = (count / reviews.length) * 100;
      
      return { star, count, percent };
    });

    return {
      averageRating,
      totalReviews: reviews.length,
      histogram
    };
  } catch (error) {
    console.error('Error calculating review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      histogram: []
    };
  }
}

// Create a new review
export async function createReview(reviewData: CreateReviewData) {
  try {
    // 1. First, get the product by slug to get its document ID
    const products = await databases.listDocuments(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('slug', reviewData.productId) // Assuming productId is actually slug
      ]
    );

    if (products.total === 0) {
      return {
        success: false,
        error: 'Product not found'
      };
    }

    const product = products.documents[0];
    const actualProductId = product.$id; // Get actual document ID

    // 2. Create the review with actual product ID
    const review = await databases.createDocument(
      DB_ID,
      REVIEWS_COLLECTION_ID,
      'unique()',
      {
        ...reviewData,
        productId: actualProductId, // Store actual document ID, not slug
        isverified: false,
        status: 'pending',
        helpfulVotes: 0,
        reported: false,
      }
    );

    // 3. Update product's average rating and review count using actual ID
    await updateProductRating(actualProductId, reviewData.rating);

    return {
      success: true,
      review
    };
  } catch (error: any) {
    console.error('Error creating review:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit review'
    };
  }
}

// Function to update product rating
export async function updateProductRating(productId: string, newRating: number) {
  try {
    // 1. Get all approved reviews for this product
    const reviews = await databases.listDocuments(
      DB_ID,
      REVIEWS_COLLECTION_ID,
      [
        Query.equal('productId', productId),
        Query.equal('status', 'approved') // Only count approved reviews
      ]
    );

    // 2. Calculate new average rating
    const totalReviews = reviews.total;
    const currentAverage = await getProductAverageRating(productId);
    
    // Formula for updating average: (currentAverage * currentCount + newRating) / (currentCount + 1)
    const newAverage = currentAverage > 0 
      ? (currentAverage * totalReviews + newRating) / (totalReviews + 1)
      : newRating;

    // 3. Update product document
    const updatedProduct = await databases.updateDocument(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      productId, // Make sure productId is the document ID, not slug
      {
        averagerating: Number(newAverage.toFixed(1)), // Round to 1 decimal
        reviewcount: totalReviews + 1
      }
    );

    return {
      success: true,
      averageRating: newAverage,
      reviewCount: totalReviews + 1
    };
  } catch (error: any) {
    console.error('Error updating product rating:', error);
    return {
      success: false,
      error: error.message || 'Failed to update product rating'
    };
  }
}

// Helper function to get current product average rating
async function getProductAverageRating(productId: string): Promise<number> {
  try {
    const product = await databases.getDocument(
      DB_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    
    return product.averageRating || 0;
  } catch (error) {
    console.error('Error getting product rating:', error);
    return 0;
  }
}


export async function incrementHelpfulVote(reviewId: string) {
  try {
    // Get current review
    const review = await databases.getDocument(
      DB_ID,
      REVIEWS_COLLECTION_ID,
      reviewId
    );
    
    // Calculate new helpful votes
    const currentVotes = Number(review.helpfulVotes) || 0;
    const newVotes = currentVotes + 1;
    
    // Update the review
    const updatedReview = await databases.updateDocument(
      DB_ID,
      REVIEWS_COLLECTION_ID,
      reviewId,
      {
        helpfulVotes: newVotes
      }
    );
    
    return {
      success: true,
      helpfulVotes: newVotes
    };
  } catch (error: any) {
    console.error('Error incrementing helpful vote:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit vote'
    };
  }
}