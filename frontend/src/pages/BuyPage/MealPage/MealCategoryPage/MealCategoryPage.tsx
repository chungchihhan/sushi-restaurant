import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getShopsCategory } from "../../../../utils/client";
import Navbar from "../../../HomePage/_components/Navbar";
import type { CategoryList } from "@lib/shared_types";

import MealCategoryItem from "./_components/MealCategoryItem";

type MealCategoryItemProps = {
  category: CategoryList;
  totalSum: number;
};

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

export default function MealCategoryPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<MealCategoryItemProps[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getShopsCategory();
        setCategory(res.data);
      } catch (error) {
        toast.error("Error fetching meal categories");
      }
    };

    if (isAuthenticated) {
      fetchCategory();
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <div className="blue-square-container">
      <div className="blue-square-menu rounded-2xl">
        <Navbar />
        <div className="food-types-container">
          {category.map((category) => (
            <MealCategoryItem
              key={category.category}
              category={category.category}
              totalSum={category.totalSum}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
