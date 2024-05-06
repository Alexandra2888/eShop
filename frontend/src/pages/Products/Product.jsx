import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col w-full md:w-80 border-gray-200 border-[1px] rounded-xl shadow-md m-5 overflow-hidden">
    <div className="relative w-full">
      <Link to={`/product/${product._id}`}>
        <img
          className="w-full h-48 object-contain" 
          src={product.image}
          alt={product.name}
        />
        <span className="absolute bottom-2 left-2 bg-green-800 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
          {product.brand}
        </span>
      </Link>
      <div className="absolute top-2 right-2">
        <HeartIcon product={product} />
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col justify-between">  
      <div className="md:flex justify-between">
        <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
          {product.name}
        </h5>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-300">
          {product.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
      <p className="text-gray-700 dark:text-gray-300 flex-grow">  
        {product.description}
      </p>
      <Link
        to={`/product/${product._id}`}
        className="inline-flex items-center justify-center mt-2 px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-md"
      >
        {t("read_more")}
        <svg
          className="ml-2 w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </section>
  );
};

export default Product;
