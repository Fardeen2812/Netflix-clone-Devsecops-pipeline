import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from "axios";

// Set global base URL for all axios requests
// We use relative path so it goes through CloudFront -> ALB
axios.defaults.baseURL = "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
