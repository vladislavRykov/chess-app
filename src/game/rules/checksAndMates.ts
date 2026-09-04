import type {
  ChessBoardDataT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
} from "../../types";
import { getBoardAfterMove } from "../helpers";
import { calcAllowedPieceMoves } from "./moves";

export const checkIfMoveIsLegal = ({
  boardState,
  to,
  pieceInfo,
  pieceKing,
}: {
  boardState: ChessBoardDataT;
  to: { row: number; col: number };
  pieceInfo: {
    side: ChessSideT;
    type: ChessPieceTypes;
    row: number;
    col: number;
  };
  pieceKing: number[];
}) => {
  const updatedChessBoardData = getBoardAfterMove({
    boardState,
    side: pieceInfo.side,
    type: pieceInfo.type,
    from: { row: pieceInfo.row, col: pieceInfo.col },
    to,
  });
  return updatedChessBoardData.some((row, rowIdx) => {
    return row.some((cellInfo, colIdx) => {
      if (cellInfo !== "empty" && cellInfo.side !== pieceInfo.side) {
        const allowedMoves = calcAllowedPieceMoves({
          boardState: updatedChessBoardData,
          pieceType: cellInfo.type,
          side: cellInfo.side,
          row: rowIdx,
          col: colIdx,
        });
        return allowedMoves.some(
          ([r, c]) => r === pieceKing[0] && c === pieceKing[1],
        );
      }
    });
  });
};
export const getlegalMoves = ({
  moves,
  boardState,
  pieceInfo,
  pieceKing,
}: {
  moves: number[][];
  boardState: ChessBoardDataT;
  pieceInfo: {
    side: ChessSideT;
    type: ChessPieceTypes;
    row: number;
    col: number;
  };
  pieceKing: number[];
}) => {
  return moves.filter(
    (move) =>
      !checkIfMoveIsLegal({
        boardState,
        pieceKing: pieceInfo.type === "king" ? [move[0], move[1]] : pieceKing,
        to: { row: move[0], col: move[1] },
        pieceInfo,
      }),
  );
};
export const isKingInCheck = ({
  boardState,
  kings,
}: {
  boardState: ChessBoardDataT;

  kings: {
    white: number[];
    black: number[];
  };
}) => {
  const checks: ChessCheck[] = [];
  for (let rowIdx = 0; rowIdx <= boardState.length - 1; rowIdx++) {
    for (let colIdx = 0; colIdx <= boardState[rowIdx].length - 1; colIdx++) {
      const cellInfo = boardState[rowIdx][colIdx];
      if (cellInfo !== "empty") {
        const allowedMoves = calcAllowedPieceMoves({
          boardState,
          pieceType: cellInfo.type,
          side: cellInfo.side,
          row: rowIdx,
          col: colIdx,
        });
        const enemySide = cellInfo.side === "white" ? "black" : "white";
        if (
          allowedMoves.some(
            ([r, c]) => r === kings[enemySide][0] && c === kings[enemySide][1],
          )
        ) {
          const attack = {
            attaker: {
              type: cellInfo.type,
              side: cellInfo.side,
              row: rowIdx,
              col: colIdx,
            },
            king: {
              side: enemySide,
              row: kings[enemySide][0],
              col: kings[enemySide][1],
            },
          };
          checks.push(attack);
        }
      }
    }
  }
  return checks;
};
export const isKingInCheckMate = ({
  boardState,
  checks,
}: {
  boardState: ChessBoardDataT;
  checks: ChessCheck[];
}) => {
  if (checks.length === 0) return false;
  const kingInfo = checks[0].king;
  return !boardState.some((row, rowIdx) => {
    return row.some((cellInfo, colIdx) => {
      if (cellInfo !== "empty" && cellInfo.side === kingInfo.side) {
        const allowedMoves = calcAllowedPieceMoves({
          boardState: boardState,
          pieceType: cellInfo.type,
          side: cellInfo.side,
          row: rowIdx,
          col: colIdx,
        });
        const legalMoves = getlegalMoves({
          boardState,
          moves: allowedMoves,
          pieceKing: [kingInfo.row, kingInfo.col],
          pieceInfo: {
            side: cellInfo.side,
            type: cellInfo.type,
            row: rowIdx,
            col: colIdx,
          },
        });

        return legalMoves.length > 0;
      }
    });
  });
};
