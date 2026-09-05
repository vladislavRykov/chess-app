import type { ChessPieceTypes, ChessSideT } from "../../../types";

export const isMoveIsPromotion = ({
  row,
  pieceInfo,
}: {
  row: number;

  pieceInfo: {
    type: ChessPieceTypes;
    side: ChessSideT;
  };
}) => {
  return (
    pieceInfo.type === "pawn" &&
    (pieceInfo.side === "white" ? row === 0 : row === 7)
  );
};
