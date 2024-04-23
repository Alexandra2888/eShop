import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";

import ProgressSteps from "../../components/ProgressSteps";
import Button from "../../components/Button";
import Input from "../../components/Input";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <section className="container mx-auto mt-10 max-w-sm md:w-full">
      <ProgressSteps step1 step2 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-fit md:w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">{t("shipping")}</h1>
          <div className="mb-4">
            <label className="block text-white mb-2">{t("address")}</label>
            <Input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">{t("city")}</label>
            <Input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">{t("postal_code")}</label>
            <Input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter postal code"
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">{t("country")}</label>
            <Input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400">{t("select_method")}</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <Input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />

                <span className="ml-2">{t("paypal_or_credit_card")}</span>
              </label>
            </div>
          </div>

          <Button
            className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 text-white px-5 py-3 md:py-2 md:px-4 rounded-full text-md md:text-lg w-fit flex justify-center items-center md:w-full"
            type="submit"
          >
            {t("continue")}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Shipping;
