import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const StarRating = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <FaStar key={`f${i}`} size={13} className="text-amber-400" />
      ))}
      {half === 1 && <FaStarHalfAlt size={13} className="text-amber-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <FaRegStar
          key={`e${i}`}
          size={13}
          className="text-zinc-300 dark:text-zinc-600"
        />
      ))}
    </div>
  );
};

const TABS = [
  { id: 1, labelKey: "write_review" },
  { id: 2, labelKey: "all_reviews" },
  { id: 3, labelKey: "related_products" },
];

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);
  const { t } = useTranslation();

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-zinc-200 dark:border-white/[0.08] mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-emerald-500 border-b-2 border-emerald-500 -mb-px bg-transparent"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {t(tab.labelKey)}
            {tab.id === 2 && product.reviews?.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-500">
                {product.reviews.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Write Review */}
      {activeTab === 1 && (
        <div className="max-w-xl">
          {userInfo ? (
            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  {t("rating")}
                </label>
                <select
                  id="rating"
                  required
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="">{t("select")}</option>
                  <option value="1">{t("inferior")}</option>
                  <option value="2">{t("decent")}</option>
                  <option value="3">{t("great")}</option>
                  <option value="4">{t("excellent")}</option>
                  <option value="5">{t("exceptional")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  {t("comment")}
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product…"
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loadingProductReview}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {loadingProductReview ? "Submitting…" : t("submit")}
              </Button>
            </form>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("please")}{" "}
              <Link
                to="/login"
                className="text-emerald-500 hover:underline font-medium"
              >
                {t("sign_in")}
              </Link>{" "}
              {t("to_write_review")}
            </p>
          )}
        </div>
      )}

      {/* Tab: All Reviews */}
      {activeTab === 2 && (
        <div className="space-y-4 max-w-2xl">
          {product.reviews?.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {t("no_reviews")}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className="mt-3 text-sm text-emerald-500 hover:underline"
              >
                Be the first to review
              </button>
            </div>
          ) : (
            product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm flex items-center justify-center uppercase shrink-0">
                      {review.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <StarRating value={review.rating} />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Related Products */}
      {activeTab === 3 && (
        <div className="flex flex-wrap gap-3">
          {isLoading ? (
            <Loader />
          ) : (
            data?.map((p) => (
              <div key={p._id} className="py-2">
                <SmallProduct product={p} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
