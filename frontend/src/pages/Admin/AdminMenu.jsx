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
          isMenuOpen ? "top-1 right-2" : "top-12 right-7"
        } dark:bg-[#151515] text-black dark:text-slate-50  p-2 fixed rounded-lg`}
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
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('admin_dashboard')}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('create_category')}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('create_product')}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/allproductslist"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('all_products')}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('manage_users')}
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3  mb-5 hover:bg-[#2E2D2D] rounded-sm"
                to="/admin/orderlist"
                style={({ isActive }) => ({
                  color: isActive ? "lightblue" : "white",
                })}
              >
                {t('manage_orders')}
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
