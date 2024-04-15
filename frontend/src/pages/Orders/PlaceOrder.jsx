import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [calculatedPrices, setCalculatedPrices] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  });

  const calcPrices = (orderItems) => {
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const shippingPrice = itemsPrice < 500 ? 100 : 0;
    const taxRate = 0.15;
    const taxPrice = Number((itemsPrice * taxRate).toFixed(2));
    const totalPrice = Number(
      (itemsPrice + shippingPrice + taxPrice).toFixed(2)
    );

    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice,
      totalPrice,
    };
  };

  // Calculate prices whenever the cart items change
  useEffect(() => {
    const prices = calcPrices(cart.cartItems);
    setCalculatedPrices(prices);
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
    } catch (error) {
      toast.error(error.toString());
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mt-8 md:ml-[15rem] max-w-6xl">
        {cart.cartItems.length === 0 ? (
          <Message>{t("empty_cart")}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top">
                    {t("image")}
                  </td>
                  <td className="px-1 py-2 text-left">{t("product")}</td>
                  <td className="px-1 py-2 text-left">{t("quantity")}</td>
                  <td className="px-1 py-2 text-left">{t("price")}</td>
                  <td className="px-1 py-2 text-left">{t("total")}</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}</td>
                    <td className="p-2">
                      $ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">{t("order_summary")}</h2>
          <div className="flex justify-between flex-wrap p-8 dark:bg-[#3A3A3A]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">{t("items")}:</span> $
                {calculatedPrices.itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">{t("shipping")}:</span> $
                {calculatedPrices.shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">{t("tax")}:</span> $
                {calculatedPrices.taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">{t("total")}:</span> $
                {calculatedPrices.totalPrice}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div>
              <h2 className="text-2xl font-semibold mb-4">{t("shipping")}</h2>
              <p>
                <strong>{t("address")}:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {t("payment_method")}
              </h2>
              <strong>{t("method")}:</strong> {cart.paymentMethod}
            </div>
          </div>

          <Button
            type="button"
            className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            {t("place_order")}
          </Button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
