import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Badge,
  Pagination,
  PaginationItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Product, ProductInquiry } from "../../../lib/types/product";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { ProductCategory, ProductType } from "../../../lib/enums/products.enum";

/* REDUX */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductProps {
  onAdd: (item: CartItem) => void;
}

export default function Products({ onAdd }: ProductProps) {
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const history = useHistory();

  const [searchText, setSearchText] = useState("");
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCategory: ProductCategory.LIVING_ROOM,
    productType: ProductType.SOFA,
    search: "",
  });

  useEffect(() => {
    const service = new ProductService();
    service
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch(console.error);
  }, [productSearch]);

  const searchHandler = () => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      search: searchText,
    }));
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    setProductSearch((prev) => ({
      ...prev,
      page: value,
    }));
  };

  return (
    <div className="product-frame">
      <Container maxWidth="xl">
        {/* SEARCH */}
        <Stack className="search-title-box">
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchHandler()}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={searchHandler} className="search-btn">
                    <SearchIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* TOOLBAR */}
        <Stack className="product-toolbar">
          <span>Showing {products.length} results</span>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={() =>
                setProductSearch({ ...productSearch, order: "createdAt" })
              }
            >
              New
            </Button>
            <Button
              onClick={() =>
                setProductSearch({ ...productSearch, order: "productPrice" })
              }
            >
              Price
            </Button>
            <Button
              onClick={() =>
                setProductSearch({ ...productSearch, order: "productViews" })
              }
            >
              Popular
            </Button>
          </Stack>
        </Stack>

        {/* PRODUCTS GRID */}
        <div className="products-grid">
          {products.map((product: Product) => {
            const image = `${serverApi}/${product.productImages[0]}`;

            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => history.push(`/products/${product._id}`)}
              >
                <div
                  className="product-image"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  {product.isDiscounted && (
                    <span className="badge sale">Sale</span>
                  )}

                  <div className="overlay">
                    <Button
                      className="add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd({
                          _id: product._id,
                          name: product.productName,
                          price: product.productPrice,
                          quantity: 1,
                          image: product.productImages[0],
                        });
                      }}
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>

                <div className="product-info">
                  <h4>{product.productName}</h4>

                  <div className="price-box">
                    <MonetizationOnIcon fontSize="small" />
                    <span className={product.isDiscounted ? "old-price" : ""}>
                      ${product.productPrice.toLocaleString()}
                    </span>
                    {product.productSalePrice && (
                      <span className="sale-price">
                        ${product.productSalePrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="views">
                    <Badge
                      badgeContent={product.productViews}
                      color="secondary"
                    >
                      <RemoveRedEyeIcon fontSize="small" />
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <Stack className="pagination-box">
          <Pagination
            page={productSearch.page}
            count={productSearch.page + 1}
            onChange={paginationHandler}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                components={{
                  previous: ArrowBackIcon,
                  next: ArrowForwardIcon,
                }}
              />
            )}
          />
        </Stack>
      </Container>
    </div>
  );
}
