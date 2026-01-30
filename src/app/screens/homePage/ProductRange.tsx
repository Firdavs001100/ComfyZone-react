import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { useHistory } from "react-router-dom";
import { ProductCategory } from "../../../lib/enums/products.enum";

export default function ProductRange() {
  const history = useHistory();

  const goToCategory = (category: ProductCategory) => {
    history.push(`/products?category=${category}`);
  };

  return (
    <Box className="product-range">
      <Container maxWidth="lg">
        <Stack className="header" spacing={1}>
          <Box className="title">Browse The Range</Box>
          <Box className="desc">
            Find the furniture that best fits your room
          </Box>
        </Stack>

        <Stack className="cards" direction="row" spacing={4}>
          {[
            {
              label: "Dining",
              img: "/img/dining.png",
              cat: ProductCategory.DINING_ROOM,
            },
            {
              label: "Living",
              img: "/img/living.png",
              cat: ProductCategory.LIVING_ROOM,
            },
            {
              label: "Bedroom",
              img: "/img/bedroom.png",
              cat: ProductCategory.BEDROOM,
            },
          ].map((item) => (
            <Stack
              key={item.label}
              className="card"
              onClick={() => goToCategory(item.cat)}
            >
              <img src={item.img} alt={item.label} />
              <Box className="label">{item.label}</Box>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
