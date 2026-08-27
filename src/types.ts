export type ChessPieceTypes =
  | "pawn"
  | "knight"
  | "bishop"
  | "rook"
  | "queen"
  | "king";
export type ChessSideT = "white" | "black";

export type ChessBoardDataT = (
  | { type: ChessPieceTypes; side: ChessSideT }
  | "empty"
)[][];

export type BoardHistoryT = {
  from: {
    pieceInfo: { type: ChessPieceTypes; side: ChessSideT };
    coords: string;
  };
  to: {
    pieceInfo: { type: ChessPieceTypes; side: ChessSideT } | "empty";
    coords: string;
  };
};
