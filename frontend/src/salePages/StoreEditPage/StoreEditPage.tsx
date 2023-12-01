import React, { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";

const StoreEditPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImage");
    if (storedImage) {
      setSelectedImage(storedImage);
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        setFileInputKey((prevKey) => prevKey + 1);
        localStorage.setItem("selectedImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="store-edit-page">
      {selectedImage && (
        <button
          onClick={handleClickImage}
          className="image-preview"
          style={{ backgroundImage: `url(${selectedImage})` }}
        ></button>
      )}
      <label className={`custom-file-upload ${selectedImage ? "hidden" : ""}`}>
        <input
          key={fileInputKey}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
        />
        {!selectedImage && <span>Select Image</span>}
      </label>
    </div>
  );
};

export default StoreEditPage;
