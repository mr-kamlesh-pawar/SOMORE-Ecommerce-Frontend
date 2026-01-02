"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, User, LogIn, ThumbsUp } from "lucide-react";
import { useAuth } from "@/store/context/AuthContext";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import {
  createReview,
  getProductReviews,
  getReviewStats,
  incrementHelpfulVote,
  type Review
} from "@/lib/review-service";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  histogram: Array<{
    star: number;
    count: number;
    percent: number;
  }>;
}

export default function ReviewSection() {
  const { user } = useAuth();
  const { slug } = useParams(); // Get product slug from URL
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("most-recent");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Review states
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
   const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());
  
  // Reviews data
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    histogram: Array.from({ length: 5 }, (_, i) => ({
      star: i + 1,
      count: 0,
      percent: 0
    }))
  });

  const reviewsPerPage = 5;

  // Fetch reviews on component mount
  useEffect(() => {
    if (slug) {
      loadReviews();
      loadReviewStats();
    }
  }, [slug]);

  const loadReviews = async () => {
    try {
      const productReviews = await getProductReviews(slug as string);
      setReviews(productReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const loadReviewStats = async () => {
    try {
      const reviewStats = await getReviewStats(slug as string);
      setStats(reviewStats);
    } catch (error) {
      console.error("Error loading review stats:", error);
    }
  };

  // ---------------- SORTING ----------------
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortType === "highest-rating") return b.rating - a.rating;
    if (sortType === "lowest-rating") return a.rating - b.rating;
    if (sortType === "most-recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // ---------------- PAGINATION ----------------
  const lastIndex = currentPage * reviewsPerPage;
  const firstIndex = lastIndex - reviewsPerPage;
  const paginatedReviews = sortedReviews.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  // ---------------- SUBMIT REVIEW HANDLER ----------------
  const handleSubmitReview = async () => {
    // Check if user is logged in
   if (!user) {
  toast.error(
    (t) => (
      <div className="flex items-center justify-between">
        <span>Please login to submit a review</span>
        <button
          onClick={() => {
            window.location.href = `/login?redirect=/products/${slug}`;
            toast.dismiss(t.id);
          }}
          className="ml-4 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          Login
        </button>
      </div>
    ),
    {
      duration: 4000,
      icon: <LogIn size={20} />
    }
  );
  return;
}

    // Validation
    if (!rating) {
      toast.error("Please give a star rating");
      return;
    }
    
    if (!reviewTitle.trim()) {
      toast.error("Please add a review title");
      return;
    }
    
    if (!reviewBody.trim()) {
      toast.error("Please write your review");
      return;
    }

    if (reviewBody.length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting review...");

    try {
      // Prepare review data
      const reviewData = {
        productId: slug as string,
        userId: user.$id, // ← Use actual user ID // You'll need to get actual product ID
        rating,
        title: reviewTitle.trim(),
        body: reviewBody.trim(),
         displayName: user.name || user.email.split('@')[0] || 'Anonymous'
      };

      // Submit to API
      const result = await createReview(reviewData);

      if (result.success) {
        toast.success("Review submitted successfully!", { id: toastId });
        
        // Reset form
        setRating(0);
        setReviewTitle("");
        setReviewBody("");
        setShowForm(false);
        
        // Reload reviews
        await loadReviews();
        await loadReviewStats();
      } else {
        toast.error(result.error || "Failed to submit review", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HELPFUL VOTE HANDLER ----------------
  const handleHelpfulVote = async (reviewId: string) => {
    if (!user) {
      toast.error("Please login to vote");
      return;
    }

    // Check if already voted in this session
    if (votedReviews.has(reviewId)) {
  toast("You've already voted for this review", {
    icon: "ℹ️",
    duration: 2000
  });
  return;
}

    try {
      const result = await incrementHelpfulVote(reviewId);
      
      if (result.success) {
        // Mark as voted in this session
       setVotedReviews(prev => {
  const newSet = new Set(prev);
  newSet.add(reviewId);
  return newSet;
});
        
        // Update local reviews state with proper type
        setReviews(prevReviews => 
          prevReviews.map(review => {
            if (review.$id === reviewId) {
              return {
                ...review,
                helpfulVotes: result.helpfulVotes || review.helpfulVotes + 1
              };
            }
            return review;
          })
        );
        
        toast.success("Thanks for your feedback! 👍");
      } else {
        toast.error(result.error || "Failed to submit vote");
      }
    } catch (error) {
      toast.error("Failed to submit vote");
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16">
      {/* =================== HEADER =================== */}
      <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>

      <div className="flex flex-col md:flex-row justify-between md:items-center">
        {/* Rating Summary */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex text-yellow-400 text-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={22}
                fill={i < Math.round(stats.averageRating) ? "#FDB813" : "none"}
                stroke="#FDB813"
              />
            ))}
          </div>
          <p className="text-gray-600">
            {stats.averageRating.toFixed(1)} out of 5 • {stats.totalReviews} reviews
          </p>
        </div>

        {/* Sort */}
        <select
          className="border px-4 py-2 rounded-md text-sm bg-white"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="most-recent">Most Recent</option>
          <option value="highest-rating">Highest Rating</option>
          <option value="lowest-rating">Lowest Rating</option>
        </select>
      </div>

      {/* =================== HISTOGRAM =================== */}
      <div className="mt-6 space-y-2 max-w-md">
        {stats.histogram.map((item) => (
          <div key={item.star} className="flex items-center gap-3">
            <span className="w-10">{item.star} ★</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-md overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm text-gray-600">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      {/* =================== WRITE REVIEW BUTTON =================== */}
      <button
        onClick={() => setShowForm(!showForm)}
        className={`mt-6 px-6 py-3 rounded-md transition-colors ${
          showForm 
            ? "bg-gray-800 text-white" 
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {showForm ? "Cancel Review" : "Write a review"}
      </button>

      {/* =================== REVIEW FORM =================== */}
      {showForm && (
        <div className="mt-10 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
          
          {user ? (
            <>
              {/* Logged in user info */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Reviewing as:</p>
                  <p className="text-sm text-gray-600">
                    {user.name || user.email.split('@')[0]}
                  </p>
                </div>
              </div>

              {/* STAR RATING */}
              <div className="mb-6">
                <p className="font-medium mb-2">Your Rating *</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={36}
                        className="transition-transform hover:scale-110"
                        fill={
                          star <= (hoverRating || rating) ? "#FDB813" : "none"
                        }
                        stroke="#FDB813"
                        strokeWidth={star <= (hoverRating || rating) ? 0 : 2}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* REVIEW TITLE */}
              <div className="mb-4">
                <p className="font-medium mb-2">Review Title *</p>
                <input
                  type="text"
                  placeholder="Summarize your experience in a few words"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1 text-right">
                  {reviewTitle.length}/100
                </p>
              </div>

              {/* REVIEW BODY */}
              <div className="mb-6">
                <p className="font-medium mb-2">Your Review *</p>
                <textarea
                  placeholder="Share details of your experience with this product"
                  rows={5}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1 text-right">
                  {reviewBody.length}/500
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleSubmitReview}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </>
          ) : (
            // Not logged in state
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="text-gray-400" size={24} />
              </div>
              <h4 className="text-lg font-semibold mb-2">Login to Review</h4>
              <p className="text-gray-600 mb-6">
                Please login to share your experience with this product
              </p>
              <button
                onClick={() => window.location.href = `/login?redirect=/products/${slug}`}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Login Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================== REVIEWS LIST =================== */}
      <div className="mt-10 space-y-8">
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-12 border-t">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-gray-600">
              Be the first to share your thoughts about this product
            </p>
          </div>
        ) : (
          paginatedReviews.map((review) => (
            <div key={review.$id} className="border-t pt-8">
              {/* Rating and Title */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex text-yellow-400 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={i < review.rating ? "#FDB813" : "none"}
                        stroke="#FDB813"
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-lg">{review.title}</h4>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.$createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Review Body */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.body}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="text-gray-400" size={18} />
                  <span className="text-sm text-gray-600">
                    {review.displayName}
                  </span>
                  {review.userId === user?.$id && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                      You
                    </span>
                  )}
                </div>

             {/* Helpful Button */}
              <button
                onClick={() => handleHelpfulVote(review.$id)}
                disabled={votedReviews.has(review.$id)}
                className={`text-sm flex items-center gap-1 transition-colors ${
                  votedReviews.has(review.$id)
                    ? "text-green-600 cursor-default"
                    : "text-gray-500 hover:text-green-600"
                }`}
              >
                <span>{votedReviews.has(review.$id) ? "Voted ✓" : "Helpful"}</span>
                <ThumbsUp size={16} />
                {review.helpfulVotes > 0 && (
                  <span className="text-green-600 font-medium ml-1">
                    ({review.helpfulVotes})
                  </span>
                )}
              </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* =================== PAGINATION =================== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}