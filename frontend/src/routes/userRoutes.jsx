import PrivateRoute from "../components/PrivateRoute.jsx";
import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomeLayout = lazy(() => import("../pages/Layout/HomeLayout.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Auth/Login.jsx"));
const Register = lazy(() => import("../pages/Auth/Register.jsx"));
const Profile = lazy(() => import("../pages/User/Profile.jsx"));
const Favorites = lazy(() => import("../pages/Products/Favorites.jsx"));
const ProductDetails = lazy(() =>
  import("../pages/Products/ProductDetails.jsx")
);
const Cart = lazy(() => import("../pages/Cart.jsx"));
const Shop = lazy(() => import("../pages/Shop.jsx"));
const Loader = lazy(() => import("../components/Loader.jsx"));
const Shipping = lazy(() => import("../pages/Orders/Shipping.jsx"));
const PlaceOrder = lazy(() => import("../pages/Orders/PlaceOrder.jsx"));
const Order = lazy(() => import("../pages/Orders/Order.jsx"));
const Contact = lazy(() => import("../pages/Contact/Contact.jsx"));
const Invoice = lazy(() => import("../pages/Invoice/Invoice.jsx"));

const userRoutes = () => {
  return (
    <>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <HomeLayout />
          </Suspense>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<Loader />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/favorite"
          element={
            <Suspense fallback={<Loader />}>
              <Favorites />
            </Suspense>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Suspense fallback={<Loader />}>
              <ProductDetails />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<Loader />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="/shop"
          element={
            <Suspense fallback={<Loader />}>
              <Shop />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<Loader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loader />}>
              <Profile />
            </Suspense>
          }
        />

        <Route
          path="/shipping"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <Shipping />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path="/placeorder"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <PlaceOrder />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path="order/:id/invoice"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <Invoice />
              </PrivateRoute>
            </Suspense>
          }
        />
        <Route
          path="/order/:id"
          element={
            <Suspense fallback={<Loader />}>
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            </Suspense>
          }
        />
      </Route>
    </>
  );
};

export default userRoutes;
