import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ErrorBoundry } from "./error-boundry.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import '../i18n.js'; 

import Loader from "./components/Loader.jsx";

import PrivateRoute from "./components/PrivateRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Auth
const Login = lazy(() => import('./pages/Auth/Login.jsx'));
const Register = lazy(() => import('./pages/Auth/Register.jsx'));


const AdminRoute = lazy(() => import('./pages/Admin/AdminRoute.jsx'));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const UserList = lazy(() => import('./pages/Admin/UserList.jsx'));

const CategoryList = lazy(() =>import('./pages/Admin/CategoryList.jsx'));


const ProductList = lazy(() => import('./pages/Admin/ProductList.jsx'));
const AllProducts = lazy(() => import('./pages/Admin/AllProducts.jsx'));
const ProductUpdate = lazy(() => import('./pages/Admin/ProductUpdate.jsx'));

const Home = lazy(() => import('./pages/Home.jsx'));
const Favorites = lazy(() => import('./pages/Products/Favorites.jsx'));
const ProductDetails = lazy(() => import('./pages/Products/ProductDetails.jsx'));

const Cart = lazy(() => import('./pages/Cart.jsx'));
const Shop = lazy(() => import('./pages/Shop.jsx'));

const Shipping = lazy(() => import('./pages/Orders/Shipping.jsx'));
const PlaceOrder = lazy(() => import('./pages/Orders/PlaceOrder.jsx'));
const Order = lazy(() => import('./pages/Orders/Order.jsx'));
const OrderList = lazy(() => import('./pages/Admin/OrderList.jsx'));

const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard.jsx'));
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'));

const Invoice = lazy(() => import('./pages/Invoice/Invoice.jsx'));

const NotFound = lazy(() => import('./pages/NotFound/NotFound.jsx'));


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
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundry fallback={<h1>There was an error. Please try again later.</h1>}>
    <Provider store={store}>
      <PayPalScriptProvider>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </ErrorBoundry>
);