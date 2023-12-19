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
    <div className="flex flex-row rounded-lg bg-white p-4 shadow-lg">
      <img
        className=" h-48 w-48 self-center rounded-lg object-cover"
        src={image}
        alt={name}
      />
      <div className="mx-4 mt-2 flex flex-col justify-start gap-2">
        <h3 className="w-36 overflow-hidden text-ellipsis whitespace-nowrap pb-2 text-2xl font-semibold">
          {name}
        </h3>

        <div
          className="flex items-center text-lg"
          onDoubleClick={() => handleDoubleClick("price")}
        >
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
        <div
          className="flex items-center text-lg"
          onDoubleClick={() => handleDoubleClick("quantity")}
        >
          <p>數量：</p>
          {editable.quantity ? (
            <input
              type="number"
              name="quantity"
              value={editValues.quantity}
              onChange={handleChange}
              onBlur={() => handleBlur("quantity")}
              className="input max-w-full"
            />
          ) : (
            <p>{editValues.quantity}</p>
          )}
        </div>
        <div
          className="flex items-center text-lg"
          onDoubleClick={() => handleDoubleClick("description")}
        >
          <p className="whitespace-nowrap">描述：</p>
          {editable.description ? (
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleChange}
              onBlur={() => handleBlur("description")}
              className="textarea max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
            />
          ) : (
            <p className="w-36 overflow-hidden text-ellipsis whitespace-nowrap">
              {editValues.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(mealId)}
        className="mt-40 grow rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        移除餐點
      </button>
    </div>
  );
}
