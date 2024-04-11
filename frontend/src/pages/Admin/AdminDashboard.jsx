import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";


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

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers } = useGetUsersQuery();
  const { data: orders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const { t } = useTranslation();


  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />
      <Metadata title={"Admin Dashboard"} />
      <section className="md:ml-[8rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-white text-black p-5 w-[20rem] mt-5 md:ml-[5rem] dark:bg-[#3A3A3A] dark:text-slate-50">
            <div className="font-bold rounded-full w-[3rem] bg-blue-600 text-center p-3">
              $
            </div>

            <p className="mt-5">{t('sales')}</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : sales.totalSales.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 dark:bg-[#3A3A3A]  dark:text-slate-50">
            <div className="font-bold rounded-full w-[3rem] bg-blue-600 text-center p-3">
              $
            </div>

            <p className="mt-5">{t('customers')}</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 dark:bg-[#3A3A3A] dark:text-slate-50">
            <div className="font-bold rounded-full w-[3rem] bg-blue-600 text-center p-3">
              $
            </div>

            <p className="mt-5">{t('all_orders')}</p>
            <h1 className="text-xl font-bold">
              $ {isLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem] dark:bg-[#3A3A3A] dark:text-slate-50">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
