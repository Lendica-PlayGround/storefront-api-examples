import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Client from "shopify-buy";
// import Client from "shopify-buy/index.unoptimized.umd";
import "../../shared/app.css";

const client = Client.buildClient({
    storefrontAccessToken: "747fc175336e0680125ead757d14822b",
    domain: "teaica.myshopify.com",
});

ReactDOM.render(<App client={client} />, document.getElementById("root"));
