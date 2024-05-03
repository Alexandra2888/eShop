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
              className="text-green-800 font-normal hover:underline mx-2 dark:text-gray-300"
            >
              {" "}
              {t("go_to_shop")}
            </Link>
          </div>
        ) : (
            <>
            <div className="flex justify-center  mt-8 min-h-screen w-full mx-12">
              <div className="container p-5">
                <div className="flex flex-col lg:flex-row justify-between overflow-hidden">
                  {/* Product List */}
                    <div className="w-full p-4">
                    <h2 className="text-xl font-bold border-b pb-2">Shopping Cart</h2>
                    {cartItems.length > 0 ? cartItems.map((item) => (
                      <div key={item._id} className="flex items-center py-2 border-b">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                        <div className="flex-1">
                          <Link to={`/product/${item._id}`} className="text-lg font-semibold">{item.name}</Link>
                          <p className="text-gray-500">{item.brand}</p>
                          <p className="font-bold text-green-700">${item.price}</p>
                        </div>
                        <div className="flex items-center">
                          <select className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            value={item.qty}
                            onChange={(e) => addToCartHandler(item, Number(e.target.value))}>
                            {[...Array(item.countInStock).keys()].map(x => <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                          </select>
                          <button className="p-2 text-red-500 ml-2" onClick={() => removeFromCartHandler(item._id)}><FaTrash /></button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <p>Your cart is empty.</p>
                        <Link to="/shop" className="text-green-500 hover:underline">Go back to shop</Link>
                      </div>
                    )}
                  </div>
      
                  {/* Summary Section */}
                  <div className="w-full  p-4">
                    <div className="sticky top-20">
                      <h2 className="text-xl font-bold border-b pb-2">Summary</h2>
                      <div className="py-2">
                        <p>Total items: {cartItems.reduce((acc, item) => acc + item.qty, 0)}</p>
                        <p>Total Price: ${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</p>
                      </div>
                      <div className="mt-4 space-x-12">
                        <Button className="w-fit bg-green-700 text-white py-2 px-4 rounded hover:bg-green-600" onClick={checkoutHandler}>Checkout</Button>
                        <Button className="w-fit bg-red-500 text-white py-2 px-4  mt-2 rounded hover:bg-red-600" onClick={emptyCart}>Empty Cart</Button>
                      </div>
                    </div>
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
