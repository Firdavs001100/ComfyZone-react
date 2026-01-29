import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavLink } from "react-router-dom";
import Basket from "./Basket";

import { CartItem } from "../../../lib/data/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { Logout } from "@mui/icons-material";
import { serverApi } from "../../../lib/config";

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

  return (
    <div className="home-navbar">
      <Container
        sx={{ mt: "55px", height: "642px" }}
        className="navbar-container"
      >
        {/* Navigation */}
        <Stack className="navbar">
          <Box className="brand">
            <NavLink to={"/"}>
              <img className="brand-logo" src="/icons/comfyZone-logo.svg" />
              <span className="brand-name">Furniro</span>
            </NavLink>
          </Box>
          <Stack className="nav-links">
            <Box className={"hover-line"}>
              <NavLink
                to="/"
                activeClassName={"underline"}
                className="hover-line"
              >
                Home
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink
                to="/products"
                activeClassName={"underline"}
                className="hover-line"
              >
                Shop
              </NavLink>
            </Box>
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink
                  to="/orders"
                  activeClassName={"underline"}
                  className="hover-line"
                >
                  Orders
                </NavLink>
              </Box>
            ) : null}
            {authMember ? (
              <Box className={"hover-line"}>
                <NavLink
                  to="/member-page"
                  activeClassName={"underline"}
                  className="hover-line"
                >
                  My Page
                </NavLink>
              </Box>
            ) : null}
            {!authMember ? (
              <Box className={"hover-line"}>
                <NavLink
                  to="/about"
                  activeClassName={"underline"}
                  className="hover-line"
                >
                  About
                </NavLink>
              </Box>
            ) : null}
            <Box className={"hover-line"}>
              <NavLink
                to="/help"
                activeClassName={"underline"}
                className="hover-line"
              >
                Help
              </NavLink>
            </Box>
          </Stack>
        </Stack>
        <Stack className="nav-icons">
          {!authMember ? (
            <>
              <PersonIcon
                className="nav-icon"
                fontSize="medium" // MUI uses fontSize prop instead of size
                onClick={() => setLoginOpen(true)}
              />
              <SearchIcon className="nav-icon" fontSize="medium" />
              <FavoriteIcon className="nav-icon" fontSize="medium" />
              <div
                className="nav-icon"
                style={{ position: "relative", display: "inline-block" }}
              >
                <ShoppingCartIcon fontSize="medium" />
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              </div>
            </>
          ) : (
            <>
              <SearchIcon className="nav-icon" fontSize="medium" />
              <FavoriteIcon className="nav-icon" fontSize="medium" />
              <ShoppingCartIcon className="nav-icon" fontSize="medium" />
              <img
                className="user-avatar"
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                }
                aria-haspopup="true"
                onClick={handleLogoutClick}
                alt="User"
              />
            </>
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleCloseLogout}
            onClick={handleCloseLogout}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogoutRequest}>
              <ListItemIcon>
                <Logout fontSize="small" style={{ color: "blue" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>

        {/* Hero Section */}
        <Stack className="hero-section">
          <Box className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1759803557159-f48be1dcb43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGZ1cm5pdHVyZSUyMGNoYWlyJTIwcGxhbnR8ZW58MXx8fHwxNzY5NjU4MDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Furniture"
            />
          </Box>
          <Box className="hero-content">
            <Box className="hero-card">
              <p className="hero-subtitle">New Arrival</p>
              <h1 className="hero-title">
                Discover Our
                <br />
                New Collection
              </h1>
              <p className="hero-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis.
              </p>
              {!authMember ? (
                <Button
                  variant="contained"
                  className="hero-button"
                  onClick={() => setSignupOpen?.(true)}
                >
                  BUY NOW
                </Button>
              ) : (
                <button className="hero-button">BUY NOW</button>
              )}
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
