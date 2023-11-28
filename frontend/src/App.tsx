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
import AboutPage from "./pages/MenuPage/MenuPage";
import SessionsPage from "./pages/MenuPage/MenuPage";
import RecordPage from "./pages/RecordPage/RecordPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import UserPage from "./pages/UserPage/UserPage";
import CartPage from "./pages/CartPage/CartPage";
import StockPage from"./salePages/StockPage/StockPage";
import RevenuePage from"./salePages/RevenuePage/RevenuePage";

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
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menufood" element={<MenuFoodPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/revenue" element={<RevenuePage />} />
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
};

export default Website;
