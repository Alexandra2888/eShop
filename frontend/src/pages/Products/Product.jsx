import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-wrap md:w-[20rem] md:h-[20rem] border-gray-200 border-[1px] rounded-xl shadow-md space-x-8 md:mx-10 md:my-8 overflow-hidden">
    <section className="relative">
      <Link to={`/product/${product._id}`}>
        <span className="absolute bottom-2 left-56 bg-green-800 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full ">
          {product?.brand}
        </span>
        <img
          className="cursor-pointer w-full"
          src={product.image}
          alt={product.name}
          style={{ height: "170px", objectFit: "cover", margin: "2px" }}
        />
      </Link>
      <HeartIcon product={product} />
    </section>

    <div className="p-5">
      <div className="flex justify-between space-x-3">
        <h5 className="mb-2 text-xl text-whiet dark:text-slate-50">
          {product?.name}
        </h5>

        <p className=" font-semibold text-black dark:text-slate-300">
          {product?.price?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>

      <p className="mb-3 font-normal text-gray-700 dark:text-slate-300">
          {product?.description}
      </p>

      <section className="flex justify-between items-center">
        <div className="flex items-center space-x-24">
          <Link
            to={`/product/${product._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center bg-green-700 text-slate-50"
          >
            {t("read_more")}
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

         
        </div>
      </section>
    </div>
  </section>
  );
};

export default Product;
