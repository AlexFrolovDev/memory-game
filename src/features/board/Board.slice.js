import {
  createAsyncThunk,
  createDraftSafeSelector,
  createSlice,
} from "@reduxjs/toolkit";

const INITIAL_STATE = {
  cards: [],
  boardSize: 12,
  currentSelectedCardIndex: -1,
  showingCardIdx: -1,
  initialCardsDisplay: false,
  gameStarted: false,
  gameIsOver: false,
  score: 0,
};

const getShuffledCards = (size) => {
  const imageNames = new Array(50)
    .fill(null)
    .map((_, idx) => `image-${idx + 1}.jpg`);

  const mixArray = (array) => {
    array.forEach((_, idx) => {
      let cycle = 0;
      while (cycle < array.length) {
        const rndIdx = Math.floor(Math.random() * array.length);
        const rndIdx2 = Math.floor(Math.random() * array.length);
        [array[rndIdx], array[rndIdx2]] = [array[rndIdx2], array[rndIdx]];

        cycle++;
      }
    });
  };

  mixArray(imageNames);

  const arraySlice = imageNames
    .slice(0, size / 2)
    .concat(imageNames.slice(0, size / 2));

  mixArray(arraySlice);

  return arraySlice.map((image) => ({ image, show: false }));
};

export const startGame = createAsyncThunk("board/startGame", () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
});

export const clickOnCard = createAsyncThunk(
  "board/clickOnCard",
  (cardIdx, api) => {
    const state = api.getState().board;
    const clickedCard = state.cards[cardIdx];
    const { currentSelectedCardIndex } = state;
    const selectedPrevCard = state.cards[currentSelectedCardIndex];
    const isMatchingCard = selectedPrevCard
      ? selectedPrevCard?.image === clickedCard.image
      : false;

    return new Promise((resolve, reject) => {
      if (selectedPrevCard) {
        if (isMatchingCard) {
          resolve(cardIdx);
        } else {
          setTimeout(() => {
            reject(cardIdx);
          }, 1000);
        }
      } else {
        resolve(cardIdx);
      }
    });
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    ...INITIAL_STATE,
    cards: getShuffledCards(INITIAL_STATE.boardSize),
  },
  reducers: {
    setBoardSize: (state, { payload }) => {
      state.boardSize = payload;
      state.cards = getShuffledCards(state.boardSize);
    },
    finishGame: (state) => {
      state.gameIsOver = true;
      state.gameStarted = false;
      state.cards = state.cards.map((card, idx) => {
        return {
          ...card,
          show: true,
        };
      });
    },
    generateBoard: (state) => {
      state.cards = getShuffledCards(state.boardSize);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame.pending, (state, action) => {
        //console.log("starting game");
        //state.cards = getShuffledCards(state.boardSize);
        state.initialCardsDisplay = true;
        state.gameIsOver = false;
        state.gameStarted = false;
        state.cards = getShuffledCards(state.boardSize);
      })
      .addCase(startGame.fulfilled, (state, action) => {
        //console.log("game started");
        state.initialCardsDisplay = false;
        state.gameStarted = true;
      })
      .addCase(clickOnCard.pending, (state, action) => {
        //console.log('pending: ', action);
        if (state.showingCardIdx > -1) return;
        state.showingCardIdx = action.meta.arg;
      })
      .addCase(clickOnCard.fulfilled, (state, action) => {
        //console.log("fulfilled: ", action);
        state.showingCardIdx = -1;
        state.cards = state.cards.map((card, idx) => {
          return {
            ...card,
            show: idx === action.payload ? true : card.show,
          };
        });

        const allCardsOpened = state.cards.every((card) => card.show === true);

        if (state.currentSelectedCardIndex > -1) {
          state.currentSelectedCardIndex = -1;
          state.score += 1;
          //console.log("card matched: ", action.payload);
        } else {
          state.currentSelectedCardIndex = action.payload;
          //console.log("Showing selected card: ", action.payload);
        }

        if (allCardsOpened) {
          state.gameStarted = false;
          state.gameIsOver = true;
        }
      })
      .addCase(clickOnCard.rejected, (state, action) => {
        //console.log("rejected: ", action);
        state.showingCardIdx = -1;
        state.score -= 1;
      });
  },
  selectors: {
    isBoardEnabled: (state) =>
      !state.initialCardsDisplay && !state.showingClickedCard,
  },
});

export const actions = boardSlice.actions;

export const selectors = boardSlice.selectors;

export const selectSelf = (state) => state.board;

export const selectCards = createDraftSafeSelector(
  selectSelf,
  (state) => state.cards
);

export const isBoardEnabled = createDraftSafeSelector(
  selectSelf,
  (state) =>
    !state.initialCardsDisplay &&
    !state.showingCardIdx > -1 &&
    !state.gameIsOver
);
export const showingCardIdx = createDraftSafeSelector(
  selectSelf,
  (state) => state.showingCardIdx
);
export const currentSelectedCardIdx = createDraftSafeSelector(
  selectSelf,
  (state) => state.currentSelectedCardIdx
);
export const initialCardsDisplay = createDraftSafeSelector(
  selectSelf,
  (state) => state.initialCardsDisplay
);

export const getIsGameStarted = createDraftSafeSelector(
  selectSelf,
  (state) => state.gameStarted
);

export const getIsGameOver = createDraftSafeSelector(
  selectSelf,
  (state) => state.gameIsOver
);

export const getScore = createDraftSafeSelector(
  selectSelf,
  (state) => state.score
);

export const getBoardSize = createDraftSafeSelector(
  selectSelf,
  (state) => state.boardSize
);

export default boardSlice.reducer;
