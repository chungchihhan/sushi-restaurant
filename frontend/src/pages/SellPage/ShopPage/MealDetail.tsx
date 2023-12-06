import React, { useState } from 'react';

interface MealDetailProps {
  mealId:string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  onUpdate: (data: { price: number; quantity: number; description: string }) => void;
  onDelete: (mealId: string) => void;
}

export default function MealDetail({ image, name, price,mealId, quantity, category, description, onUpdate ,onDelete}: MealDetailProps) {
  const [editable, setEditable] = useState({ price: false, quantity: false, description: false });
  const [editValues, setEditValues] = useState({ price, quantity, description });

  const handleDoubleClick = (field: keyof typeof editable) => {
    setEditable({ ...editable, [field]: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: keyof typeof editable) => {
    setEditable({ ...editable, [field]: false });
    onUpdate(editValues);
  };

  return (
    <>
      <div className="flex bg-white rounded-2xl h-64 w-auto justify-between">
        <div className="flex flex-col space-between justify-between p-5">
          <h3>{name}</h3>           
          <div onDoubleClick={() => handleDoubleClick('description')}>
            {editable.description ? (
              <textarea
                name="description"
                value={editValues.description}
                onChange={handleChange}
                onBlur={() => handleBlur('description')}
                className="textarea"
              />
            ) : (
              <p>描述：{editValues.description}</p>
            )}
          </div>
          <div onDoubleClick={() => handleDoubleClick('price')}>
            {editable.price ? (
              <input
                type="number"
                name="price"
                value={editValues.price}
                onChange={handleChange}
                onBlur={() => handleBlur('price')}
                className="input"
              />
            ) : (
              <p>價格：{editValues.price}</p>
            )}
          </div>
          <div onDoubleClick={() => handleDoubleClick('quantity')}>
            {editable.quantity ? (
              <input
                type="number"
                name="quantity"
                value={editValues.quantity}
                onChange={handleChange}
                onBlur={() => handleBlur('quantity')}
                className="input"
              />
            ) : (
              <p>數量：{editValues.quantity}</p>
            )}
          </div>
        </div>
        <div className="flex">
          <img src={image} alt={name} className="object-contain rounded-3xl" />
        <button 
              onClick={() => onDelete(mealId)} 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full"
          >
          X
        </button>
        </div>
      </div>
    </>
  );
}
