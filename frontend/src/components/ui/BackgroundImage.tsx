import React from "react";

const BackgroundImage: React.FC = () => {
  const imageUrl = process.env.PUBLIC_URL + "/output-onlinepngtools.png"; // adjust the image name accordingly

  return (
    <div
      style={{
        position: "fixed", // Changed from absolute to fixed
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // ensures the background is behind all other content
        backgroundColor: "rgba(34, 111, 154, 0.8)",
      }}
    >
      <img
        src={imageUrl}
        alt="Background Image"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.1,
        }}
      />
    </div>
  );
};

export default BackgroundImage;
