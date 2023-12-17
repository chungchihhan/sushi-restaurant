import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getMeals } from "../../../utils/client";
import { SearchBar } from "../_components/SearchBar/index";
import { SearchButton } from "../_components/SearchButton/index";

interface Meal {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  active: boolean;
}

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState<string>("");
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const res: Meal[] = (await getMeals()).data;
      setMeals(res);
    };

    fetchMeals();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim() === "") {
      // Navigate to /meal if searchInput is empty
      navigate("/meal");
    } else {
      // Existing search functionality
      const filteredMeals = meals.filter(
        (meal) =>
          meal.active &&
          meal.name.toLowerCase().includes(searchInput.toLowerCase()),
      );
      // Navigate to /allmeals with search results
      navigate("/allmeals", { state: { filteredMeals } });
    }
  };

  return (
    <div className="search-section">
      <div className="searchcomponents">
        <SearchBar value={searchInput} onChange={handleSearchChange} />
      </div>
      <div className="searchcomponents">
        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
};

export default Search;
