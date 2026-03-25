import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaUserCircle,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";

import FavoritesCount from "../Products/FavoritesCount";
import NavLink from "./NavLink";
import Button from "../../components/Button";
import ToggleTheme from "../../components/ToggleTheme";

const navItems = [
  { to: "/", icon: FaHome, labelKey: "home" },
  { to: "/shop", icon: FaShoppingBag, labelKey: "shop" },
  { to: "/favorite", icon: FaHeart, labelKey: "favorites" },
  { to: "/cart", icon: FaShoppingCart, labelKey: "cart" },
  { to: "/contact", icon: FaEnvelopeOpen, labelKey: "contact" },
];

function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userInfo } = useSelector((state: any) => state.auth);
  const { cartItems } = useSelector((state: any) => state.cart);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const totalCartItems = cartItems.reduce((a: number, c: any) => a + c.qty, 0);

  return (
    <>
      {/* ── Desktop / Tablet top nav ─────────────────────────────── */}
      <motion.header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass dark:glass-dark shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-display font-bold text-sm">
                e
              </span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight dark:text-white text-zinc-900">
              eShop
            </span>
          </Link>

          {/* Center links */}
          <ul className="flex items-center gap-1">
            {navItems.map(({ to, labelKey }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="nav-link-underline relative px-4 py-2 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2"
                >
                  {labelKey === "cart" && totalCartItems > 0 ? (
                    <>
                      {t(labelKey)}
                      <motion.span
                        key={totalCartItems}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
                      >
                        {totalCartItems}
                      </motion.span>
                    </>
                  ) : labelKey === "favorites" ? (
                    <>
                      {t(labelKey)}
                      <FavoritesCount />
                    </>
                  ) : (
                    t(labelKey)
                  )}
                </NavLink>
              </li>
            ))}
            {userInfo?.isAdmin && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className="nav-link-underline px-4 py-2 text-sm font-medium rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200"
                >
                  {t("admin")}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={i18n.language}
              className="bg-transparent text-sm font-medium text-zinc-600 dark:text-zinc-300 cursor-pointer border border-zinc-200 dark:border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="de">DE</option>
              <option value="en">EN</option>
              <option value="ro">RO</option>
            </select>

            <ToggleTheme />

            {!userInfo ? (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
              >
                <FaSignInAlt size={13} />
                {t("login")}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200"
                >
                  <FaUserCircle size={16} />
                </Link>
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-all duration-200"
                >
                  <FaSignOutAlt size={13} />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Spacer for fixed nav on desktop */}
      <div className="hidden lg:block h-16" />

      {/* ── Mobile top bar ────────────────────────────────────────── */}
      <div
        className={`lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 h-14 transition-all duration-300 ${
          scrolled
            ? "glass dark:glass-dark shadow-lg"
            : "bg-white dark:bg-zinc-950"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">e</span>
          </div>
          <span className="font-display font-bold text-lg dark:text-white text-zinc-900">
            eShop
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────── */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-350"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-72 max-w-[80vw] flex-col bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-white/[0.06] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-14 border-b border-zinc-100 dark:border-white/[0.06]">
                  <Link to="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <span className="text-white font-display font-bold text-xs">
                        e
                      </span>
                    </div>
                    <span className="font-display font-bold text-lg dark:text-white text-zinc-900">
                      eShop
                    </span>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>

                {/* Links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                  {navItems.map(({ to, icon: Icon, labelKey }, i) => (
                    <motion.div
                      key={to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <NavLink
                        to={to}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-200"
                      >
                        <Icon className="h-4 w-4 text-emerald-500" />
                        <span>{t(labelKey)}</span>
                        {labelKey === "cart" && totalCartItems > 0 && (
                          <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {totalCartItems}
                          </span>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                  {userInfo?.isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: navItems.length * 0.06,
                        duration: 0.3,
                      }}
                    >
                      <NavLink
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200"
                      >
                        {t("admin")}
                      </NavLink>
                    </motion.div>
                  )}
                </nav>

                {/* Bottom controls */}
                <div className="px-4 pb-6 pt-4 border-t border-zinc-100 dark:border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between px-4">
                    <select
                      onChange={(e) => changeLanguage(e.target.value)}
                      value={i18n.language}
                      className="bg-transparent text-sm text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 rounded-lg px-2 py-1 cursor-pointer"
                    >
                      <option value="de">DE</option>
                      <option value="en">EN</option>
                      <option value="ro">RO</option>
                    </select>
                    <ToggleTheme />
                  </div>
                  {!userInfo ? (
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all duration-200"
                    >
                      <FaSignInAlt size={13} />
                      {t("login")}
                    </Link>
                  ) : (
                    <button
                      onClick={logoutHandler}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all duration-200"
                    >
                      <FaSignOutAlt size={13} />
                      {t("logout")}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default Navigation;
