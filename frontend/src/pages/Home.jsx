import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetProductsQuery } from "../redux/api/productApiSlice";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Main from "../components/Main";
import Product from "./Products/Product";
import ChatWidget from "../components/ChatWidget";
import Category from "../pages/User/Category";
import ProductShowcase from "../components/ProductShowcase";
import Reviews from "../components/Reviews"

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { t } = useTranslation();

  return (
    <>
      {!keyword ? <Main /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
            <>
              
              <div className="flex flex-col justify-center items-center space-x-12 my-12">
            <h1 className="text-xl font-bold text-center py-5">
              Latest categories
            </h1>
          <Category/>
              </div>
              

          <div className="flex justify-center items-center space-x-12 my-24">
            <h1 className="text-xl font-bold text-center">
              {t("latest_products")}
            </h1>

            <Link
              to="/shop"
              className="bg-green-600 text-white font-bold rounded-full max-w-fit px-3 py-2"
            >
              {t("shop")}
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
                 
                </div>
                <ProductShowcase />
                <Reviews/>
            <ChatWidget className="mr-0" />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
