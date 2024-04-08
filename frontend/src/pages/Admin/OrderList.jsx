import Message from "../../components/Message";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import Metadata from "../../components/Metadata";
import Button from "../../components/Button";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const { t } = useTranslation();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <table className="container my-36 mx-auto max-w-sm md:max-w-6xl h-screen">
          <AdminMenu />
          <Metadata title={"Orders"} />
          <thead className="max-w-sm md:w-full border text-xs md:text-sm">
            <tr className="mb-[5rem]">
              <th className="text-left pl-1">{t('user')}</th>
              <th className="text-left pl-1">{t('data')}</th>
              <th className="text-left pl-1">{t('total')}</th>
              <th className="text-left pl-1">{t('paid')}</th>
              <th className="text-left pl-1">{t('delivered')}</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="text-xs md:text-sm">
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user ? order.user.username : "N/A"}</td>
                <td>
                  {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                </td>

                <td>$ {order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-fit md:w-[6rem] rounded-full">
                       {t('completed')} 
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-fit md:w-[6rem] rounded-full">
                       {t('pending')} 
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-fit md:w-[6rem] rounded-full">
                       {t('completed')}
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-fit md:w-[6rem] rounded-full">
                       {t('pending')}
                    </p>
                  )}
                </td>

                <td>
                  <Link to={`/order/${order._id}`}>
                    <Button>  {t('more')}</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OrderList;
