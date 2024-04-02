import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; 

const App = () => {
  return (
    <>
     <I18nextProvider i18n={i18n}>
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
      </I18nextProvider>
      <ToastContainer />
    </>
  );
};

export default App;
