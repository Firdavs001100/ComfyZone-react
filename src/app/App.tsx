import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage/index";
import UserPage from "./screens/userPage";
import OrdersPage from "./screens/ordersPage/index";
import HelpPage from "./screens/helpPage";
import HomeNavbar from "./components/headers/HomeNavbar";
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { toastError, toastSmallSuccess } from "../lib/toastAlert";
import { Messages } from "../lib/config";
import MemberService from "../services/MemberService";
import { useGlobals } from "./hooks/useGlobals";
import { Toaster } from "react-hot-toast";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";
import AboutPage from "./screens/aboutPage";

function App() {
  const location = useLocation();
  const { authMember, setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // HANDLERS

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => setAnchorEl(null);
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout();
      await toastSmallSuccess("success", 700);

      // Clear auth
      setAuthMember(null);

      handleCloseLogout();
    } catch (err) {
      console.log(err);
      toastError(Messages.error1);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px", borderRadius: "8px", padding: "12px" },
        }}
      />
      {location.pathname == "/" ? (
        <HomeNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      ) : (
        <OtherNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      )}
      <Switch>
        <Route path="/products">
          <ProductsPage onAdd={onAdd} />
        </Route>
        <Route path="/member-page">
          <UserPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/help">
          <HelpPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer />
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </>
  );
}

export default App;
