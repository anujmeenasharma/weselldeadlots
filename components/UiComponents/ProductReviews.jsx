"use client";

import { useState } from "react";
import { submitProductReview } from "@/app/actions/reviews";

export default function ProductReviews({ productId, handle, initialReviews }) {
    const [reviews, setReviews] = useState(initialReviews || []);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!name.trim() || !comment.trim()) {
            setError("Name and comment are required.");
            return;
        }

        setIsSubmitting(true);
        const reviewData = { name, rating, comment };
        
        const result = await submitProductReview(productId, handle, reviewData);
        
        if (result.success) {
            // Optimistically add to list
            const newReview = { ...reviewData, id: Date.now().toString(), date: new Date().toISOString() };
            setReviews([newReview, ...reviews]);
            setName("");
            setComment("");
            setRating(5);
        } else {
            setError(result.error || "Failed to submit review.");
        }
        setIsSubmitting(false);
    };

    const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
        <svg
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`w-6 h-6 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 mt-16 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center sm:text-left">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 bg-gray-50 p-6 rounded-xl h-fit border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        filled={star <= (hoverRating || rating)}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400"
                                placeholder="What do you think about this product?"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-black text-white py-3 rounded-md font-semibold transition-all ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-gray-800'}`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No reviews yet.</p>
                            <p className="text-gray-400 mt-1">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 hover:bg-gray-50 p-4 -mx-4 rounded-lg transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-gray-400">
                                            {new Date(review.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                                    <p className="text-gray-600 mt-2 text-base leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
