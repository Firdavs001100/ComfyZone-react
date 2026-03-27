import React, { useEffect, useRef, useState } from "react";
import {
  Stack,
  Typography,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  Slider,
  Pagination,
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
  const typeFromUrl = queryParams.get("type") as ProductType | null;
  const minFromUrl = Number(queryParams.get("minPrice") ?? 0);
  const maxFromUrl = Number(queryParams.get("maxPrice") ?? 5_000_000);

  /* ================= SEARCH STATE ================= */

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 12,
    order: "createdAt",
    search: searchFromUrl || undefined,
    productCategory: categoryFromUrl ?? undefined,
  });

  useEffect(() => {
    setSelectedCategories(categoryFromUrl ? [categoryFromUrl] : []);
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

  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("New");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortSelect = (label: string, order: string) => {
    setSelectedSort(label);
    setSortOpen(false);
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order,
    }));
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
    const next = selectedCategories.includes(category) ? [] : [category];
    setSelectedCategories(next);

    // ✅ keep URL in sync
    const params = new URLSearchParams(location.search);
    if (next.length) params.set("category", next[0]);
    else params.delete("category");
    history.replace({ search: params.toString() });
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
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>(
    typeFromUrl ? [typeFromUrl] : [],
  );

  const visibleTypes = typesExpanded ? ALL_TYPES : ALL_TYPES.slice(0, 5);

  useEffect(() => {
    setSelectedTypes(typeFromUrl ? [typeFromUrl] : []);
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      productType: typeFromUrl ?? undefined,
    }));
  }, [typeFromUrl]);

  const toggleType = (type: ProductType) => {
    const next = selectedTypes.includes(type) ? [] : [type];
    setSelectedTypes(next);

    const params = new URLSearchParams(location.search);
    if (next.length) params.set("type", next[0]);
    else params.delete("type");
    history.replace({ search: params.toString() });
  };

  /* ================= PRICE FILTER ================= */

  const [price, setPrice] = useState<number[]>([minFromUrl, maxFromUrl]);

  useEffect(() => {
    setPrice([minFromUrl, maxFromUrl]);
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      minPrice: minFromUrl,
      maxPrice: maxFromUrl,
    }));
  }, [minFromUrl, maxFromUrl]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setPrice(newValue as number[]);
  };

  const pushPriceToUrl = (next: number[]) => {
    const params = new URLSearchParams(location.search);
    if (next[0] !== 0) params.set("minPrice", String(next[0]));
    else params.delete("minPrice");
    if (next[1] !== 5_000_000) params.set("maxPrice", String(next[1]));
    else params.delete("maxPrice");
    history.replace({ search: params.toString() });
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
    }));
  }, [value, searchFromUrl]);

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

        <div className={`sort-wrapper ${sortOpen ? "open" : ""}`} ref={sortRef}>
          <button
            className="sort-button"
            onClick={() => setSortOpen((p) => !p)}
          >
            <span>{selectedSort}</span>
            <KeyboardArrowDownRoundedIcon className="sort-arrow" />
          </button>

          <div className="sort-dropdown">
            {[
              { label: "New", order: "createdAt" },
              { label: "Popular", order: "views" },
              { label: "Price ↑", order: "priceAsc" },
              { label: "Price ↓", order: "priceDesc" },
            ].map(({ label, order }) => (
              <div
                key={label}
                className={`sort-option ${selectedSort === label ? "active" : ""}`}
                onClick={() => {
                  handleSortSelect(label, order);
                  setSortOpen(false);
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
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
                onChangeCommitted={(_e, newValue) =>
                  pushPriceToUrl(newValue as number[])
                }
                valueLabelDisplay="on"
                valueLabelFormat={(v) => `₩${formatWon(v)}`}
              />

              <Stack direction="row" className="price-inputs">
                <input
                  type="text"
                  value={formatWon(price[0])}
                  onChange={(e) => handleMinChange(parseWon(e.target.value))}
                  onBlur={() => pushPriceToUrl(price)}
                  onKeyDown={(e) => e.key === "Enter" && pushPriceToUrl(price)}
                  className="price-box"
                />
                <span className="price-separator">–</span>
                <input
                  type="text"
                  value={formatWon(price[1])}
                  onChange={(e) => handleMaxChange(parseWon(e.target.value))}
                  onBlur={() => pushPriceToUrl(price)}
                  onKeyDown={(e) => e.key === "Enter" && pushPriceToUrl(price)}
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
