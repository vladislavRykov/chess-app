import type {
  CastlingRights,
  ChessBoardDataT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
} from "../../types";
import { checkIfMoveIsLegal } from "./checksAndMates";
import { kingCastlingMoves, KingsInitialPositions } from "./state";

export const checkIsCastlingAllowed = ({
  castlingRight,
  type,
  side,
  boardState,
  checks,
  isCheckMate,
}: {
  type: ChessPieceTypes;
  side: ChessSideT;
  boardState: ChessBoardDataT;
  checks: ChessCheck[];
  isCheckMate: boolean;
  castlingRight: CastlingRights;
}) => {
  if (
    type !== "king" ||
    castlingRight[side].kingMoved ||
    checks.length > 0 ||
    isCheckMate
  )
    return { isCastlingAllowed: false, moves: [] };
  const kingPath = [];
  if (
    side === "white" &&
    !castlingRight["white"].rookKingSideMoved &&
    boardState[7][5] === "empty" &&
    boardState[7][6] === "empty"
  ) {
    kingPath.push([7, 5], [7, 6]);
  }
  if (
    side === "white" &&
    !castlingRight["white"].rookQueenSideMoved &&
    boardState[7][1] === "empty" &&
    boardState[7][2] === "empty" &&
    boardState[7][3] === "empty"
  ) {
    kingPath.push([7, 2], [7, 3]);
  }
  if (
    side === "black" &&
    !castlingRight["black"].rookKingSideMoved &&
    boardState[0][5] === "empty" &&
    boardState[0][6] === "empty"
  ) {
    kingPath.push([0, 5], [0, 6]);
  }
  if (
    side === "black" &&
    !castlingRight["black"].rookQueenSideMoved &&
    boardState[0][1] === "empty" &&
    boardState[0][2] === "empty" &&
    boardState[0][3] === "empty"
  ) {
    kingPath.push([0, 2], [0, 3]);
  }
  if (kingPath.length === 0) return { isCastlingAllowed: false, moves: [] };
  const isPathHasNoCheck = kingPath.some(
    (move) =>
      !checkIfMoveIsLegal({
        boardState: boardState,
        pieceKing: [move[0], move[1]],

        to: { row: move[0], col: move[1] },
        pieceInfo: {
          side,
          type,
          row: KingsInitialPositions[side][0],
          col: KingsInitialPositions[side][1],
        },
      }),
  );
  return { isCastlingAllowed: isPathHasNoCheck, moves: [...kingPath] };
};
export const isMoveIsCastling = ({
  row,
  col,
  type,
  isKingMoved,
}: {
  row: number;
  col: number;
  type: ChessPieceTypes;
  isKingMoved: boolean;
}) => {
  return (
    !isKingMoved &&
    type === "king" &&
    kingCastlingMoves.includes(`${row}${col}`)
  );
};
export const makeCastlingMove = ({
  boardState,
  row,
  col,
}: {
  boardState: ChessBoardDataT;
  row: number;
  col: number;
}) => {
  const newBoardState = structuredClone(boardState);
  if (row === 7 && col === 2) {
    newBoardState[row][col] =
      newBoardState[KingsInitialPositions.white[0]][
        KingsInitialPositions.white[1]
      ];
    newBoardState[KingsInitialPositions.white[0]][
      KingsInitialPositions.white[1]
    ] = "empty";
    newBoardState[7][3] = newBoardState[7][0];
    newBoardState[7][0] = "empty";
  } else if (row === 7 && col === 6) {
    newBoardState[row][col] =
      newBoardState[KingsInitialPositions.white[0]][
        KingsInitialPositions.white[1]
      ];
    newBoardState[KingsInitialPositions.white[0]][
      KingsInitialPositions.white[1]
    ] = "empty";
    newBoardState[7][5] = newBoardState[7][7];
    newBoardState[7][7] = "empty";
  } else if (row === 0 && col === 2) {
    newBoardState[row][col] =
      newBoardState[KingsInitialPositions.black[0]][
        KingsInitialPositions.black[1]
      ];
    newBoardState[KingsInitialPositions.black[0]][
      KingsInitialPositions.black[1]
    ] = "empty";
    newBoardState[0][3] = newBoardState[0][0];
    newBoardState[0][0] = "empty";
  } else if (row === 0 && col === 6) {
    newBoardState[row][col] =
      newBoardState[KingsInitialPositions.black[0]][
        KingsInitialPositions.black[1]
      ];
    newBoardState[KingsInitialPositions.black[0]][
      KingsInitialPositions.black[1]
    ] = "empty";
    newBoardState[0][5] = newBoardState[0][7];
    newBoardState[0][7] = "empty";
  }
  return newBoardState;
};
