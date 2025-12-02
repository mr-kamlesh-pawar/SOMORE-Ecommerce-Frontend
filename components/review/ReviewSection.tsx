"use client";

import React, { useState } from "react";
import Image from "next/image";
import { reviewsData } from "@/data/reviewsData";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";

export default function ReviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("most-recent");
  const [showForm, setShowForm] = useState(false);

  // NEW: Form States
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [uploadImages, setUploadImages] = useState<any[]>([]);

  const reviewsPerPage = 5;

  // ---------------- SORTING ----------------
  const sortedReviews = [...reviewsData.reviews].sort((a, b) => {
    if (sortType === "highest-rating") return b.rating - a.rating;
    if (sortType === "lowest-rating") return a.rating - b.rating;
    if (sortType === "most-recent")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    return 0;
  });

  // ---------------- PAGINATION ----------------
  const lastIndex = currentPage * reviewsPerPage;
  const firstIndex = lastIndex - reviewsPerPage;

  const paginatedReviews = sortedReviews.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  // ---------------- IMAGE UPLOAD PREVIEW ----------------
  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file: any) => URL.createObjectURL(file));
    setUploadImages(preview);
  };

  // ---------------- SUBMIT REVIEW HANDLER ----------------
  const handleSubmit = () => {
    if (!rating) return alert("Please give a star rating");
    if (!reviewTitle) return alert("Please add review title");
    if (!reviewBody) return alert("Please write your review");
    if (!displayName) return alert("Please enter display name");
    if (!email) return alert("Email is required");

    alert("Review Submitted (Frontend demo only)");
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
      fill={i < Math.round(reviewsData.averageRating) ? "#FDB813" : "none"}
      stroke="#FDB813"  // outline color for empty stars
    />
  ))}
</div>


          <p className="text-gray-600">
            {reviewsData.averageRating} out of 5 • {reviewsData.reviews.length} reviews
          </p>
        </div>

        {/* Sort */}
        <select
          className="border px-4 py-2 rounded-md text-sm"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="most-recent">Most Recent</option>
          <option value="highest-rating">Highest Rating</option>
          <option value="lowest-rating">Lowest Rating</option>
        </select>
      </div>

      {/* =================== HISTOGRAM =================== */}
      <div className="mt-6 space-y-2">
        {reviewsData.histogram.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-10">{item.star} ★</span>

            <div className="w-full h-3 bg-gray-200 rounded-md">
              <div
                className="h-full bg-yellow-400 rounded-md"
                style={{ width: `${item.percent}%` }}
              />
            </div>

            <span className="w-10">{item.count}</span>
          </div>
        ))}
      </div>

      {/* =================== WRITE REVIEW BUTTON =================== */}
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 bg-black text-white px-6 py-3 rounded-md"
      >
        Write a review
      </button>

      {/* =================== REVIEW FORM =================== */}
      {showForm && (
        <div className="mt-10 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Write a review</h3>

          {/* STAR RATING INTERACTIVE */}
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              return (
                <Star
                  key={i}
                  size={32}
                  className="cursor-pointer"
                  fill={
                    starIndex <= (hoverRating || rating) ? "#FDB813" : "none"
                  }
                  stroke="#FDB813"
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starIndex)}
                />
              );
            })}
          </div>

          {/* FORM FIELDS */}
          <input
            type="text"
            placeholder="Review Title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            className="w-full border px-4 py-3 rounded-md mb-3"
          />

          <textarea
            placeholder="Review Description"
            rows={5}
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            className="w-full border px-4 py-3 rounded-md mb-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border px-4 py-3 rounded-md mb-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-3 rounded-md mb-3"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mb-4"
          />

          {/* IMAGE PREVIEW */}
          <div className="flex gap-3 overflow-x-auto mb-4">
            {uploadImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="preview"
                width={80}
                height={80}
                className="rounded-md border"
              />
            ))}
          </div>

          {/* FORM BUTTONS */}
          <div className="flex justify-between">
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-black text-white rounded-md"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* =================== REVIEWS LIST =================== */}
      <div className="mt-10 space-y-6">
        {paginatedReviews.map((rev) => (
          <div key={rev.id} className="border-t pt-6">
           
           <div className="flex text-yellow-400">
  {Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      size={20}
      fill={i < rev.rating ? "#FDB813" : "none"}  // filled vs empty
      stroke="#FDB813"                           // outline color
    />
  ))}
</div>


            <p className="font-bold">{rev.title}</p>
            <p className="mt-2 text-gray-700">{rev.body}</p>

            <div className="flex items-center space-x-2">
             <User className="bg-gray-300 p-1 rounded-full size-6"/>
            <p className="mt-1 text-sm text-gray-500">{rev.author}</p>
            </div>

            {rev.image && (
              <Image
                src={rev.image}
                alt="review"
                width={120}
                height={120}
                className="rounded-md mt-3"
              />
            )}

          </div>
        ))}
      </div>

      {/* =================== PAGINATION =================== */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronLeft />
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="p-2 border rounded disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
