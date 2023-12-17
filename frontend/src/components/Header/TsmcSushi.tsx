import React from "react";
import { Link } from "react-router-dom";

const TsmcSushi: React.FC = () => {
  return (
    <div className="tsmcsushi p-4">
      <Link to="/">
        <img src="/tsmcsushi.png" alt="" />
      </Link>
    </div>
  );
};

export default TsmcSushi;
