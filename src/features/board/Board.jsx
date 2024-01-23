import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clickOnCard,
  initialCardsDisplay,
  isBoardEnabled,
  selectCards,
  showingCardIdx,
  startGame,
} from "./Board.slice";
import "./Board.scss";
import Card from "./Card";

const getDivisers = (num) => {
  let divisers = [];
  let diviser = 1;
  let minDiff = num;

  while (diviser <= num) {
    if (num % diviser === 0) {
      const diviser2 = num / diviser;
      const diff = Math.abs(diviser - diviser2);

      if (diff < minDiff) {
        minDiff = diff;
        divisers = [Math.min(diviser, diviser2), Math.max(diviser, diviser2)];
      }
    }

    diviser++;
  }

  return divisers;
};

const Board = () => {
  const dispatch = useDispatch();
  const cards = useSelector(selectCards);
  const currentShowingCardIdx = useSelector(showingCardIdx);
  const boardEnabled = useSelector(isBoardEnabled);
  const isShowingInitialCards = useSelector(initialCardsDisplay);

  useEffect(() => {
    //console.log(cards);
    dispatch(startGame());
  }, []);

  useEffect(() => {
    //console.log(cards);
  }, [cards]);

  useEffect(() => {
    //console.log("currentShowingCardIdx: ", currentShowingCardIdx);
  }, [currentShowingCardIdx]);

  useEffect(() => {
    //console.log("isShowingInitialCards: ", isShowingInitialCards);
  }, [isShowingInitialCards]);

  const divisers = useMemo(() => {
    return getDivisers(cards.length);
  }, [cards]);

  const onCellClcik = (index) => {
    //console.log(boardEnabled);
    if (cards[index].show === true || !boardEnabled) return;

    dispatch(clickOnCard(index));
  };

  const Cards = useMemo(() => {
    const [cols, rows] = divisers;

    if (divisers.length === 0) return null;

    return new Array(rows).fill(null).map((_, rowIdx) => {
      return (
        <div className={"cards-row"} key={rowIdx}>
          {new Array(cols).fill(null).map((_, colIdx) => {
            const index = cols * rowIdx + colIdx;
            const card = cards[index];
            return (
              <div className="board-cell">
                <Card
                  {...card}
                  show={
                    card.show ||
                    currentShowingCardIdx === index ||
                    isShowingInitialCards
                  }
                  key={`${rowIdx}-${colIdx}`}
                  index={cols * rowIdx + colIdx}
                  onClick={onCellClcik}
                />
              </div>
            );
          })}
        </div>
      );
    });
  }, [divisers, currentShowingCardIdx, isShowingInitialCards]);

  return (
    <div className="board-wrapper">
      <div className="board-content">{Cards}</div>
    </div>
  );
};

export default Board;
