import { Link } from "react-router-dom";

import React from "react";
import { useState, useEffect } from "react";

import Navbar from "../../../HomePage/_components/Navbar";
import { v4 as uuidv4 } from "uuid";

// import Search from './Search';
import MealCategoryItem from "./_components/MealCategoryItem";

import { getShopsCategory } from "../../../../utils/client";

import category from "@lib/category.json";
import { CategoryList } from "@lib/shared_types";

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
        console.log("Error fetching meal categories", error);
      }
    };

    fetchCategory();
  }, [])

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

