import {
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { NavLink, useHistory } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { Logout } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";
import { toastComingSoon } from "../../../lib/toastAlert";
import { useState } from "react";

interface HomeNavbarProps {
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

export default function HomeNavbar(props: HomeNavbarProps) {
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

  const { authMember } = useGlobals();

  const history = useHistory();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    history.push(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="home-layout">
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

      {/* ================= HERO ================= */}
      <section className="hero">
        <img className="hero-bg" src="/img/banner-main.jpg" alt="hero" />

        <div className="hero-card">
          <span className="badge">New Arrival</span>
          <h1>
            Discover Our
            <br />
            New Collection
          </h1>
          <p>
            Explore our latest furniture collection designed for comfort, style,
            and functionality. From living room sofas to elegant dining sets,
            find pieces that transform your home into a cozy, modern space.
          </p>

          <Button
            className="cta"
            onClick={() => window.location.assign("/products")}
          >
            BUY NOW
          </Button>
        </div>
      </section>
    </header>
  );
}
