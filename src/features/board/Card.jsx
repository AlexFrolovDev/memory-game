import React from "react";
import "./Card.scss";

const Card = ({ image, show, showHint, onClick, index }) => {
  const style = {
    backgroundImage: `url(./assets/${image})`,
  };
  return (
    <div className="card-wrapper" onClick={() => onClick(index)}>
      <div
        className={`card-content ${show ? "show" : ""}${
          showHint ? " hint" : ""
        }`}
        style={style}
      ></div>
    </div>
  );
};

export default Card;
