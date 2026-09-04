import type { ChessBoardDataT } from "../../types";

export const kingCastlingMoves = ["72", "76", "02", "06"];
export const KingsInitialPositions = { white: [7, 4], black: [0, 4] };
export const RooksInitialPositions = {
  white: { rookKingSide: [7, 7], rookQueenSide: [7, 0] },
  black: { rookKingSide: [0, 7], rookQueenSide: [0, 0] },
};
export const createInitialCastlingRights = () => ({
  white: {
    kingMoved: false,
    rookKingSideMoved: false,
    rookQueenSideMoved: false,
  },
  black: {
    kingMoved: false,
    rookKingSideMoved: false,
    rookQueenSideMoved: false,
  },
});
export const createInitialBoardState = (): ChessBoardDataT => [
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
export const createInitialBoardStateCastling = (): ChessBoardDataT => [
  // 1 row (black back rank)
  [
    { type: "rook", side: "black" },
    "empty",
    "empty",
    "empty",
    { type: "king", side: "black" },
    "empty",
    "empty",
    { type: "rook", side: "black" },
  ],

  // 2 row
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

  // 3 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],

  // 4 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],

  // 5 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],

  // 6 row
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],

  // 7 row (white pawns)
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

  // 8 row (white back rank)
  [
    { type: "rook", side: "white" },
    "empty",
    "empty",
    "empty",
    { type: "king", side: "white" },
    "empty",
    "empty",
    { type: "rook", side: "white" },
  ],
];
