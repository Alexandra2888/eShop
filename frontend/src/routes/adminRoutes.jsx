import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../pages/Layout/AdminLayout.jsx";

const Loader = lazy(() => import("../components/Loader.jsx"));

const UserList = lazy(() => import("../pages/Admin/UserList.jsx"));
const CategoryList = lazy(() => import("../pages/Admin/CategoryList.jsx"));
const ProductList = lazy(() => import("../pages/Admin/ProductList.jsx"));
const AllProducts = lazy(() => import("../pages/Admin/AllProducts.jsx"));
const ProductUpdate = lazy(() => import("../pages/Admin/ProductUpdate.jsx"));
const OrderList = lazy(() => import("../pages/Admin/OrderList.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard.jsx"));


const adminRoutes = () => {
  return (
    <Route
      path="/admin"
      element={
        <Suspense fallback={<Loader />}>
          <AdminLayout />
        </Suspense>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="userlist" element={<UserList />} />
      <Route path="categorylist" element={<CategoryList />} />
      <Route path="productlist" element={<ProductList />} />
      <Route path="allproductslist" element={<AllProducts />} />
      <Route path="productlist/:pageNumber" element={<ProductList />} />
      <Route path="product/update/:_id" element={<ProductUpdate />} />
      <Route path="orderlist" element={<OrderList />} />
      <Route path="dashboard" element={<AdminDashboard />} />
    </Route>
  );
};

export default adminRoutes;
