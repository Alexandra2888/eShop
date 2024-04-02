import { useEffect } from "react";
import {  useParams } from "react-router-dom";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery
} from "../../redux/api/orderApiSlice";

import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

import "./Invoice.css"


const Invoice = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

 function downloadInvoice () {
    const input = document.getElementById('order-summary');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save(`invoice_${order._id}.pdf`);
      });
  };

  const { t } = useTranslation();

  


  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <>
    <div className="container  flex flex-col ml-[10rem] md:flex-row" >
    <Button 
         type="button"
         onClick={downloadInvoice} 
         className="bg-pink-500 text-white text-center w-fit h-fit my-12 px-4 py-2"
       >
        {t('download_invoice')}
       </Button> 
      <div className="md:w-1/3 text-black" id='order-summary'>
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">{t('shipping')}</h2>
          <p className="mb-4 mt-4">
            <strong className="text-black">{t('order')}:</strong> {order._id}
          </p>

          <p className="mb-4">
            <strong className="text-black">{t('name')}:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4">
            <strong className="text-black">{t('email')}:</strong> {order.user.email}
          </p>

          <p className="mb-4">
            <strong className="text-black">{t('address')}:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-black">
            {t('method')}
              </strong>{" "}
            {order.paymentMethod}
          </p>
        </div>
<div id="summary">
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">{t('order_summary')}</h2>
        <div className="flex justify-between mb-2">
          <span>{t('items')}</span>
          <span>$ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t('shipping')}</span>
          <span>$ {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t('tax')}</span>
          <span>$ {order.taxPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>{t('total')}</span>
          <span>$ {order.totalPrice}</span>
        </div>

        </div>
    </div>
        
      </div>

       </>
  );
};

export default Invoice;
