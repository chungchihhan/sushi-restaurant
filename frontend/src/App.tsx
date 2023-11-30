import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginButton from "./components/Header/Login/LoginButton";
import MenuButton from "./components/Header/MenuButton";
import TsmcSushi from "./components/Header/TsmcSushi";
import BackgroundImage from "./components/ui/BackgroundImage";
import "./index.css";
import HomePage from "./pages/HomePage/HomePage";
import MenuFoodPage from "./pages/MenuFoodPage/MenuFoodPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import RecordPage from "./pages/RecordPage/RecordPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import UserPage from "./pages/UserPage/UserPage";
import CartPage from "./pages/CartPage/CartPage";
import ShopPage from "./pages/ShopPage/ShopPage";
import ShopEditPage from "./pages/ShopPage/ShopEditPage";
import RevenuePage from "./salePages/RevenuePage/RevenuePage";
import StockPage from "./salePages/StockPage/StockPage";

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
          <Route path="/shopedit" element= {<ShopEditPage/>} />
          <Route path="/revenue" element={<RevenuePage />} />
          <Route path="/stock" element={<StockPage />} />
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
};

export default Website;
