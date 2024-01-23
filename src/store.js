import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./features/board/Board.slice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
});
