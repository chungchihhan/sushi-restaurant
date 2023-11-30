import React, { useState, ChangeEvent, useRef, useEffect } from "react";

const StoreEditPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [editableText, setEditableText] = useState<string>("");

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
        if (event.target) {
          setSelectedImage(event.target.result as string);
          setFileInputKey((prevKey) => prevKey + 1);
          localStorage.setItem("selectedImage", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditableText(e.target.value);
  };

  return (
    <div className="store-edit-page" style={{ height: "300vh", backgroundColor: "#D5FFF9", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "30px", opacity: "0.6" }}>
      {selectedImage && (
        <button
          onClick={handleClickImage}
          style={{
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "1485px",
            height: "300px",
            border: "none",
            cursor: "pointer",
            marginTop: "50px", // Move image up by 50px
          }}
        ></button>
      )}
      <label className="custom-file-upload" style={{ marginBottom: "20px", display: selectedImage ? "none" : "block" }}>
        <input
          key={fileInputKey}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        {!selectedImage && <span>Select Image</span>}
      </label>
    </div>
  );
};

export default StoreEditPage;
