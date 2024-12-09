import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import client from "./apollo/client";

async function enableMocking() {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  console.log("enableMocking");
  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <App />
        </ApolloProvider>
      </Provider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
