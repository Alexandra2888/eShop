import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  FaHome,
  FaEnvelopeOpen,
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

import FavoritesCount from "../Products/FavoritesCount";
import NavLink from "./NavLink";
import Button from "../../components/Button";
import ToggleTheme from "../../components/ToggleTheme";

function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const { i18n, t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-fit max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <Button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <FaTimes
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto dark:bg-[#172A45] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">eShop</div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul
                            role="list"
                            className="-mx-2 space-y-1 dark:text-gray-900"
                          >
                            <li>
                              <select
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="bg-inherit text-black p-2 rounded cursor-pointer"
                                value={i18n.language}
                              >
                                <option value="de">DE</option>
                                <option value="en">EN</option>
                                <option value="ro">RO</option>
                              </select>
                            </li>
                            <li>
                              <NavLink
                                to="/"
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              >
                                <FaHome
                                  className="h-5 w-5 text-white dark:text-gray-900"
                                  aria-hidden="true"
                                />
                                <span className="dark:text-gray-900">
                                  {t("home")}
                                </span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/shop"
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold dark:text-gray-900"
                              >
                                <FaShoppingBag
                                  className="h-5 w-5  dark:text-gray-900 "
                                  aria-hidden="true"
                                />
                                <span className="dark:text-gray-900">
                                  {" "}
                                  {t("shop")}
                                </span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/contact"
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              >
                                <FaEnvelopeOpen
                                  className="h-5 w-5 text-white dark:text-gray-900"
                                  aria-hidden="true"
                                />
                                <span className="dark:text-gray-900">
                                  {" "}
                                  {t("contact")}
                                </span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/cart"
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              >
                                <FaShoppingCart
                                  className="h-5 w-5 text-white dark:text-gray-900"
                                  aria-hidden="true"
                                />
                                <span className="dark:text-gray-900">
                                  {" "}
                                  {t("cart")}
                                </span>
                                {cartItems.length > 0 && (
                                  <span>
                                    <span className="px-1 py-0 text-sm text-white dark:bg-[#172A45] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 rounded-full">
                                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </span>
                                  </span>
                                )}
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/favorite"
                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              >
                                <FaHeart
                                  className="h-5 w-5  dark:text-gray-900 "
                                  aria-hidden="true"
                                />
                                <span className="dark:text-gray-900">
                                  {t("favorites")}
                                </span>
                                <FavoritesCount />
                              </NavLink>
                            </li>
                            <li>
                              <li>
                                <NavLink to="/admin/dashboard">
                                  <span className="sr-only">admin</span>
                                  {userInfo && userInfo.isAdmin && (
                                    <span className="text-white mx-4 dark:text-gray-900">
                                      {t("admin")}
                                    </span>
                                  )}
                                </NavLink>
                              </li>
                            </li>
                            <li>
                              {!userInfo && (
                                <ul>
                                  <li>
                                    <NavLink
                                      to="/login"
                                      className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                                    >
                                      <FaSignInAlt className=" h-6 w-6 text-white mr-2 mt-[4px] dark:text-gray-900" />

                                      <span className="dark:text-gray-900">
                                        {" "}
                                        {t("login")}
                                      </span>
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      to="/register"
                                      className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                                    >
                                      <FaSignOutAlt className="h-6 w-6 text-white mr-2 dark:text-gray-900" />

                                      <span className="dark:text-gray-900">
                                        {" "}
                                        {t("register")}
                                      </span>
                                    </NavLink>
                                  </li>
                                </ul>
                              )}
                            </li>
                          </ul>
                        </li>

                        {userInfo && (
                          <li className="flex ">
                            <span>
                              <FaSignOutAlt className="h-6 w-6 text-white dark:text-gray-900" />
                            </span>
                            <Button
                              onClick={logoutHandler}
                              className="block -mt-2 w-full px-4 py-2 text-left"
                            >
                              <span className="dark:text-gray-900">
                                {" "}
                                {t("logout")}
                              </span>
                            </Button>
                          </li>
                        )}
                        <li className="mx-12 mt-18">
                          <ToggleTheme />
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-fit lg:flex-col ">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto dark:bg-navy-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800  text-white px-6">
            <Link
              to="/"
              className="flex h-16 shrink-0 items-center dark:text-gray-900"
            >
              eShop
            </Link>
            <nav className="flex flex-1 flex-col">
              <ul
                role="list"
                className="flex flex-1 flex-col gap-y-7 dark:text-gray-900"
              >
                {/* Language Selector */}
                <li>
                  <select
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-inherit text-black p-2 rounded cursor-pointer"
                    value={i18n.language}
                  >
                    <option value="de">DE</option>
                    <option value="en">EN</option>
                    <option value="ro">RO</option>
                  </select>
                </li>

                <li>
                  <NavLink
                    to="/"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaHome
                      className="h-5 w-5 text-white dark:text-gray-900"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-900"> {t("home")}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaShoppingBag
                      className="h-5 w-5  dark:text-gray-900"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-900"> {t("shop")}</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/favorite"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaHeart
                      className="h-5 w-5  dark:text-gray-900"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-900">
                      {" "}
                      {t("favorites")}
                    </span>
                    <FavoritesCount />
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/cart"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaShoppingCart
                      className="h-5 w-5 text-white dark:text-gray-900"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-900"> {t("cart")}</span>
                    {cartItems.length > 0 && (
                      <span>
                        <span className="px-1 py-0 text-sm text-white bg-gray-700 rounded-full">
                          {cartItems.reduce((a, c) => a + c.qty, 0)}
                        </span>
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaEnvelopeOpen
                      className="h-5 w-5 text-white dark:text-gray-900"
                      aria-hidden="true"
                    />
                    <span className="dark:text-gray-900"> {t("contact")}</span>
                  </NavLink>
                </li>

                {!userInfo && (
                  <>
                    <li>
                      <NavLink
                        to="/login"
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <FaSignInAlt
                          className="h-5 w-5 text-white dark:text-gray-900"
                          aria-hidden="true"
                        />
                        <span className="dark:text-gray-900">
                          {" "}
                          {t("login")}
                        </span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/register"
                        className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <FaSignInAlt
                          className="h-5 w-5 text-white dark:text-gray-900"
                          aria-hidden="true"
                        />
                        <span className="dark:text-gray-900">
                          {" "}
                          {t("register")}
                        </span>
                      </NavLink>
                    </li>
                  </>
                )}

                {userInfo && (
                  <li className="flex ">
                  <span>
                    <FaSignOutAlt className="h-6 w-6 text-white dark:text-gray-900" />
                  </span>
                  <Button
                    onClick={logoutHandler}
                    className="block -mt-2 w-full px-4 py-2 text-left"
                  >
                    <span className="dark:text-gray-900">
                      {" "}
                      {t("logout")}
                    </span>
                  </Button>
                </li>
                )}
                <li>
                  <NavLink to="/admin/dashboard">
                    <span className="sr-only">admin</span>
                    {userInfo && userInfo.isAdmin && (
                      <span className="text-white mx-4 dark:text-gray-900">
                        {t("admin")}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
              <ul>
                <li className="mx-12 -mt-16 dark:text-gray-900">
                  <ToggleTheme />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 dark:bg-navy-900 pb-2 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Button
          type="button"
          className="-m-2.5 p-2.5 text-indigo-200 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <FaBars className="h-6 w-6" aria-hidden="true" />
        </Button>
        <a href="#">
          <span className="sr-only">Admin</span>
          {userInfo && userInfo.isAmin && <span>{t("admin")}</span>}
        </a>
      </div>
    </>
  );
}

export default Navigation;
