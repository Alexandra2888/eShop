import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const StatusBadge = ({
  ok,
  trueLabel,
  falseLabel,
}: {
  ok: boolean;
  trueLabel: string;
  falseLabel: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
      ok
        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
        : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
    }`}
  >
    {ok ? trueLabel : falseLabel}
  </span>
);

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Account
          </p>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
            {t("my_orders")}
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="error">
            {(error as any)?.data?.error || (error as any)?.error}
          </Message>
        ) : orders?.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-lg font-medium mb-2">
              No orders yet
            </p>
            <p className="text-zinc-500 text-sm mb-6">
              Your orders will appear here once you place one.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-2xl transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-white/[0.06]">
                    {[
                      t("image"),
                      t("id"),
                      t("date"),
                      t("total"),
                      t("paid"),
                      t("delivered"),
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.04]">
                  {orders?.map((order: any, i: number) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="hover:bg-zinc-100/50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <img
                          src={order.orderItems[0]?.image}
                          alt="order"
                          className="w-10 h-10 object-cover rounded-xl"
                        />
                      </td>
                      <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400 font-mono text-xs max-w-[120px] truncate">
                        {order._id}
                      </td>
                      <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-white whitespace-nowrap">
                        ${order.totalPrice}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          ok={order.isPaid}
                          trueLabel={t("completed")}
                          falseLabel={t("pending")}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          ok={order.isDelivered}
                          trueLabel={t("completed")}
                          falseLabel={t("pending")}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-lg transition-all duration-200"
                        >
                          {t("view_details")}
                          <FaExternalLinkAlt size={9} />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
