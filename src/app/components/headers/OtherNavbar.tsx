import {
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { Logout } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";
import { toastComingSoon } from "../../../lib/toastAlert";
import { useState } from "react";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
  anchorEl: HTMLElement | null;
}

const PAGE_TITLES: Record<string, string> = {
  "/help": "Help Center",
  "/products": "Shop",
  "/orders": "My Orders",
  "/member-page": "My Account",
};

export default function OtherNavbar(props: OtherNavbarProps) {
  const {
    cartItems,
    onAdd,
    onDelete,
    onDeleteAll,
    onRemove,
    setLoginOpen,
    setSignupOpen,
    anchorEl,
    handleLogoutClick,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  // ["", "products", "6977144f186ea4f43452b382", "Arden-Rug"]

  // last segment is the product name
  const lastSegment = pathSegments[pathSegments.length - 1];
  const productNameFromPath = lastSegment
    ? decodeURIComponent(lastSegment).replace(/-/g, " ")
    : null;

  const pageTitle =
    // if on a chosen product page: /products/:id/:name
    pathSegments[1] === "products" && pathSegments.length > 2
      ? productNameFromPath
      : // if on the shop page: /products
        pathSegments[1] === "products"
        ? "Shop"
        : // any other static page
          (PAGE_TITLES[location.pathname] ??
          location.pathname
            .split("/")
            .filter(Boolean)
            .map((s) => s.replace(/-/g, " "))
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" "));

  const { authMember } = useGlobals();

  const history = useHistory();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    history.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="other-layout">
      {/* ================= NAVBAR ================= */}
      <Container maxWidth="lg">
        <nav className="navbar">
          <NavLink to="/" className="logo">
            <img src="/icons/comfyZone-logo.svg" alt="logo" />
            <span>ComfyZone</span>
          </NavLink>

          <ul className="nav-menu">
            <li>
              <NavLink exact to="/" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" activeClassName="active">
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" activeClassName="active">
                Shop
              </NavLink>
            </li>
            {authMember && (
              <li>
                <NavLink to="/orders" activeClassName="active">
                  Orders
                </NavLink>
              </li>
            )}
            {authMember && (
              <li>
                <NavLink to="/member-page" activeClassName="active">
                  My Page
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/help" activeClassName="active">
                Help
              </NavLink>
            </li>
          </ul>

          <div className="nav-actions">
            <div className="navbar-search">
              <OutlinedInput
                className="navbar-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search furniture"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
            </div>
            {!authMember ? (
              <>
                <PersonOffIcon onClick={() => setLoginOpen(true)} />
                <FavoriteIcon onClick={() => toastComingSoon("Coming soon!")} />
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              </>
            ) : (
              <>
                <FavoriteIcon onClick={() => toastComingSoon("Coming soon!")} />
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
                <img
                  className="avatar"
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  onClick={handleLogoutClick}
                  alt="user"
                />
              </>
            )}
          </div>
        </nav>
      </Container>

      {/* ================= LOGOUT MENU ================= */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseLogout}
      >
        <MenuItem onClick={handleLogoutRequest}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* ===== HERO SECTION ===== */}
      <section className="page-hero">
        <img
          className="page-hero__bg"
          src="/img/banner-other.jpg"
          alt={pageTitle ?? ""}
        />

        <Container maxWidth="lg">
          <Stack spacing={1} className="page-hero__content">
            <h1 className="page-hero__title">{pageTitle}</h1>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              className="breadcrumb"
            >
              <NavLink to="/">Home</NavLink>
              <ChevronRightIcon fontSize="small" />
              {pathSegments[1] === "products" ? (
                pathSegments.length > 2 ? (
                  <>
                    <NavLink to="/products">Shop</NavLink>
                    <ChevronRightIcon fontSize="small" />
                    <span>{productNameFromPath}</span>
                  </>
                ) : (
                  <span>Shop</span>
                )
              ) : (
                <span>{pageTitle}</span>
              )}
            </Stack>
          </Stack>
        </Container>
      </section>
    </header>
  );
}
