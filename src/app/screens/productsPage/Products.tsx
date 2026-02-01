import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  Slider,
  Pagination,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useHistory, useLocation } from "react-router-dom";

import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../../services/ProductService";
import { serverApi } from "../../../lib/config";

import { ProductType, ProductCategory } from "../../../lib/enums/products.enum";
import { ProductInquiry } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";

/* ================= REDUX ================= */

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: any[]) => dispatch(setProducts(data)),
});

const ProductsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductProps {
  onAdd: (item: CartItem) => void;
}

/* ================= COMPONENT ================= */

export default function Products(props: ProductProps) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { setProducts } = actionDispatch(dispatch);
  const { products } = useSelector(ProductsRetriever);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category") as ProductCategory | null;
  const searchFromUrl = queryParams.get("search") ?? "";

  /* ================= SEARCH STATE ================= */

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 12,
    order: "createdAt",
    search: searchFromUrl || undefined,
    productCategory: categoryFromUrl ?? undefined,
  });

  useEffect(() => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      productCategory: categoryFromUrl ?? undefined,
    }));
  }, [categoryFromUrl]);

  /* ================= API ================= */

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch(console.error);
  }, [productSearch]);

  /* ================= SORT ================= */

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState("New");

  const handleSortChange = (order: string) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order,
    }));
  };

  const handleSortSelect = (label: string, order: string) => {
    setSelectedSort(label);
    setSortAnchorEl(null);
    handleSortChange(order);
  };

  /* ================= TEXT SEARCH ================= */

  const [value, setValue] = useState(searchFromUrl);

  const handleClear = () => setValue("");
  const handleReset = () => setValue("");

  useEffect(() => {
    setValue(searchFromUrl);
  }, [searchFromUrl]);

  /* sync input → URL (typing) */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (value) params.set("search", value);
    else params.delete("search");

    history.replace({ search: params.toString() });
  }, [value]);

  /* ================= CATEGORY ================= */

  const ALL_CATEGORIES = Object.values(ProductCategory);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    ProductCategory[]
  >([]);

  const visibleCategories = categoriesExpanded
    ? ALL_CATEGORIES
    : ALL_CATEGORIES.slice(0, 3);

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category],
    );
  };

  /* ================= TYPE ================= */

  const ALL_TYPES: ProductType[] = [
    ProductType.SOFA,
    ProductType.SECTIONAL,
    ProductType.ARMCHAIR,
    ProductType.COFFEE_TABLE,
    ProductType.TV_STAND,
    ProductType.BED,
    ProductType.WARDROBE,
    ProductType.DINING_TABLE,
    ProductType.DESK,
    ProductType.BOOKSHELF,
  ];

  const [typesExpanded, setTypesExpanded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);

  const visibleTypes = typesExpanded ? ALL_TYPES : ALL_TYPES.slice(0, 5);

  const toggleType = (type: ProductType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? [] : [type]));
  };

  /* ================= PRICE FILTER ================= */

  const [price, setPrice] = useState<number[]>([0, 5_000_000]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setPrice(newValue as number[]);
  };

  const handleMinChange = (value: number) => {
    setPrice(([_, max]) => [Math.min(value, max), max]);
  };

  const handleMaxChange = (value: number) => {
    setPrice(([min]) => [min, Math.max(value, min)]);
  };

  const formatWon = (value: number) => value.toLocaleString("ko-KR");
  const parseWon = (value: string) => Number(value.replace(/,/g, ""));

  /* ================= COMBINED FILTER EFFECT ================= */

  useEffect(() => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      limit: 12,
      search: value || undefined,
      productCategory: selectedCategories[0],
      productType: selectedTypes[0],
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [value, searchFromUrl, selectedCategories, selectedTypes, price]);

  /* ================= PAGINATION ================= */

  const handlePageChange = (_: any, page: number) => {
    setProductSearch((prev) => ({
      ...prev,
      page,
    }));
  };

  /* ================= FAVORITES ================= */

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  /* ================= ADD TO CART ================= */

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const finalPrice =
      product.isDiscounted && product.productSalePrice
        ? product.productSalePrice
        : product.productPrice;

    props.onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: finalPrice,
      image: product.productImages[0],
    });
  };

  /* ================= UI ================= */

  return (
    <div className="container">
      {/* SORT */}
      <Stack direction="row" justifyContent="flex-end" className="sort-right">
        <span className="sort-label">Sort by</span>

        <Button
          className="sort-button"
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          endIcon={<KeyboardArrowDownRoundedIcon />}
        >
          {selectedSort}
        </Button>

        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
        >
          <MenuItem onClick={() => handleSortSelect("New", "createdAt")}>
            New
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect("Popular", "views")}>
            Popular
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect("Price ↑", "priceAsc")}>
            Price ↑
          </MenuItem>
          <MenuItem onClick={() => handleSortSelect("Price ↓", "priceDesc")}>
            Price ↓
          </MenuItem>
        </Menu>
      </Stack>

      <Stack className="products-list-page" direction="row">
        <Stack className="filter">
          <Stack className="filter-body">
            <Stack className="product-section">
              <Typography className="filter-title" color="secondary">
                Find Your Perfect Furniture
              </Typography>
              {/* SEARCH */}
              <Stack direction="row" alignItems="center" className="input-box">
                <OutlinedInput
                  className="search-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Search for furniture"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <>
                      {value && (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClear}>
                            <CancelRoundedIcon />
                          </IconButton>
                        </InputAdornment>
                      )}
                      <InputAdornment position="end">
                        <IconButton onClick={handleReset}>
                          <RefreshIcon />
                        </IconButton>
                      </InputAdornment>
                    </>
                  }
                />
              </Stack>
            </Stack>
            {/* CATEGORY */}
            <Stack
              className="product-section"
              onMouseEnter={() => setCategoriesExpanded(true)}
              onMouseLeave={() => setCategoriesExpanded(false)}
            >
              <Typography className="filter-title" color="secondary">
                Furniture Category
              </Typography>

              <Stack
                className={`filter-list ${categoriesExpanded ? "expanded" : ""}`}
              >
                {visibleCategories.map((category) => (
                  <Stack
                    key={category}
                    direction="row"
                    alignItems="center"
                    className="filter-item"
                  >
                    <Checkbox
                      size="small"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <Typography className="filter-label">
                      {category.replace(/_/g, " ")}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            {/* TYPE */}
            <Stack
              className="product-section"
              onMouseEnter={() => setTypesExpanded(true)}
              onMouseLeave={() => setTypesExpanded(false)}
            >
              <Typography className="filter-title" color="secondary">
                Furniture Type
              </Typography>

              <Stack
                className={`filter-list ${typesExpanded ? "expanded" : ""}`}
              >
                {visibleTypes.map((type) => (
                  <Stack
                    key={type}
                    direction="row"
                    alignItems="center"
                    className="filter-item"
                  >
                    <Checkbox
                      size="small"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    <Typography className="filter-label">
                      {type.replace(/_/g, " ")}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            {/* PRICE */}
            <Stack className="product-section price-filter">
              <Typography
                className="filter-title"
                color="secondary"
                sx={{ mb: 3 }}
              >
                Furniture Price
              </Typography>

              <Slider
                value={price}
                min={0}
                max={5_000_000}
                onChange={handleSliderChange}
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `₩${formatWon(v)}`}
              />

              <Stack direction="row" className="price-inputs">
                <input
                  type="text"
                  value={formatWon(price[0])}
                  onChange={(e) => handleMinChange(parseWon(e.target.value))}
                  className="price-box"
                />
                <span className="price-separator">–</span>
                <input
                  type="text"
                  value={formatWon(price[1])}
                  onChange={(e) => handleMaxChange(parseWon(e.target.value))}
                  className="price-box"
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {/* PRODUCTS */}
        <Stack className="main" direction={"row"}>
          {!products.length ? (
            <Box className="no-data">
              <SearchIcon fontSize="large" />
              <Typography variant="h6">No results found</Typography>
              <Typography variant="body2">
                We couldn't find anything matching your search.
              </Typography>
            </Box>
          ) : (
            products.map((product) => {
              const isFavorite = favorites.has(product._id);

              const isNew =
                new Date(product.createdAt).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000;

              const hasDiscount =
                product.isDiscounted &&
                typeof product.productSalePrice === "number";

              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.productPrice - product.productSalePrice!) /
                      product.productPrice) *
                      100,
                  )
                : 0;

              return (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() =>
                    history.push(
                      `/products/${product._id}/${encodeURIComponent(
                        product.productName.replace(/\s+/g, "-"),
                      )}`,
                    )
                  }
                >
                  {/* Badge (priority: Discount > New) */}
                  {hasDiscount ? (
                    <div className="product-badge">-{discountPercent}%</div>
                  ) : (
                    isNew && <div className="product-badge new">New</div>
                  )}

                  {/* Image */}
                  <img
                    src={`${serverApi}/${product.productImages[0]}`}
                    alt={product.productName}
                  />

                  {/* Like Button */}
                  <IconButton
                    className="product-like"
                    onClick={(e) => toggleFavorite(e, product._id)}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: "#ef4444" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>

                  {/* Add to Cart Button */}
                  <button
                    className="product-add"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 18, mr: 1 }} />
                    Add to Cart
                  </button>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-title">{product.productName}</div>
                    <div className="product-price">
                      {hasDiscount ? (
                        <>
                          ₩{formatWon(product.productSalePrice!)}
                          <span className="product-price-original">
                            ₩{formatWon(product.productPrice)}
                          </span>
                        </>
                      ) : (
                        `₩${formatWon(product.productPrice)}`
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <Pagination
            page={productSearch.page}
            count={Math.max(
              1,
              Math.ceil(products.length / productSearch.limit),
            )}
            onChange={handlePageChange}
          />
        </Stack>
      </Stack>
    </div>
  );
}
