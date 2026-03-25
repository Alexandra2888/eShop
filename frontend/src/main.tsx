import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundry } from "./error-boundry";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import "../i18n";

import Loader from "./components/Loader";

import PrivateRoute from "./components/PrivateRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Auth
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));

const AdminRoute = lazy(() => import("./pages/Admin/AdminRoute"));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const UserList = lazy(() => import("./pages/Admin/UserList"));

const CategoryList = lazy(() => import("./pages/Admin/CategoryList"));

const ProductList = lazy(() => import("./pages/Admin/ProductList"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/Admin/ProductUpdate"));

const Home = lazy(() => import("./pages/Home"));
const Favorites = lazy(() => import("./pages/Products/Favorites"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails"));

const Cart = lazy(() => import("./pages/Cart"));
const Shop = lazy(() => import("./pages/Shop"));

const Shipping = lazy(() => import("./pages/Orders/Shipping"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder"));
const Order = lazy(() => import("./pages/Orders/Order"));
const OrderList = lazy(() => import("./pages/Admin/OrderList"));
const UserOrder = lazy(() => import("./pages/User/UserOrder"));

const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const Contact = lazy(() => import("./pages/Contact/Contact"));

const Invoice = lazy(() => import("./pages/Invoice/Invoice"));

const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        }
      >
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
          index={true}
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <Home />
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

        {/* Registered users */}
        <Route path="" element={<PrivateRoute />}>
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
                <Shipping />
              </Suspense>
            }
          />
          <Route
            path="/placeorder"
            element={
              <Suspense fallback={<Loader />}>
                <PlaceOrder />
              </Suspense>
            }
          />
          <Route
            path="order/:id/invoice"
            element={
              <Suspense fallback={<Loader />}>
                <Invoice />
              </Suspense>
            }
          />
          <Route
            path="/order/:id"
            element={
              <Suspense fallback={<Loader />}>
                <Order />
              </Suspense>
            }
          />
          <Route
            path="/user-orders"
            element={
              <Suspense fallback={<Loader />}>
                <UserOrder />
              </Suspense>
            }
          />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route
            path="userlist"
            element={
              <Suspense fallback={<Loader />}>
                <UserList />
              </Suspense>
            }
          />
          <Route
            path="categorylist"
            element={
              <Suspense fallback={<Loader />}>
                <CategoryList />
              </Suspense>
            }
          />
          <Route
            path="productlist"
            element={
              <Suspense fallback={<Loader />}>
                <ProductList />
              </Suspense>
            }
          />
          <Route
            path="allproductslist"
            element={
              <Suspense fallback={<Loader />}>
                <AllProducts />
              </Suspense>
            }
          />
          <Route
            path="productlist/:pageNumber"
            element={
              <Suspense fallback={<Loader />}>
                <ProductList />
              </Suspense>
            }
          />
          <Route
            path="product/update/:_id"
            element={
              <Suspense fallback={<Loader />}>
                <ProductUpdate />
              </Suspense>
            }
          />
          <Route
            path="orderlist"
            element={
              <Suspense fallback={<Loader />}>
                <OrderList />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader />}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        }
      />
    </>,
  ),
  { future: { v7_startTransition: true } as any },
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundry fallback={<h1>There was an error. Please try again later.</h1>}>
    <Provider store={store}>
      <PayPalScriptProvider options={{ clientId: "test" }}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </ErrorBoundry>,
);
