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
      <nav>
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
              <div className="fixed inset-0 bg-slate-50 text-black dark:bg-[#3A3A3A] dark:text-slate-50" />
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
                          className="h-6 w-6 text-green-700"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto dark:bg-[#3A3A3A] bg-gray-50 px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center dark:text-slate-50">
                      eShop
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="text-gray-900 dark:text-slate-50 dark:bg-[#3A3A3A] p-2 rounded cursor-pointer"
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
                              className="h-5 w-5 text-gray-900 dark:text-slate-50"
                              aria-hidden="true"
                            />
                            <span className="text-gray-900 dark:text-slate-50">
                              {t("home")}
                            </span>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink
                            to="/shop"
                            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold "
                          >
                            <FaShoppingBag
                              className="h-5 w-5 text-gray-900 dark:text-slate-50 "
                              aria-hidden="true"
                            />
                            <span className="text-gray-900 dark:text-slate-50">
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
                              className="h-5 w-5 text-gray-900 dark:text-slate-50"
                              aria-hidden="true"
                            />
                            <span className="text-gray-900 dark:text-slate-50">
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
                              className="h-5 w-5 text-gray-900 dark:text-slate-50"
                              aria-hidden="true"
                            />
                            <span className="text-gray-900 dark:text-slate-50">
                              {" "}
                              {t("cart")}
                            </span>
                            {cartItems.length > 0 && (
                              <span>
                                <span className="px-1 py-0  h-5 w-5 rounded-full bg-green-700 text-white">
                                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                                </span>
                              </span>
                            )}
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/favorite"
                            className="group flex items-center space-x-2 rounded-md p-2 text-sm font-semibold"
                          >
                            <FaHeart
                              className="h-5 w-5 text-gray-900 dark:text-slate-50"
                              aria-hidden="true"
                            />
                            <span className="text-gray-900 dark:text-slate-50">
                              {t("favorites")}
                            </span>
                            <div className="flex items-center justify-center min-w-[20px] h-5 bg-green-700 text-white text-xs rounded-full">
                              <FavoritesCount />
                            </div>
                          </NavLink>
                        </li>

                        <li>
                          <NavLink to="/admin/dashboard">
                            <span className="sr-only">admin</span>
                            {userInfo && userInfo.isAdmin && (
                              <span className="text-gray-900 dark:text-slate-50">
                                {t("admin")}
                              </span>
                            )}
                          </NavLink>
                        </li>

                        {!userInfo && (
                          <li>
                            <NavLink
                              to="/login"
                              className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                            >
                              <FaSignInAlt className=" h-6 w-6 text-gray-900 dark:text-slate-50 mr-2 mt-[4px] " />

                              <span className="text-gray-900 dark:text-slate-50">
                                {" "}
                                {t("login")}
                              </span>
                            </NavLink>
                          </li>
                        )}

                        {userInfo && (
                          <li className="flex ">
                            <span>
                              <FaSignOutAlt className="h-6 w-6 text-gray-900 dark:text-slate-50" />
                            </span>
                            <Button
                              onClick={logoutHandler}
                              className="block -mt-2 w-full px-4 py-2 text-left text-gray-900 dark:text-slate-50"
                            >
                              <span className=""> {t("logout")}</span>
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
        <nav className="hidden bg-gray-50 lg:sticky lg:top-0 lg:z-40 lg:flex lg:min-w-full lg:justify-between px-12 dark:bg-[#3A3A3A]">
          <ul>
            <li>
              <Link
                to="/"
                className="flex h-16 shrink-0 items-center text-grey-900 dark:text-slate-50 dark:bg-[#3A3A3A] hover:text-green-700"
              >
                eShop
              </Link>
            </li>
          </ul>

          <div className="flex  text-gray-900 dark:bg-[#3A3A3A] dark:text-slate-50">
            <ul className="flex text-center justify-center items-center">
              <li>
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-inherit text-black p-2 rounded cursor-pointer dark:text-slate-50"
                  value={i18n.language}
                >
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                  <option value="ro">RO</option>
                </select>
              </li>
              <li>
                <NavLink
                  to="/shop"
                  className="flex items-center space-x-2 hover:text-green-700"
                >
                  <FaShoppingBag className="h-6 w-6 text-gray-900 dark:text-white" />
                  <span className="text-sm text-center text-gray-900 dark:text-white">
                    Shop
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/favorite"
                  className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                >
                  <FaHeart
                    className="h-5 w-5 text-gray-900 dark:text-slate-50 hover:text-green-700"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-center text-gray-900 dark:text-white">
                    Favorites
                  </span>
                  <FavoritesCount />
                </NavLink>
              </li>

              <li className="relative">
                <NavLink
                  to="/cart"
                  className="flex items-center space-x-2 hover:text-green-700"
                >
                  <FaShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
                  <span>Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute bottom-5 right-10  h-5 w-5 rounded-full bg-green-700 text-white flex items-center justify-center text-xs">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
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
                    className="h-5 w-5 text-gray-900 dark:text-slate-50 hover:text-green-700"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-center text-gray-900 dark:text-white">
                    Contact
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/dashboard">
                  <span className="sr-only">admin</span>
                  {userInfo && userInfo.isAdmin && (
                    <span className="text-gray-900 dark:text-slate-50 mx-4 ">
                      {t("admin")}
                    </span>
                  )}
                </NavLink>
              </li>

              {!userInfo && (
                <li>
                  <NavLink
                    to="/login"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaSignInAlt
                      className="h-5 w-5 text-gray-900 dark:text-slate-50 hover:text-green-700"
                      aria-hidden="true"
                    />
                  </NavLink>
                </li>
              )}
              <li className="mx-3 text-gray-900 dark:text-slate-50">
                <ToggleTheme />
              </li>
              {userInfo && (
                <li>
                  <Button
                    onClick={logoutHandler}
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  >
                    <FaSignInAlt
                      className="h-5 w-5 text-gray-900 dark:text-slate-50 hover:text-green-700"
                      aria-hidden="true"
                    />
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </nav>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 pb-2 px-4 py-4 shadow-sm sm:px-6 lg:hidden dark:bg-[#3A3A3A]">
        <Button
          type="button"
          className="-m-2.5 p-2.5 text-green-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <FaBars className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}

export default Navigation;
