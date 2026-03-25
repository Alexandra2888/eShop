import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
} from "react-icons/fa";

import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

import Message from "../../components/Message";
import Loader from "../../components/Loader";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
      {label}
    </span>
    <span className="text-sm text-zinc-800 dark:text-zinc-200 break-all">
      {value}
    </span>
  </div>
);

const SummaryRow = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div
    className={`flex justify-between text-sm ${bold ? "pt-3 border-t border-zinc-100 dark:border-white/[0.06]" : ""}`}
  >
    <span
      className={
        bold
          ? "font-semibold text-zinc-900 dark:text-white"
          : "text-zinc-500 dark:text-zinc-400"
      }
    >
      {label}
    </span>
    <span
      className={
        bold ? "font-bold text-emerald-500" : "text-zinc-700 dark:text-zinc-300"
      }
    >
      {value}
    </span>
  </div>
);

const Order = () => {
  const { id: orderId } = useParams();
  const { t } = useTranslation();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId!);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state: any) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions" as any,
          value: { "client-id": paypal.clientId, currency: "USD" } as any,
        });
        paypalDispatch({
          type: "setLoadingStatus" as any,
          value: "pending" as any,
        });
      };
      if (order && !order.isPaid && !window.paypal) loadPayPalScript();
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = (_data: any, actions: any) =>
    actions.order.capture().then(async (details: any) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err: any) {
        toast.error(err?.data?.message || err.message);
      }
    });

  const createOrder = (_data: any, actions: any) =>
    actions.order
      .create({ purchase_units: [{ amount: { value: order.totalPrice } }] })
      .then((id: string) => id);

  const onError = (err: any) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <Message variant="error">{(error as any)?.data?.message}</Message>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Order
          </p>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white truncate">
            #{order._id}
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left column ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex-1 min-w-0 space-y-6"
          >
            {/* Order items */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/[0.06]">
                <h2 className="font-semibold text-zinc-900 dark:text-white text-sm">
                  Items
                </h2>
              </div>

              {order.orderItems.length === 0 ? (
                <div className="p-6">
                  <Message>{t("order_is_empty")}</Message>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100 dark:border-white/[0.06]">
                        {[
                          t("image"),
                          t("product"),
                          t("quantity"),
                          t("unit_price"),
                          t("total"),
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
                      {order.orderItems.map((item: any, i: number) => (
                        <tr
                          key={i}
                          className="hover:bg-zinc-100/50 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-xl"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <Link
                              to={`/product/${item.product}`}
                              className="text-zinc-900 dark:text-white font-medium hover:text-emerald-500 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">
                            {item.qty}
                          </td>
                          <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">
                            ${item.price}
                          </td>
                          <td className="px-5 py-3 font-semibold text-zinc-900 dark:text-white">
                            ${(item.qty * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Invoice link */}
            <div>
              <Link
                to={`/order/${order._id}/invoice`}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-700 dark:text-zinc-300 rounded-xl hover:border-emerald-500 hover:text-emerald-500 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-200"
              >
                <FaFileInvoice size={13} />
                {t("invoice")}
              </Link>
            </div>
          </motion.div>

          {/* ── Right column ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:w-80 shrink-0 space-y-4"
          >
            {/* Shipping info */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
                <FaMapMarkerAlt size={13} className="text-emerald-500" />
                {t("shipping")}
              </h2>
              <InfoRow label={t("name")} value={(order.user as any).username} />
              <InfoRow label={t("email")} value={(order.user as any).email} />
              <InfoRow
                label={t("address")}
                value={`${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
              />
              <InfoRow
                label={t("method")}
                value={
                  <span className="flex items-center gap-1.5">
                    <FaCreditCard size={11} className="text-zinc-400" />
                    {order.paymentMethod}
                  </span>
                }
              />
            </div>

            {/* Status badges */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`rounded-2xl p-4 border flex flex-col items-center gap-2 ${order.isPaid ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-white/[0.06]"}`}
              >
                {order.isPaid ? (
                  <FaCheckCircle size={20} className="text-emerald-500" />
                ) : (
                  <FaTimesCircle size={20} className="text-zinc-400" />
                )}
                <span
                  className={`text-xs font-semibold ${order.isPaid ? "text-emerald-500" : "text-zinc-400"}`}
                >
                  {order.isPaid ? t("paid_on") : t("not_paid")}
                </span>
                {order.isPaid && (
                  <span className="text-[10px] text-emerald-400">
                    {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div
                className={`rounded-2xl p-4 border flex flex-col items-center gap-2 ${order.isDelivered ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-white/[0.06]"}`}
              >
                <FaTruck
                  size={20}
                  className={
                    order.isDelivered ? "text-emerald-500" : "text-zinc-400"
                  }
                />
                <span
                  className={`text-xs font-semibold ${order.isDelivered ? "text-emerald-500" : "text-zinc-400"}`}
                >
                  {order.isDelivered ? "Delivered" : "Pending"}
                </span>
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-6 space-y-2.5">
              <h2 className="font-semibold text-zinc-900 dark:text-white text-sm mb-4">
                {t("order_summary")}
              </h2>
              <SummaryRow label={t("items")} value={`$${order.itemsPrice}`} />
              <SummaryRow
                label={t("shipping")}
                value={
                  order.shippingPrice === 0 ? "Free" : `$${order.shippingPrice}`
                }
              />
              <SummaryRow label={t("tax")} value={`$${order.taxPrice}`} />
              <SummaryRow
                label={t("total")}
                value={`$${order.totalPrice}`}
                bold
              />
            </div>

            {/* PayPal */}
            {!order.isPaid && (
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] rounded-2xl p-4">
                {loadingPay || isPending ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {/* Admin: mark delivered */}
            {loadingDeliver && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}
            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-2xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
              >
                <FaTruck size={13} />
                {t("mark_as_delivered")}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Order;
