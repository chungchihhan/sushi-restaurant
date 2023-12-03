import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginButton from "./components/Header/Login/LoginButton";
import MenuButton from "./components/Header/MenuButton";
import TsmcSushi from "./components/Header/TsmcSushi";
import BackgroundImage from "./components/ui/BackgroundImage";
import "./index.css";
import AboutPage from "./pages/AboutPage/AboutPage";
import CartPage from "./pages/BuyPage/CartPage/CartPage";
import MealCategoryPage from "./pages/BuyPage/MealPage/MealCategoryPage/MealCategoryPage";
import MealShoplistPage from "./pages/BuyPage/MealPage/MealShopListPage/MealShopListPage";
import HomePage from "./pages/HomePage/HomePage";
import RecordPage from "./pages/RecordPage/RecordPage";
import RevenuePage from "./pages/SellPage/SalePage/RevenuePage/RevenuePage";
import StockPage from "./pages/SellPage/SalePage/StockPage/StockPage";
import ShopEditPage from "./pages/SellPage/ShopPage/ShopEditPage";
import ShopPage from "./pages/SellPage/ShopPage/ShopPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import SignInPage from "./pages/UserPage/SignInPage/SignInPage";
import SignUpPage from "./pages/UserPage/SignUpPage/SignUpPage";
import UserPage from "./pages/UserPage/UserPage";

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
          <Route path="/user" element={<UserPage />} />
          <Route path="/meal" element={<MealCategoryPage />} />
          <Route path="/meal/category/:category" element={<MealShoplistPage />} />
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
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
};

export default Website;
