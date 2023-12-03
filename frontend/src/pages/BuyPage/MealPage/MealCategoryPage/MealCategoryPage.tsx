import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { getShopsCategory } from "../../../../utils/client";
import Navbar from "../../../HomePage/_components/Navbar";
import type { CategoryList } from "@lib/shared_types";

import MealCategoryItem from "./_components/MealCategoryItem";

type MealCategoryItemProps = {
  category: CategoryList;
  totalSum: number;
};

export default function MealCategoryPage() {
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

    fetchCategory();
  }, []);

  return (
    <div className="blue-square-container">
      <div className="blue-square-menu">
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
