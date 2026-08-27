import type { ChessBoardDataT } from "../types";

export const HIGHLIGHT_COLOR = "rgb(216, 245, 208)";
export const LAST_MOVE_HIGHLIGHT_COLOR = "rgb(200, 204, 96)";

export const cellData = {
  color1: "#9c6b3e",
  color2: "#d6c7a1",
  width: 70,
  height: 70,
};
export const getRealCoords = (
  rowIdx: number,
  colIdx: number,
  isFlipped: boolean,
  size = 8,
) => {
  if (!isFlipped) return [rowIdx, colIdx];

  return [size - 1 - rowIdx, size - 1 - colIdx];
};
export const boardNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
export const boardLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const convertCoordsToChessType = (row: number, col: number) => {
  return { boardX: boardLetters[col], boardY: boardNumbers[7 - row] };
};

export const initialBoardState: ChessBoardDataT = [
  //1 row
  [
    { type: "rook", side: "black" },
    { type: "knight", side: "black" },
    { type: "bishop", side: "black" },
    { type: "queen", side: "black" },
    { type: "king", side: "black" },
    { type: "bishop", side: "black" },
    { type: "knight", side: "black" },
    { type: "rook", side: "black" },
  ],
  //2 row
  [
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
    { type: "pawn", side: "black" },
  ],
  //3 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  //4 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  //5 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  //6 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  //7 row
  [
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
    { type: "pawn", side: "white" },
  ],
  //8 row
  [
    { type: "rook", side: "white" },
    { type: "knight", side: "white" },
    { type: "bishop", side: "white" },
    { type: "queen", side: "white" },
    { type: "king", side: "white" },
    { type: "bishop", side: "white" },
    { type: "knight", side: "white" },
    { type: "rook", side: "white" },
  ],
];
