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
};

const getShuffledCards = (size) => {
  const imageNames = new Array(50)
    .fill(null)
    .map((_, idx) => `image-${idx}.jpg`);
  const mixArray = (array) => {
    array.forEach((imageName, index) => {
      const rndIdx = Math.floor(Math.random() * 50);
      const rndIdx2 = Math.floor(Math.random() * (50 - rndIdx));
      [imageNames[rndIdx], imageNames[rndIdx2]] = [
        imageNames[rndIdx2],
        imageNames[rndIdx],
      ];
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
  initialState: INITIAL_STATE,
  reducers: {
    setBoardSize: (state, { payload }) => (state.boardSize = payload),
  },
  extraReducers: (builder) => {
    builder
      .addCase(startGame.pending, (state, action) => {
        //console.log("starting game");
        state.cards = getShuffledCards(state.boardSize);
        state.initialCardsDisplay = true;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        //console.log("game started");
        state.initialCardsDisplay = false;
      })
      .addCase(clickOnCard.pending, (state, action) => {
        //console.log('pending: ', action);
        if (state.showingCardIdx > -1) return;
        state.showingCardIdx = action.meta.arg;
      })
      .addCase(clickOnCard.fulfilled, (state, action) => {
        //console.log("fulfilled: ", action);

        state.showingCardIdx = -1;
        state.cards = state.cards.map((card, idx) => ({
          ...card,
          show: idx === action.payload ? true : card.show,
        }));

        if (state.currentSelectedCardIndex > -1) {
          state.currentSelectedCardIndex = -1;
          //console.log("card matched: ", action.payload);
        } else {
          state.currentSelectedCardIndex = action.payload;
          //console.log("Showing selected card: ", action.payload);
        }
      })
      .addCase(clickOnCard.rejected, (state, action) => {
        //console.log("rejected: ", action);
        state.showingCardIdx = -1;
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
  (state) => !state.initialCardsDisplay && !state.showingCardIdx > -1
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

export default boardSlice.reducer;
