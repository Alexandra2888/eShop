import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ErrorBoundry } from "./error-boundry.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";

import '../i18n.js'; 

import { PayPalScriptProvider } from "@paypal/react-paypal-js";


ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundry fallback={<h1>There was an error. Please try again later.</h1>}>
    <Provider store={store}>
      <PayPalScriptProvider>
        <App/>
      </PayPalScriptProvider>
    </Provider>
  </ErrorBoundry>
);
