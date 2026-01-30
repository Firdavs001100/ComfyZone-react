import React, { useEffect } from "react";
import { Container, Stack, Box, Button, Rating } from "@mui/material";
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

const ChosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct }),
);

const ProviderRetriever = createSelector(retrieveProvider, (provider) => ({
  provider,
}));

interface Props {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct({ onAdd }: Props) {
  const { productId } = useParams<{ productId: string }>();
  const { setChosenProduct, setProvider } = actionDispatch(useDispatch());

  const { chosenProduct } = useSelector(ChosenProductRetriever);
  const { provider } = useSelector(ProviderRetriever);

  useEffect(() => {
    const productService = new ProductService();
    const providerService = new ProviderService();

    productService
      .getProduct(productId)
      .then((product) => {
        setChosenProduct(product);

        if (product.productProvider) {
          providerService
            .getProvider(product.productProvider)
            .then(setProvider)
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [productId]);

  if (!chosenProduct) return null;

  return (
    <div className="chosen-product">
      <Container maxWidth="lg">
        <div className="detail-layout">
          {/* IMAGES */}
          <div className="gallery">
            <Swiper navigation modules={[Navigation]}>
              {chosenProduct.productImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={`${serverApi}/${img}`} alt="product" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* INFO */}
          <div className="details">
            <h1>{chosenProduct.productName}</h1>

            <div className="stats">
              <Rating
                value={chosenProduct.productRating}
                precision={0.5}
                readOnly
              />
              <span>
                <RemoveRedEyeIcon /> {chosenProduct.productViews}
              </span>
            </div>

            <p className="desc">
              {chosenProduct.productDesc || "No description available."}
            </p>

            <div className="price">
              Rp {chosenProduct.productPrice.toLocaleString()}
            </div>

            <Button
              className="add-btn"
              variant="contained"
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

            {/* PROVIDER */}
            {provider && (
              <div className="provider-card">
                <strong>{provider.providerName}</strong>
                {provider.providerDesc && <p>{provider.providerDesc}</p>}
                <Rating value={provider.providerRating} readOnly />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
