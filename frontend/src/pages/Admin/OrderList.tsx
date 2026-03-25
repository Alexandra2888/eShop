import Message from "../../components/Message";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";

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

interface OrderListProps {
  embedded?: boolean;
}

const OrderList = ({ embedded = false }: OrderListProps) => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const { t } = useTranslation();

  const content = (
    <>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="error">
          {(error as any)?.data?.message || (error as any)?.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  t("user"),
                  t("data"),
                  t("total"),
                  t("paid"),
                  t("delivered"),
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders?.map((order: any, i: number) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="hover:bg-white/[0.02] transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-zinc-300 font-medium whitespace-nowrap">
                    {order.user ? (order.user as any).username : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap text-xs">
                    {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      ok={order.isPaid}
                      trueLabel={t("completed")}
                      falseLabel={t("pending")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      ok={order.isDelivered}
                      trueLabel={t("completed")}
                      falseLabel={t("pending")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-lg transition-all duration-200"
                    >
                      {t("more")}
                      <FaExternalLinkAlt size={9} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-white font-semibold">Recent Orders</h3>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Metadata title="Orders" />
      <AdminMenu />
      <main className="md:pl-56 px-6 py-8">
        <div className="mb-8">
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Admin
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("manage_orders")}
          </h1>
        </div>
        <div className="bg-zinc-900 border border-white/[0.06] rounded-2xl overflow-hidden">
          {content}
        </div>
      </main>
    </div>
  );
};

export default OrderList;
