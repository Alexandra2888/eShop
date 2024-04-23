import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import {
  addToCart,
  removeFromCart,
  resetCart,
} from "../redux/features/cart/cartSlice";

import Metadata from "../components/Metadata";
import Button from "../components/Button";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const emptyCart = () => {
    dispatch(resetCart());
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <>
      <Metadata title={"Cart"} />
      <section className="flex justify-center items-center my-8 h-screen ">
        {cartItems.length === 0 ? (
          <div className="font-bold">
            {t("cart_empty")}{" "}
            <Link
              to="/shop"
              className="text-blue-800 font-normal hover:underline mx-2 dark:text-gray-300"
            >
              {" "}
              {t("go_to_shop")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col my-8 xs:max-w-xs">
              <h1 className="text-center text-2xl font-semibold my-12 uppercase">
                {t("shopping_cart")}:
              </h1>
              <div>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-enter my-3 pb-2 justify-center items-center"
                  >
                    <div className="w-[5rem] h-[5rem]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 ml-4">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-gray-900 dark:text-slate-100"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-2 text-white">{item.brand}</div>
                      <div className="mt-2 text-white font-bold">
                        $ {item.price}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-12 md:flex-row">
                      <div className="w-24">
                        <label htmlFor="select">
                          <select
                            className="w-full p-1 border rounded text-black"
                            id="select"
                            title="select"
                            aria-label="select"
                            aria-labelledby="select-label"
                            value={item.qty}
                            onChange={(e) =>
                              addToCartHandler(item, Number(e.target.value))
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div>
                        <Button
                          className="text-red-500 mr-[5rem]"
                          aria-label="delete"
                          aria-labeledby="delete"
                          role="delete"
                          id="delete"
                          title="delete"
                          aria-labelledby="delete-icon"
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FaTrash className="ml-[1rem] mt-[.5rem]" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-8 w-[40rem]">
                  <div className="p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">
                      {t("items")} (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                    </h2>

                    <div className="text-2xl font-bold">
                      ${" "}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                  <div className="flex justify-center -mt-16 md:mt-8 md:justify-around">
                    <Button
                      className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white md:-ml-24 rounded-full mx-4 md:mx-0 md:py-2 px-4 md:text-lg"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      {t("proceed_to_checkout")}
                    </Button>

                    <Button
                      className="bg-red-500 rounded-full md:py-2 px-4 md:text-lg mx-4 md:mx-0"
                      disabled={cartItems.length === 0}
                      onClick={emptyCart}
                    >
                      {t("empty_cart")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Cart;
