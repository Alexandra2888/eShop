import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import {  Route, Routes } from "react-router";
import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppProvider } from "./context/DarkModeContext.jsx";

const NotFound = lazy(() => import("./pages/NotFound/NotFound.jsx"));

import useUserRoutes from "./routes/userRoutes.jsx";
import useAdminRoutes from "./routes/adminRoutes.jsx";



const App = () => {
  const userRoutes = useUserRoutes();
  const adminRoutes = useAdminRoutes();
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <AppProvider>
          <BrowserRouter>
        <Routes>
              {userRoutes}
              {adminRoutes}
            <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
        </AppProvider>
      </I18nextProvider>
      <ToastContainer />
    </>
  );
};

export default App;
