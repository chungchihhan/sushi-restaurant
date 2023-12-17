import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getShopsByCategory } from "../../../../utils/client";
import Navbar from "../../../HomePage/_components/Navbar";

import MealShopListItem from "./_components/MealShopListItem";

type MealShopListItemProps = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  category: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

const categoryToKey: { [key: string]: string } = {
  中式: "Chinese",
  美式: "American",
  日式: "Japanese",
  韓式: "Korean",
  港式: "HongKong",
  飲料: "Beverage",
};

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

export default function MealShopListPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [shopList, setShopList] = useState<MealShopListItemProps[]>([]);

  useEffect(() => {
    const fetchShopList = async () => {
      try {
        if (!category) return;
        const res = await getShopsByCategory(categoryToKey[category]);
        setShopList(res.data);
      } catch (error) {
        toast.error("Error fetching shop list");
      }
    };

    if (isAuthenticated) {
      fetchShopList();
    } else {
      navigate("/signin");
    }
  }, [category, navigate]);

  return (
    <div className="blue-square-container">
      <div className="blue-square-menu rounded-2xl">
        <Navbar />
        <section className="food-types-container">
          {shopList.map((shop) => (
            <MealShopListItem
              key={shop.id}
              id={shop.id}
              img={shop.image}
              title={shop.name}
              star="✩3.5/5"
            />
          ))}
        </section>
      </div>
    </div>
  );
}
