import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4"> {t("my_orders")} </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <td className="py-2"> {t("image")}</td>
              <td className="py-2"> {t("id")}</td>
              <td className="py-2"> {t("date")}</td>
              <td className="py-2"> {t("total")}</td>
              <td className="py-2"> {t("paid")}</td>
              <td className="py-2"> {t("delivered")}</td>
              <td className="py-2"></td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.user}
                  className="w-[6rem] mb-5"
                />

                <td className="py-2">{order._id}</td>
                <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="py-2">$ {order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      {t("completed")}
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      {t("pending")}
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      {t("completed")}
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      {t("pending")}
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  <Link to={`/order/${order._id}`}>
                    <Button className="bg-green-400 text-back py-2 px-3 rounded">
                      {t("view_details")}
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;
