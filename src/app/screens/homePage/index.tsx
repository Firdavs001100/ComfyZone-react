import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPopularProducts, setNewProducts, setTopProviders } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../../services/ProductService";
import ProviderService from "../../../services/ProviderService";
import { Provider } from "../../../lib/types/provider";
import ProductRange from "./ProductRange";
import PopularProducts from "./PopularProducts";
import "../../../css/home.css";
import Advertisement from "./Advertisement";
import TopProviders from "./TopProviders";
import Events from "./Events";
import SetupPage from "./SetupPage";

// REDUX SLICE & SELECTOR
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopProviders: (data: Provider[]) => dispatch(setTopProviders(data)),
});

export default function HomePage() {
  // Selector : Store => DATA  store+ data olib ishlatish
  const { setPopularProducts, setNewProducts, setTopProviders } =
    actionDispatch(useDispatch());

  useEffect(() => {
    // Backend server data request => DATA
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
      })
      .then((data) => {
        setPopularProducts(data);
      })
      .catch((err) => console.log(err));
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => {
        setNewProducts(data); // data => payload
        console.log("newDishes:", data);
      })
      .catch((err) => console.log(err));

    const provider = new ProviderService();
    provider
      .getTopProviders()
      .then((data) => {
        setTopProviders(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={"homepage"}>
      <ProductRange />
      <PopularProducts />
      <Advertisement />
      <TopProviders />
      <Events />
      <SetupPage />
    </div>
  );
}
