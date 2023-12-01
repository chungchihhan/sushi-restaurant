import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginButton from "./components/Header/Login/LoginButton";
import MenuButton from "./components/Header/MenuButton";
import TsmcSushi from "./components/Header/TsmcSushi";
import BackgroundImage from "./components/ui/BackgroundImage";
import "./index.css";
import AboutPage from "./pages/AboutPage/AboutPage";
import CartPage from "./pages/CartPage/CartPage";
import HomePage from "./pages/HomePage/HomePage";
import MenuFoodPage from "./pages/MenuFoodPage/MenuFoodPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import RecordPage from "./pages/RecordPage/RecordPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import ShopEditPage from "./pages/ShopPage/ShopEditPage";
import ShopPage from "./pages/ShopPage/ShopPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import UserPage from "./pages/UserPage/UserPage";
import RevenuePage from "./salePages/RevenuePage/RevenuePage";
import StockPage from "./salePages/StockPage/StockPage";
import StoreEditPage from "./salePages/StoreEditPage/StoreEditPage";

const Website: React.FC = () => {
  return (
    <>
      <Router>
        <div className="website">
          <BackgroundImage />
        </div>
        <div className="header">
          <TsmcSushi />
          <div className="loginandsushi">
            <LoginButton />
            <MenuButton />
          </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/menu/:userId" element={<MenuPage />} />
          <Route path="/menufood/:userId" element={<MenuFoodPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shopedit" element={<ShopEditPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/edit" element={<StoreEditPage />} />
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
};

export default Website;
