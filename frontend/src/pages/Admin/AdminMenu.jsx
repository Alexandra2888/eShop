import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaTimes } from "react-icons/fa";

import Button from "../../components/Button";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Button
        className={`${
          isMenuOpen ? "top-1 right-2" : "top-16 right-7"
        } dark:bg-[#3A3A3A] dark:text-slate-50 text-black   p-2 fixed rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="bg-white text-black black:bg-black dark:text-white" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-black dark:bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-black dark:bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-black dark:bg-gray-200 my-1"></div>
          </>
        )}
      </Button>

      {isMenuOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-5">
          <ul className="list-none mt-6">
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("admin_dashboard")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("create_category")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("create_product")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("all_products")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("manage_users")}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightgreen" : "white",
                })}
              >
                {t("manage_orders")}
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
