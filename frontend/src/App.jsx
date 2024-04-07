import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; 

import { AppProvider } from "./context/DarkModeContext";

const App = () => {
  return (
    <>
      <I18nextProvider i18n={i18n}>
      <AppProvider>
      <Navigation />
      <main className="py-3 dark:bg-gray-900 dark:text-slate-50">
        <Outlet />
        </main>
          <Footer />
          </AppProvider>
      </I18nextProvider>
      <ToastContainer />
    </>
  );
};

export default App;
