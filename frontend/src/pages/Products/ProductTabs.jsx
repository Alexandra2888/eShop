import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import Button from '../../components/Button';

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


  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col md:flex-row mx-8 md:mx-0">
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 1 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
           {t('write_review')}
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 2 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
           {t('all_reviews')}
        </div>
        <div
          className={`flex-1 p-4 cursor-pointer text-lg ${
            activeTab === 3 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
           {t('related_products')}
        </div>
      </section>

      {/* Second Part */}
      <section>
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2 ml-3 md:ml-0">
                  <label htmlFor="rating" className="block text-xl mb-2">
                  {t('rating')}
                  </label>

                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-black"
                  >
                    <option value=""> {t('select')}</option>
                    <option value="1"> {t('inferior')}</option>
                    <option value="2"> {t('decent')}</option>
                    <option value="3"> {t('great')}</option>
                    <option value="4"> {t('excellent')}</option>
                    <option value="5"> {t('exceptional')}</option>
                  </select>
                </div>

                <div className="my-3 md:my-2 ml-2 md:ml-0">
                  <label htmlFor="comment" className="block text-xl mb-2">
                  {t('comment')}
                  </label>

                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-black"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  disabled={loadingProductReview}
                  className="ml-3 md:ml-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800  text-white py-2 px-4 rounded-lg"
                >
                  {t('submit')}
                </Button>
              </form>
            ) : (
              <p>
                 {t('please')} <Link to="/login"> {t('sign_in')}</Link>  {t('to_write_review')}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        {activeTab === 2 && (
          <>
            <div>{product.reviews.length === 0 && <p> {t('no_reviews')}</p>}</div>

            <div>
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className=" p-4 rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[24rem] mb-5"
                >
                  <div className="flex justify-between">
                    <strong className="text-[#B0B0B0]">{review.name}</strong>
                    <p className="text-[#B0B0B0]">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>

                  <p className="my-4">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section>
        {activeTab === 3 && (
          <section className="ml-[4rem] flex flex-wrap">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
