import type {
  CastlingRights,
  ChessBoardDataT,
  ChessPieceTypes,
  ChessSideT,
} from "../types";
import { boardLetters, boardNumbers } from "./ui/constants";

export const getBoardAfterMove = ({
  boardState,
  from,
  to,
  side,
  type,
}: {
  boardState: ChessBoardDataT;
  to: { row: number; col: number };
  from: { row: number; col: number };
  side: ChessSideT;
  type: ChessPieceTypes;
}) => {
  return boardState.map((boardRow, rowIdx) => {
    return boardRow.map((cellData, colIdx) => {
      if (rowIdx === to.row && colIdx === to.col) {
        return {
          type,
          side,
        };
      }
      if (rowIdx === from.row && colIdx === from.col) {
        return "empty";
      }
      return cellData;
    });
  });
};

export const convertCoordsToChessType = (row: number, col: number) => {
  return { boardX: boardLetters[col], boardY: boardNumbers[7 - row] };
};

export const getUpdateCastlingRights = ({
  castlingRights,
  movingPiece,
}: {
  castlingRights: CastlingRights;
  movingPiece: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
  };
}) => {
  const updatedCastlingRights: CastlingRights = structuredClone(castlingRights);
  const rookSide =
    movingPiece.col === 0 ? "rookQueenSideMoved" : "rookKingSideMoved";
  if (
    movingPiece.type === "king" &&
    !castlingRights[movingPiece.side].kingMoved
  ) {
    updatedCastlingRights[movingPiece.side].kingMoved = true;
  } else if (
    movingPiece.type === "rook" &&
    !castlingRights[movingPiece.side][rookSide]
  ) {
    updatedCastlingRights[movingPiece.side][rookSide] = true;
  } else {
    return null;
  }
  return updatedCastlingRights;
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
