import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Container, Rating, Button, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { createSelector, Dispatch } from "@reduxjs/toolkit";
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
  const history = useHistory();
  const navigate = (path: string) => history.push(path);
  const { setChosenProduct, setProvider } = actionDispatch(useDispatch());

  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { provider } = useSelector(providerRetriever);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews">(
    "info",
  );
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const firstVisit = useRef(true);

  useEffect(() => {
    const productService = new ProductService();
    const providerService = new ProviderService();

    productService.getProduct(productId).then((product) => {
      setChosenProduct(product);
      if (product.productProvider) {
        providerService.getProvider(product.productProvider).then(setProvider);
      }
    });

    if (!firstVisit.current) {
      window.scrollTo({ top: 410, behavior: "smooth" });
    } else {
      firstVisit.current = false;
    }
  }, [productId]);

  useEffect(() => {
    if (!chosenProduct) return;

    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
        productCategory: chosenProduct.productCategory,
      })
      .then((res) => {
        const filtered = res.filter((r: any) => r._id !== chosenProduct._id);
        setRelatedProducts(filtered.slice(0, 4));
      })
      .catch(() => setRelatedProducts([]));
  }, [chosenProduct]);

  if (!chosenProduct) return null;

  const inc = () => setQty((v) => v + 1);
  const dec = () => setQty((v) => Math.max(1, v - 1));

  const isDiscounted =
    chosenProduct.isDiscounted &&
    typeof chosenProduct.productSalePrice === "number";

  const discountPercent = isDiscounted
    ? Math.round(
        ((chosenProduct.productPrice - chosenProduct.productSalePrice!) /
          chosenProduct.productPrice) *
          100,
      )
    : 0;

  const formatWon = (value: number) => value.toLocaleString("ko-KR");

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    onAdd({
      _id: product._id,
      name: product.productName,
      price: product.isDiscounted
        ? product.productSalePrice
        : product.productPrice,
      quantity: 1,
      image: product.productImages[0],
    });
  };

  return (
    <div className="chosen-product">
      <Container maxWidth="lg">
        {/* ===== MAIN SECTION ===== */}
        <div className="chosen-layout">
          {/* LEFT – IMAGES */}
          <div className="chosen-gallery-wrap">
            <div className="chosen-thumbs">
              {chosenProduct.productImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  className={`thumb ${idx === selectedIndex ? "active" : ""}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <img src={`${serverApi}/${img}`} alt="thumb" />
                </button>
              ))}
            </div>

            <div className="chosen-main-image">
              {isDiscounted && (
                <span className="discount-badge">-{discountPercent}%</span>
              )}
              <img
                src={`${serverApi}/${chosenProduct.productImages[selectedIndex]}`}
                alt={chosenProduct.productName}
              />
            </div>
          </div>

          {/* RIGHT – INFO */}
          <div className="chosen-info">
            <h1 className="product-title">{chosenProduct.productName}</h1>

            <div className="rating-row">
              <Rating
                value={chosenProduct.productRating ?? 0}
                readOnly
                precision={0.5}
              />
              <span className="review-count">
                ({chosenProduct.productTotalReviews ?? 0} reviews)
              </span>
              <div className="views">
                <RemoveRedEyeIcon fontSize="small" />
                <span>{chosenProduct.productViews}</span>
              </div>
            </div>

            <div className="price-row">
              {isDiscounted ? (
                <>
                  <span className="sale-price">
                    ₩{chosenProduct.productSalePrice!.toLocaleString("ko-KR")}
                  </span>
                  <span className="original-price">
                    ₩{chosenProduct.productPrice.toLocaleString("ko-KR")}
                  </span>
                </>
              ) : (
                <span className="regular-price">
                  ₩{chosenProduct.productPrice.toLocaleString("ko-KR")}
                </span>
              )}
            </div>

            <p className="short-desc">
              {chosenProduct.productDesc || "No description available."}
            </p>

            <div className="meta-block">
              <div>
                <strong>Type:</strong> {chosenProduct.productType}
              </div>
              <div className="color-row">
                <strong>Color:</strong>
                <span
                  className="color-dot"
                  style={{ background: chosenProduct.productColor }}
                />
              </div>
            </div>

            <div className="actions">
              <div className="qty-selector">
                <button onClick={dec}>
                  <RemoveIcon />
                </button>
                <span>{qty}</span>
                <button onClick={inc}>
                  <AddIcon />
                </button>
              </div>

              <Button
                className="add-to-cart-btn"
                onClick={() =>
                  onAdd({
                    _id: chosenProduct._id,
                    name: chosenProduct.productName,
                    price: isDiscounted
                      ? chosenProduct.productSalePrice!
                      : chosenProduct.productPrice,
                    quantity: qty,
                    image: chosenProduct.productImages[0],
                  })
                }
                startIcon={<ShoppingCartIcon />}
              >
                Add to Cart
              </Button>
            </div>

            {provider && (
              <div className="provider-box">
                <img
                  src={`${serverApi}/${provider.providerLogo}`}
                  alt={provider.providerName}
                />
                <div className="provider-row">
                  <strong>{provider.providerName}</strong>
                  <Rating
                    value={provider.providerRating || 0}
                    readOnly
                    size="small"
                    className="stars-rating"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="chosen-tabs">
          {["desc", "info", "reviews"].map((t) => (
            <button
              key={t}
              className={`tab ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t as any)}
            >
              {t === "desc" && "Description"}
              {t === "info" && "Additional Info"}
              {t === "reviews" &&
                `Reviews (${chosenProduct.productTotalReviews ?? 0})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "desc" && (
            <p className="tab-text">
              {chosenProduct.productDesc || "No description available."}
            </p>
          )}

          {activeTab === "info" && (
            <table className="tab-info-table">
              <tbody>
                <tr>
                  <td className="label">Material</td>
                  <td className="value">
                    {chosenProduct.productMaterial ?? "—"}
                  </td>
                </tr>
                <tr>
                  <td className="label">Type</td>
                  <td className="value">{chosenProduct.productType}</td>
                </tr>
                <tr>
                  <td className="label">Color</td>
                  <td className="value">{chosenProduct.productColor}</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === "reviews" && (
            <div className="tab-reviews">No detailed reviews available.</div>
          )}
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        <div className="related-section">
          <h3>Related Products</h3>
          <div className="related-list">
            {relatedProducts.map((product) => {
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
                  className="related-card"
                  onClick={() =>
                    navigate(
                      `/products/${product._id}/${encodeURIComponent(
                        product.productName.replace(/\s+/g, "-"),
                      )}`,
                    )
                  }
                >
                  <IconButton
                    className="related-like"
                    onClick={(e) => toggleFavorite(e, product._id)}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: "#ef4444" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>

                  {hasDiscount ? (
                    <div className="related-badge">-{discountPercent}%</div>
                  ) : (
                    isNew && <div className="related-badge new">New</div>
                  )}

                  <img
                    src={`${serverApi}/${product.productImages[0]}`}
                    alt={product.productName}
                  />

                  <button
                    className="related-add"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 18, mr: 1 }} /> Add to
                    Cart
                  </button>

                  <div className="related-info">
                    <div className="related-title">{product.productName}</div>
                    <div className="related-price">
                      {hasDiscount ? (
                        <>
                          ₩{formatWon(product.productSalePrice!)}
                          <span className="related-price-original">
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
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
