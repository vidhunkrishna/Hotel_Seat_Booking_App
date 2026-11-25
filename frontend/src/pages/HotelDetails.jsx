import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gethotelsByid } from "../services/hotelservice.js";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Pencil,
  Phone,
  Star,
  Trash2,
} from "lucide-react";
import {
  addReview,
  deleteReview,
  editReview,
  getReviews,
} from "@/services/reviewsservice.js";

const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) return user._id;
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || payload._id || null;
  } catch {
    return null;
  }
};

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdown, setDropdown] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const token = localStorage.getItem("token");
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    async function getdetails() {
      try {
        setLoading(true);
        setError("");
        const data = await gethotelsByid(id);
        setDetails(data);
      } catch (e) {
        console.error("Failed to fetch hotel:", e);
        setError("Unable to fetch hotel details.");
      } finally {
        setLoading(false);
      }

      try {
        const reviewdata = await getReviews(id);
        setReviews(Array.isArray(reviewdata) ? reviewdata : []);
      } catch (e) {
        console.error("Failed to fetch reviews:", e);
      }
    }

    getdetails();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      setReviewError("");
      await addReview(id, { rating, comment });
      setComment("");
      setRating(5);
      const updatedReviews = await getReviews(id);
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
      const updatedHotel = await gethotelsByid(id);
      setDetails(updatedHotel);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setReviewError("");
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editComment.trim()) {
      setReviewError("Comment cannot be empty.");
      return;
    }

    try {
      setReviewError("");
      await editReview(reviewId, { rating: editRating, comment: editComment });
      setEditingId(null);
      const updatedReviews = await getReviews(id);
      setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
      const updatedHotel = await gethotelsByid(id);
      setDetails(updatedHotel);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      setReviewError("");
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      const updatedHotel = await gethotelsByid(id);
      setDetails(updatedHotel);
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) {
    return <div>Loading hotel details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!details) {
    return <div>Hotel not found.</div>;
  }

  return (
    <div className="bg-[#F7F5F0]">
      <img
        src={details.imageurl || "/back.jpg"}
        alt={details.name}
        className="w-full h-[280px] md:h-[650px] object-cover object-center"
      />
      <div className="px-4 pb-4">
        <div className="m-4 font-bold text-2xl text-[#171717] font-display flex flex-col">
          <div className="flex flex-row items-center">
            <div className="text-2xl font-bold">{details.name}</div>
            <div className="font-ui text-base font-semibold ml-auto text-yellow-700">
              ★{details.rating}
            </div>
          </div>
          <div className="flex flex-row text-sm text-[#6B6B6B] items-center gap-1">
            <MapPin size={19} />
            {details.address.city},{details.address.state}
          </div>
        </div>

        <div className="bg-white w-full flex flex-col text-black font-ui p-3 my-2 rounded-xl">
          <div className="ml-3 text-lg font-semibold">About this hotel</div>
          <div className="text-[#6B6B6B] ml-3 mt-2 text-base leading-relaxed">
            {details.description}
          </div>
          <hr className="text-[#6B6B6B] my-2" />
          <div className="m-3 space-y-2">
            <div className="flex flex-row gap-2 items-center">
              <Phone size={19} className="text-yellow-600 text-base" />
              {details.contact}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Clock size={19} className="text-yellow-600" />
              {details.openingTime} - {details.closingTime}
            </div>
            <div className="flex flex-row items-start gap-2">
              <MapPin size={19} className="mt-1 shrink-0 text-yellow-600" />
              <span>
                {details.address.street}, {details.address.city},{" "}
                {details.address.state}, {details.address.pincode}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white w-full flex flex-col text-black font-ui p-4 my-2 rounded-xl">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setDropdown(!dropdown)}
          >
            <p className="text-lg font-semibold">
              Guest Reviews ({reviews.length})
            </p>
            {dropdown ? (
              <ChevronUp className="ml-auto" />
            ) : (
              <ChevronDown className="ml-auto" />
            )}
          </div>

          {dropdown && (
            <div className="mt-4 space-y-4">
              {token && (
                <form
                  onSubmit={handleAddReview}
                  className="bg-[#F7F5F0] p-3 rounded-xl space-y-3"
                >
                  <div className="text-sm font-semibold text-[#171717]">
                    Write a Review
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={20}
                          className={
                            star <= rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your dining experience..."
                    className="w-full bg-white border border-[#E5E1D8] rounded-lg p-2.5 text-sm outline-none focus:border-yellow-600"
                  />

                  {reviewError && (
                    <div className="text-red-600 text-sm">{reviewError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Posting..." : "Post Review"}
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <div className="text-sm text-[#6B6B6B] py-2">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                <div className="divide-y divide-[#E5E1D8]">
                  {reviews.map((review) => {
                    const isOwner =
                      (review.user?._id || review.user) === currentUserId;

                    return (
                      <div
                        key={review._id}
                        className="py-3 first:pt-0 last:pb-0"
                      >
                        {editingId === review._id ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setEditRating(star)}
                                  className="cursor-pointer"
                                >
                                  <Star
                                    size={18}
                                    className={
                                      star <= editRating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-gray-300"
                                    }
                                  />
                                </button>
                              ))}
                            </div>

                            <textarea
                              rows={2}
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full border border-[#E5E1D8] rounded-lg p-2 text-sm outline-none focus:border-yellow-600"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(review._id)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-sm text-[#171717]">
                                {review.user?.name || "Guest"}
                              </div>
                              <div className="flex items-center gap-2">
                                {review.createdAt && (
                                  <span className="text-xs text-[#6B6B6B]">
                                    {new Date(
                                      review.createdAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                                {isOwner && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(review)}
                                      className="text-[#6B6B6B] hover:text-yellow-600 cursor-pointer"
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }
                                      className="text-[#6B6B6B] hover:text-red-600 cursor-pointer"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 my-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={
                                    star <= review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>

                            <p className="text-sm text-[#6B6B6B]">
                              {review.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="bg-yellow-600 rounded-2xl cursor-pointer hover:bg-yellow-700 shadow-2xl w-full p-4 text-lg font-bold text-white"
          onClick={() => navigate(`/hotels/${id}/tables`)}
        >
          Explore Tables →
        </button>
      </div>
    </div>
  );
}

export default HotelDetails;
