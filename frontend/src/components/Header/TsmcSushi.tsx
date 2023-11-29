import React from "react";
import { Link } from "react-router-dom";

const TsmcSushi: React.FC = () => {
  return (
    <div className="tsmcsushi">
      <Link to="/">
        <img src="/tsmcsushi.png" alt="" />
      </Link>
    </div>
  );
};

export default TsmcSushi;
