import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import Button from "../../components/Button";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <section>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>     
        <div className=" p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sm font-semibold text-gray-700 hover:underline mb-4 inline-block">
          {t('go_back')}
          </Link>
          
          {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
              <div className="overflow-hidden py-12">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img src={product?.image} alt={product?.name} className="w-full h-auto object-cover" />
            </div>
            <div className="md:w-2/3 p-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">{product.name}</h1>
                <HeartIcon />
              </div>
              <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
              <p className="text-gray-600 dark:text-slate-100 my-2">{product.description}</p>
              <p className="text-lg font-semibold text-green-600">${product.price}</p>
         
              {product.countInStock > 0 && (
                <div className="my-4">
                  <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700">Quantity</label>
                  <select id="quantity" value={qty} onChange={e => setQty(e.target.value)} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {[...Array(product.countInStock).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex space-x-4">
                <Button onClick={addToCartHandler} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                {t("add_to_cart")}
                </Button>
             
              </div>
            </div>
          </div>
          <div className="mt-[5rem] container flex flex-wrap items-start justify-between">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product}
                />
              </div>
        </div>
          </>
        )}

      
      </div>
    </div>
    </>
        )}
      </section>
    </>
  );
};

export default ProductDetails;
