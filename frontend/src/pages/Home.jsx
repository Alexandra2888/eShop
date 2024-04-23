import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetProductsQuery } from "../redux/api/productApiSlice";

import Loader from "../components/Loader";
import Message from "../components/Message";
import Main from "../components/Main";
import Product from "./Products/Product";
import ChatWidget from "../components/ChatWidget";
import Reviews from "../components/Reviews";

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
          <div className="flex justify-center md:justify-between items-center ">
            <h1 className="ml-[20rem] mt-[10rem] text-xl font-bold text-center">
              {t("special_products")}
            </h1>

            <Link
              to="/shop"
              className="bg-blue-600 text-white font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem] mx-8"
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
              <div>
                <Reviews />
              </div>
            </div>
            <ChatWidget className="mr-0" />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
