import type {
  CapturedPieceType,
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
export const getRookSideOrKing = (piece: {
  type: "king" | "rook";
  col: number;
}) => {
  if (piece.type === "king") return "kingMoved";
  return piece.col === 0 ? "rookQueenSideMoved" : "rookKingSideMoved";
};

export const isCastlingNeedsUpdate = ({
  castlingRights,
  movingPiece,
}: {
  castlingRights: CastlingRights;
  movingPiece: {
    type: ChessPieceTypes;
    side: ChessSideT;
    col: number;
  };
}) => {
  const pieceType = movingPiece.type;
  if (pieceType !== "king" && pieceType !== "rook") return false;
  const rooksOrKings = getRookSideOrKing({
    type: pieceType,
    col: movingPiece.col,
  });
  return !castlingRights[movingPiece.side][rooksOrKings];
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
  const rooksOrKings = getRookSideOrKing(movingPiece);
  updatedCastlingRights[movingPiece.side][rooksOrKings] = true;
  return updatedCastlingRights;
};
export const getUpdatedCapturedPieces = (
  capturedPieces: CapturedPieceType[],
  piece: { type: ChessPieceTypes; side: ChessSideT },
  delta: number,
) => {
  const capturedPiecesCopy = structuredClone(capturedPieces);
  const pieceIndex = capturedPiecesCopy.findIndex(
    (pieceInfo) =>
      piece.type === pieceInfo.type && piece.side === pieceInfo.side,
  );

  if (pieceIndex === -1 && delta > 0) {
    return [...capturedPiecesCopy, { ...piece, count: delta }];
  } else if (pieceIndex >= 0) {
    const updatedPieceCount = capturedPiecesCopy[pieceIndex].count + delta;
    return updatedPieceCount <= 0
      ? capturedPiecesCopy.filter(
          (pieceInfo) =>
            !(piece.type === pieceInfo.type && piece.side === pieceInfo.side),
        )
      : capturedPiecesCopy.map((pieceInfo) =>
          pieceInfo.type === piece.type && piece.side === pieceInfo.side
            ? { ...pieceInfo, count: updatedPieceCount }
            : pieceInfo,
        );
  } else {
    return capturedPiecesCopy;
  }
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
