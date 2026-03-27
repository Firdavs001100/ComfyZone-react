import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { Visibility, DescriptionOutlined } from "@mui/icons-material";
import {
  Card,
  CardCover,
  CardContent,
  Typography,
  CssVarsProvider,
  CardOverflow,
} from "@mui/joy";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

/** REDUX SELECTOR */
const popularProductsRetriever = createSelector(
  retrievePopularProducts,
  (popularProducts) => ({ popularProducts }),
);

interface Props {
  onAdd: (item: CartItem) => void;
}

export default function PopularProducts({ onAdd }: Props) {
  const { popularProducts } = useSelector(popularProductsRetriever);
  const history = useHistory();

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  console.log("popularProducts:", popularProducts);
  return (
    <div className="popular-products-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">Popular Products</Box>

          {/* Cards */}
          <Stack className="cards-frame">
            {popularProducts.length !== 0 ? (
              popularProducts.map((product: Product) => {
                const imagePath = `${serverApi}/${product.productImages[0]}`;

                return (
                  <CssVarsProvider key={product._id}>
                    <Card
                      className="card"
                      onClick={() =>
                        history.push(
                          `/products/${product._id}/${encodeURIComponent(
                            product.productName.replace(/\s+/g, "-"),
                          )}`,
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    >
                      <CardCover>
                        <img src={imagePath} alt="" />
                      </CardCover>

                      <CardCover className="card-cover" />

                      {/* Add to Cart */}
                      <button
                        className="popular-add"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd({
                            _id: product._id,
                            name: product.productName,
                            price: product.isDiscounted
                              ? (product.productSalePrice ??
                                product.productPrice)
                              : product.productPrice,
                            quantity: 1,
                            image: product.productImages[0],
                          });
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: 18 }} />
                        Add to Cart
                      </button>

                      <CardContent sx={{ justifyContent: "flex-end" }}>
                        <Stack
                          flexDirection={"row"}
                          justifyContent={"space-between"}
                        >
                          <Typography
                            level="h2"
                            fontSize="lg"
                            mb={1}
                            className="card-title"
                          >
                            {product.productName &&
                              (product.productName.length > 16
                                ? `${product.productName.slice(0, 16)}...`
                                : product.productName)}
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: "md",
                              color: "neutral.300",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {product.productViews}
                            <Visibility
                              sx={{ fontSize: 25, marginLeft: "5px" }}
                            />
                          </Typography>
                        </Stack>
                      </CardContent>

                      <CardOverflow
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          py: 1.5,
                          px: "var(--Card-padding)",
                          borderTop: "1px Solid",
                          height: "60px",
                        }}
                      >
                        <Typography
                          startDecorator={
                            <DescriptionOutlined sx={{ marginRight: "12px" }} />
                          }
                          textColor="neutral.300"
                        >
                          {product.productDesc &&
                          product.productDesc.length > 65
                            ? `${product.productDesc.slice(0, 65)}...`
                            : product.productDesc}
                        </Typography>
                      </CardOverflow>
                    </Card>
                  </CssVarsProvider>
                );
              })
            ) : (
              <Box className="no-data">Popular products are not available!</Box>
            )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
