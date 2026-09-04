import type { ChessBoardDataT, ChessPieceTypes, ChessSideT } from "../../types";

export const calcAllowedPieceMoves = ({
  boardState,
  pieceType,
  side,
  row,
  col,
}: {
  boardState: ChessBoardDataT;
  pieceType: ChessPieceTypes;
  side: ChessSideT;
  row: number;
  col: number;
}) => {
  switch (pieceType) {
    case "pawn":
      return calcPawnAllowedMoves({ row, col, boardState, side });

    case "knight":
      return calcKnightAllowedMoves({ row, col, boardState, side });
    case "king":
      return calcKingAllowedMoves({ row, col, boardState, side });
    case "bishop":
      return calcBishopAllowedMoves({ row, col, boardState, side });
    case "rook":
      return calcRookAllowedMoves({ row, col, boardState, side });
    case "queen":
      return calcQueenAllowedMoves({ row, col, boardState, side });
    default:
      return [];
  }
};

export const calcPawnAllowedMoves = ({
  row,
  col,
  boardState,
  side,
}: {
  row: number;
  col: number;
  boardState: ChessBoardDataT;
  side: ChessSideT;
}) => {
  const allowedMovesArray = [];
  let rowNumber = row;
  const direction = side === "white" ? -1 : 1;
  rowNumber += direction;
  if (rowNumber in boardState) {
    if (
      col + 1 in boardState[rowNumber] &&
      boardState[rowNumber][col + 1] !== "empty"
    ) {
      allowedMovesArray.push([rowNumber, col + 1]);
    }
    if (
      col - 1 in boardState[rowNumber] &&
      boardState[rowNumber][col - 1] !== "empty"
    ) {
      allowedMovesArray.push([rowNumber, col - 1]);
    }
    if (boardState[rowNumber][col] === "empty") {
      allowedMovesArray.push([rowNumber, col]);
      if (
        row + direction * 2 in boardState &&
        boardState[row + direction * 2][col] === "empty" &&
        ((row === 6 && side === "white") || (row === 1 && side === "black"))
      ) {
        allowedMovesArray.push([row + direction * 2, col]);
      }
    }
  }

  return allowedMovesArray.filter(([r, c]) => {
    const cellData = r in boardState && c in boardState[r] && boardState[r][c];
    return cellData && (cellData === "empty" || cellData.side !== side);
  });
};
export const calcKnightAllowedMoves = ({
  row,
  col,
  boardState,
  side,
}: {
  row: number;
  col: number;
  boardState: ChessBoardDataT;
  side: ChessSideT;
}) => {
  const allowedMovesArray = [
    [row + 2, col + 1],
    [row + 2, col - 1],
    [row - 2, col + 1],
    [row - 2, col - 1],
    [row - 1, col + 2],
    [row + 1, col + 2],
    [row + 1, col - 2],
    [row - 1, col - 2],
  ];
  return allowedMovesArray.filter(([r, c]) => {
    const cellData = r in boardState && c in boardState[r] && boardState[r][c];
    return cellData && (cellData === "empty" || cellData.side !== side);
  });
};
export const calcKingAllowedMoves = ({
  row,
  col,
  boardState,
  side,
}: {
  row: number;
  col: number;
  boardState: ChessBoardDataT;
  side: ChessSideT;
}) => {
  const allowedMovesArray = [
    [row + 1, col + 1],
    [row + 1, col - 1],
    [row - 1, col + 1],
    [row - 1, col - 1],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  return allowedMovesArray.filter(([r, c]) => {
    const cellData = r in boardState && c in boardState[r] && boardState[r][c];
    return cellData && (cellData === "empty" || cellData.side !== side);
  });
};
export const calcBishopAllowedMoves = ({
  boardState,
  side,
  row,
  col,
}: {
  row: number;
  col: number;
  side: ChessSideT;
  boardState: ChessBoardDataT;
}) => {
  const allowedMovesArray = [];
  const direction = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const dir of direction) {
    let currentPosition = [row + dir[0], col + dir[1]];
    // console.log(dir, currentPosition);
    while (
      currentPosition[0] <= 7 &&
      currentPosition[0] >= 0 &&
      currentPosition[1] <= 7 &&
      currentPosition[1] >= 0
    ) {
      const cellData = boardState[currentPosition[0]][currentPosition[1]];
      if (cellData !== "empty") {
        if (cellData.side !== side) {
          allowedMovesArray.push([...currentPosition]);
        }
        break;
      }
      allowedMovesArray.push([...currentPosition]);
      currentPosition = [
        currentPosition[0] + dir[0],
        currentPosition[1] + dir[1],
      ];
    }
  }

  return allowedMovesArray;
};
export const calcRookAllowedMoves = ({
  boardState,
  side,
  row,
  col,
}: {
  row: number;
  col: number;
  side: ChessSideT;
  boardState: ChessBoardDataT;
}) => {
  const allowedMovesArray = [];
  const direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const dir of direction) {
    let currentPosition = [row + dir[0], col + dir[1]];
    // console.log(dir, currentPosition);
    while (
      currentPosition[0] <= 7 &&
      currentPosition[0] >= 0 &&
      currentPosition[1] <= 7 &&
      currentPosition[1] >= 0
    ) {
      const cellData = boardState[currentPosition[0]][currentPosition[1]];
      if (cellData !== "empty") {
        if (cellData.side !== side) {
          allowedMovesArray.push([...currentPosition]);
        }
        break;
      }
      allowedMovesArray.push([...currentPosition]);
      currentPosition = [
        currentPosition[0] + dir[0],
        currentPosition[1] + dir[1],
      ];
    }
  }

  return allowedMovesArray;
};
export const calcQueenAllowedMoves = ({
  boardState,
  side,
  row,
  col,
}: {
  row: number;
  col: number;
  side: ChessSideT;
  boardState: ChessBoardDataT;
}) => {
  const allowedMovesArray = [];
  const direction = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const dir of direction) {
    let currentPosition = [row + dir[0], col + dir[1]];
    // console.log(dir, currentPosition);
    while (
      currentPosition[0] <= 7 &&
      currentPosition[0] >= 0 &&
      currentPosition[1] <= 7 &&
      currentPosition[1] >= 0
    ) {
      const cellData = boardState[currentPosition[0]][currentPosition[1]];
      if (cellData !== "empty") {
        if (cellData.side !== side) {
          allowedMovesArray.push([...currentPosition]);
        }
        break;
      }
      allowedMovesArray.push([...currentPosition]);
      currentPosition = [
        currentPosition[0] + dir[0],
        currentPosition[1] + dir[1],
      ];
    }
  }

  return allowedMovesArray;
};
