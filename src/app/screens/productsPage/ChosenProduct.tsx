import React, { useEffect } from "react";
import { Container, Button, Rating } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import "swiper/css";
import "swiper/css/navigation";

import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import ProductService from "../../../services/ProductService";
import ProviderService from "../../../services/ProviderService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";

import { setChosenProduct, setProvider } from "./slice";
import { retrieveChosenProduct, retrieveProvider } from "./selector";

/* REDUX */
const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: any) => dispatch(setChosenProduct(data)),
  setProvider: (data: any) => dispatch(setProvider(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

const providerRetriever = createSelector(retrieveProvider, (provider) => ({
  provider,
}));

interface Props {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct({ onAdd }: Props) {
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, setProvider } = actionDispatch(useDispatch());

  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { provider } = useSelector(providerRetriever);

  useEffect(() => {
    const productService = new ProductService();
    const providerService = new ProviderService();

    productService.getProduct(productId).then((product) => {
      setChosenProduct(product);

      if (product.productProvider) {
        providerService.getProvider(product.productProvider).then(setProvider);
      }
    });
  }, [productId]);

  if (!chosenProduct) return null;

  return (
    <div className="chosen-product">
      <Container maxWidth="lg">
        <div className="chosen-layout">
          {/* LEFT – IMAGE */}
          <div className="chosen-gallery">
            <Swiper navigation modules={[Navigation]}>
              {chosenProduct.productImages.map((img: string, idx: number) => (
                <SwiperSlide key={idx}>
                  <img src={`${serverApi}/${img}`} alt="product" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT – INFO */}
          <div className="chosen-info">
            <h1 className="product-title">{chosenProduct.productName}</h1>

            <div className="meta">
              <Rating
                value={chosenProduct.productRating}
                precision={0.5}
                readOnly
              />
              <span>
                <RemoveRedEyeIcon fontSize="small" />
                {chosenProduct.productViews}
              </span>
            </div>

            <div className="product-price">
              ${chosenProduct.productPrice.toLocaleString()}
            </div>

            <p className="product-desc">
              {chosenProduct.productDesc || "No description available."}
            </p>

            <Button
              className="add-to-cart-btn"
              onClick={() =>
                onAdd({
                  _id: chosenProduct._id,
                  name: chosenProduct.productName,
                  price: chosenProduct.productPrice,
                  quantity: 1,
                  image: chosenProduct.productImages[0],
                })
              }
            >
              Add to Cart
            </Button>

            {provider && (
              <div className="provider-box">
                <strong>{provider.providerName}</strong>
                <Rating value={provider.providerRating} readOnly />
                {provider.providerDesc && <p>{provider.providerDesc}</p>}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
