import React from "react";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="block timer">
          <h3>Time</h3>
          <div className="timer-wrapper">
            <span>00</span>
            <span>:</span>
            <span>00</span>
          </div>
        </div>
        <div className="block score">
            <h3>Score</h3>
            <div className="score-wrapper">
                <span>000000</span>
            </div>
        </div>
        <div className="block actions">
            <h3>Grid Size</h3>
            <div className="grid-size-wrapper">
                <select></select>
            </div>
            <div className="start-game-wrapper">
                <button>Start Game</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
