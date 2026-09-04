import type { ChessPieceTypes, ChessSideT } from "../../../types";

export const isMoveIsPromotion = ({
  row,
  col,
  pieceInfo,
}: {
  row: number;

  col: number;
  pieceInfo: {
    type: ChessPieceTypes;
    side: ChessSideT;
  };
}) => {
  if (
    pieceInfo.type === "pawn" &&
    (pieceInfo.side === "white" ? row === 0 : row === 7)
  ) {
    return { ...pieceInfo, row, col };
  }

  return null;
};
