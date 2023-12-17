import React, { useState } from "react";

interface MealDetailProps {
  mealId: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  onUpdate: (data: {
    price: number;
    quantity: number;
    description: string;
  }) => void;
  onDelete: (mealId: string) => void;
}

export default function MealDetail({
  image,
  name,
  price,
  mealId,
  quantity,
  description,
  onUpdate,
  onDelete,
}: MealDetailProps) {
  const [editable, setEditable] = useState({
    price: false,
    quantity: false,
    description: false,
  });
  const [editValues, setEditValues] = useState({
    price,
    quantity,
    description,
  });

  const handleDoubleClick = (field: keyof typeof editable) => {
    setEditable({ ...editable, [field]: true });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof editable) => {
    setEditable({ ...editable, [field]: false });
    onUpdate(editValues);
  };

  return (
    <div className="flex flex-col justify-between rounded-lg bg-white p-4 shadow-lg">
      <img
        className="mb-4 h-48 w-full rounded-lg object-cover"
        src={image}
        alt={name}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold pb-2">{name}</h3>
        <div className="flex items-center text-lg" onDoubleClick={() => handleDoubleClick("description")}>
          <p>描述：</p>
          {editable.description ? (
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              className="textarea w-full"
            />
          ) : (
            <p>{editValues.description}</p>
          )}
        </div>
        <div className="flex items-center text-lg" onDoubleClick={() => handleDoubleClick("price")}>
          <p>價格：</p>
          {editable.price ? (
            <input
              type="number"
              name="price"
              value={editValues.price}
              onChange={handleChange}
              onBlur={() => handleBlur("price")}
              className="input"
            />
          ) : (
            <p>{editValues.price}</p>
          )}
        </div>
        <div className="flex items-center text-lg" onDoubleClick={() => handleDoubleClick("quantity")}>
          <p>數量：</p>
          {editable.quantity ? (
            <input
              type="number"
              name="quantity"
              value={editValues.quantity}
              onChange={handleChange}
              onBlur={() => handleBlur("quantity")}
              className="input"
            />
          ) : (
            <p>{editValues.quantity}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(mealId)}
        className="rounded-full bg-red-500 px-2 py-1 mt-2 font-bold text-white hover:bg-red-700"
      >
        移除餐點
      </button>
    </div>
  );
}
