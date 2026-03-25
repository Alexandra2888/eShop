import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FaDollarSign,
  FaUsers,
  FaShoppingBag,
  FaArrowUp,
} from "react-icons/fa";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import Metadata from "../../components/Metadata";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const StatCard = ({ icon: Icon, label, value, color, index }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4 hover:border-white/10 transition-colors duration-200"
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}
    >
      <Icon size={18} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-zinc-500 text-xs font-medium mb-1">{label}</p>
      <p className="text-white font-display font-bold text-2xl truncate">
        {value}
      </p>
      <p className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
        <FaArrowUp size={9} /> +12% this month
      </p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers } = useGetUsersQuery();
  const { data: orders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const { t } = useTranslation();

  const [chartState, setChartState] = useState<any>({
    options: {
      chart: {
        type: "area",
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "Inter, sans-serif",
      },
      theme: { mode: "dark" },
      tooltip: { theme: "dark" },
      colors: ["#10b981"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      grid: {
        borderColor: "rgba(255,255,255,0.05)",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
      },
      markers: { size: 3, colors: ["#10b981"], strokeWidth: 0 },
      xaxis: {
        categories: [],
        labels: { style: { colors: "#71717a", fontSize: "11px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#71717a", fontSize: "11px" },
          formatter: (v: number) => `$${v}`,
        },
      },
      legend: { show: false },
    },
    series: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formatted = salesDetail.map((item: any) => ({
        x: item._id,
        y: item.totalSales,
      }));
      setChartState((prev: any) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: formatted.map((i: any) => i.x),
          },
        },
        series: [{ name: "Revenue", data: formatted.map((i: any) => i.y) }],
      }));
    }
  }, [salesDetail]);

  const stats = [
    {
      icon: FaDollarSign,
      label: t("sales"),
      value: isLoading ? "…" : `$${sales?.totalSales?.toFixed(0)}`,
      color: "bg-emerald-500",
    },
    {
      icon: FaUsers,
      label: t("customers"),
      value: isLoading ? "…" : String(customers?.length ?? 0),
      color: "bg-violet-500",
    },
    {
      icon: FaShoppingBag,
      label: t("all_orders"),
      value: isLoading ? "…" : String(orders?.totalOrders ?? 0),
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Metadata title="Admin Dashboard" />
      <AdminMenu />

      <main className="md:pl-56 px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
            Overview
          </p>
          <h1 className="font-display text-3xl font-bold text-white">
            {t("admin_dashboard")}
          </h1>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-zinc-900 border border-white/[0.06] rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-zinc-500 text-xs font-medium">
                Revenue over time
              </p>
              <h3 className="text-white font-semibold text-lg">Sales Trend</h3>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : (
            <Chart
              options={chartState.options}
              series={chartState.series}
              type="area"
              height={280}
            />
          )}
        </motion.div>

        {/* Orders table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <OrderList embedded />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
