import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaTags,
  FaPlus,
  FaBoxOpen,
  FaUsers,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const adminLinks = [
  {
    to: "/admin/dashboard",
    icon: FaTachometerAlt,
    labelKey: "admin_dashboard",
  },
  { to: "/admin/categorylist", icon: FaTags, labelKey: "create_category" },
  { to: "/admin/productlist", icon: FaPlus, labelKey: "create_product" },
  { to: "/admin/allproductslist", icon: FaBoxOpen, labelKey: "all_products" },
  { to: "/admin/userlist", icon: FaUsers, labelKey: "manage_users" },
  { to: "/admin/orderlist", icon: FaShoppingBag, labelKey: "manage_orders" },
];

const AdminMenu = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  const SidebarContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">A</span>
          </div>
          <span className="font-display font-bold text-sm text-white">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav links */}
      <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminLinks.map(({ to, icon: Icon, labelKey }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={14}
                    className={isActive ? "text-emerald-400" : "text-zinc-500"}
                  />
                  <span>{t(labelKey)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
          eShop v2.0
        </p>
      </div>
    </nav>
  );

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-56 bg-zinc-950 border-r border-white/[0.06] z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile toggle button ───────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 left-4 z-50 w-11 h-11 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-zinc-300 shadow-card-dark hover:bg-zinc-800 transition-colors"
      >
        <FaBars size={15} />
      </button>

      {/* ── Mobile drawer ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 w-56 bg-zinc-950 border-r border-white/[0.06] z-50 md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
                <span className="font-display font-bold text-sm text-white">
                  Admin Panel
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
              <div className="h-[calc(100%-56px)]">
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminMenu;
