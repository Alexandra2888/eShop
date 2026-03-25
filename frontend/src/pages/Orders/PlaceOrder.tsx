import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaArrowRight, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const cart = useSelector((state: any) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
  }, [cart.shippingAddress.address, navigate]);

  const [calculatedPrices, setCalculatedPrices] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  });

  const calcPrices = (orderItems: any[]) => {
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );
    const shippingPrice = itemsPrice < 500 ? 100 : 0;
    const taxPrice = Number((itemsPrice * 0.15).toFixed(2));
    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2),
    );
    return {
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice,
      totalPrice,
    };
  };

  useEffect(() => {
    setCalculatedPrices(calcPrices(cart.cartItems));
  }, [cart.cartItems]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        ...calculatedPrices,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      <ProgressSteps step1 step2 step3 />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>{t("empty_cart")}</Message>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Order items table */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/[0.06]">
                <h2 className="font-semibold text-zinc-900 dark:text-white">
                  Order Items
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/[0.06]">
                      {[
                        t("image"),
                        t("product"),
                        t("quantity"),
                        t("price"),
                        t("total"),
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                    {cart.cartItems.map((item: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-zinc-100/50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-5 py-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-zinc-900 dark:text-white font-medium hover:text-emerald-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                          {item.qty}
                        </td>
                        <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-white">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary + shipping + payment row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price breakdown */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">
                  {t("order_summary")}
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    {
                      label: t("items"),
                      value: `$${calculatedPrices.itemsPrice}`,
                    },
                    {
                      label: t("shipping"),
                      value:
                        calculatedPrices.shippingPrice === 0
                          ? "Free"
                          : `$${calculatedPrices.shippingPrice}`,
                    },
                    { label: t("tax"), value: `$${calculatedPrices.taxPrice}` },
                  ].map(({ label, value }) => (
                    <li key={label} className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {label}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {value}
                      </span>
                    </li>
                  ))}
                  <li className="flex justify-between pt-3 border-t border-zinc-100 dark:border-white/[0.06]">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {t("total")}
                    </span>
                    <span className="font-bold text-emerald-500">
                      ${calculatedPrices.totalPrice}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Shipping */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt size={13} className="text-emerald-500" />
                  {t("shipping")}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              {/* Payment */}
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCreditCard size={13} className="text-emerald-500" />
                  {t("payment_method")}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("method")}:{" "}
                  <span className="text-zinc-900 dark:text-white font-medium">
                    {cart.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {error && (
              <Message variant="error">{(error as any)?.data?.message}</Message>
            )}

            {/* CTA */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {t("place_order")}
                    <FaArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
