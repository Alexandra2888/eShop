import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { addToCart } from "../../redux/features/cart/cartSlice";

import HeartIcon from "./HeartIcon";
import Button from "../../components/Button";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <section className="flex flex-wrap md:w-[20rem] md:h-[20rem] border-gray-200 border-[1px] rounded-xl shadow-md space-x-5 shaodw-xl overflow-hidden ">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-blue-800 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full ">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full"
            src={p.image}
            alt={p.name}
            style={{ height: "170px", objectFit: "cover", margin: "2px" }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="flex justify-between">
          <h5 className="mb-2 text-xl text-whiet dark:text-slate-50">
            {p?.name}
          </h5>

          <p className=" font-semibold text-black dark:text-slate-300">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mb-3 font-normal text-gray-700 dark:text-slate-300">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="flex justify-between items-center">
          <div className="flex items-center space-x-24">
            <Link
              to={`/product/${p._id}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 dark:focus:ring-blue-600"
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

            <Button
              className="p-2 rounded-full"
              onClick={() => addToCartHandler(p, 1)}
            >
              <AiOutlineShoppingCart size={25} />
            </Button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProductCard;
