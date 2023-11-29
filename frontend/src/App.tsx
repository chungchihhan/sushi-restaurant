import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginButton from "./components/Header/Login/LoginButton";
import MenuButton from "./components/Header/MenuButton";
import TsmcSushi from "./components/Header/TsmcSushi";
import BackgroundImage from "./components/ui/BackgroundImage";
import "./index.css";
import HomePage from "./pages/HomePage/HomePage";
import ShopCategory from "./pages/ShopPage/ShopCategoryPage/ShopCategoryPage";
import ShopListPage from "./pages/ShopPage/ShopListPage/ShopListPage";
import ShopDetailPage from "./pages/ShopPage/ShopDetailPage/ShopDetailPage";
import ShopMealDialog from "./pages/ShopPage/ShopMealDialog/ShopMealDialog";
import AboutPage from "./pages/ShopPage/ShopCategoryPage/ShopCategoryPage";
import SessionsPage from "./pages/ShopPage/ShopCategoryPage/ShopCategoryPage";
import RecordPage from "./pages/RecordPage/RecordPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import UserPage from "./pages/UserPage/UserPage";
import CartPage from "./pages/CartPage/CartPage";

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
          <Route path="/shop/" element={<ShopCategory />} />
          <Route path="/shop/category/:category" element={<ShopListPage/>}/>
          <Route path="/shop/:id" element={<ShopDetailPage/>}/>
          <Route path="/shop/:id/:mealid" element={<ShopMealDialog/>}/>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default Website;
