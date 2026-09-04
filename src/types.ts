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
  promotion: { type: ChessPieceTypes; side: ChessSideT } | null;
  castling: boolean;
};
export type ChessCheck = {
  attaker: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
  };
  king: {
    side: string;
    row: number;
    col: number;
  };
};
export type CapturedPieceType = {
  type: ChessPieceTypes;
  side: ChessSideT;
  count: number;
};

export type Promotion = {
  active: boolean;
  pieceInfo: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
  } | null;
};
export type CastlingRights = {
  white: {
    kingMoved: boolean;
    rookKingSideMoved: boolean;
    rookQueenSideMoved: boolean;
  };
  black: {
    kingMoved: boolean;
    rookKingSideMoved: boolean;
    rookQueenSideMoved: boolean;
  };
};
