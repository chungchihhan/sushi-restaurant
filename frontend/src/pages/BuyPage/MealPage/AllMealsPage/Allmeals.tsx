import React from "react";
import { useLocation } from "react-router-dom";

// Meal interface definition
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

const AllMeals = () => {
  const location = useLocation();
  const { filteredMeals } = (location.state as { filteredMeals: Meal[] }) || {};

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render all meals */}
        {filteredMeals && filteredMeals.map((meal: Meal) => (
          <div key={meal.id} className="border rounded-lg overflow-hidden shadow-lg">
            <img src={meal.image} alt={meal.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{meal.name}</h3>
              <p className="text-gray-700 text-sm mb-2">{meal.description}</p>
              <p className="text-gray-600 text-sm">Price: ${meal.price}</p>
              <p className="text-gray-600 text-sm">Quantity: {meal.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMeals;
