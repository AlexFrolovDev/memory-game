import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.scss";
import {
  actions,
  getBoardSize,
  getIsGameOver,
  getIsGameStarted,
  getScore,
  initialCardsDisplay,
  startGame,
} from "../board/Board.slice";

const Sidebar = () => {
  const gameInterval = useRef(null);
  const [time, setTime] = useState(5 * 60);
  const dispatch = useDispatch();
  const gameStarted = useSelector(getIsGameStarted);
  const gameOver = useSelector(getIsGameOver);
  const showingInitialCards = useSelector(initialCardsDisplay);
  const score = useSelector(getScore);
  const boardSize = useSelector(getBoardSize);

  const onStartGameClick = () => {
    dispatch(gameStarted ? actions.finishGame() : startGame());
  };

  const onBoardSizeChange = (e) => {
    dispatch(actions.setBoardSize(e.target.value));
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setTime(5 * 60);
      gameInterval.current = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      //console.log("clearing interval");
      clearInterval(gameInterval.current);
    }

    return () => {
      clearInterval(gameInterval.current);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="block timer">
          <h3>Time</h3>
          <div className="timer-wrapper">
            <span className="value-display">
              {Math.floor(time / 60)
                .toString()
                .padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="value-display">
              {Math.floor(time % 60)
                .toString()
                .padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="block score">
          <h3>Score</h3>
          <div className="score-wrapper">
            <span className="value-display">
              {`${score < 0 ? '-' : ""}${Math.abs(score)
                .toString()
                .padStart(6, "0")}`}
            </span>
          </div>
        </div>
        <div className="block actions">
          <h3>Grid Size</h3>
          <div className="grid-size-wrapper">
            <select
              value={boardSize}
              onChange={onBoardSizeChange}
              disabled={gameStarted || showingInitialCards}
            >
              {[4, 6, 8, 12, 16].map((size) => {
                return (
                  <option value={size} key={size}>
                    {size}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={`start-game-wrapper ${gameStarted ? "stop" : ""}`}>
            <button onClick={onStartGameClick}>
              {gameStarted ? "Finish Game" : "Start Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
