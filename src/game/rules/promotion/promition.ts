import type {
  BoardHistoryT,
  CapturedPieceType,
  ChessBoardDataT,
  ChessPieceTypes,
  ChessSideT,
} from "../../../types";
import { getUpdatedCapturedPieces } from "../../helpers";
import { isKingInCheck, isKingInCheckMate } from "../checksAndMates";

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
export const getBoardAfterPromotion = ({
  choosedReplacement: { type, side },
  promotedPawn,
  chessBoardData,
  kingsCoords,
  capturedPieces,
  boardHistory,
}: {
  choosedReplacement: { type: ChessPieceTypes; side: ChessSideT };
  chessBoardData: ChessBoardDataT;
  promotedPawn: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
  };
  boardHistory: BoardHistoryT[];
  capturedPieces: CapturedPieceType[];
  kingsCoords: {
    white: number[];
    black: number[];
  };
}) => {
  const updatedChessBoard = structuredClone(chessBoardData);
  updatedChessBoard[promotedPawn.row][promotedPawn.col] = { type, side };
  const updatedBoardHistory = structuredClone(boardHistory);
  updatedBoardHistory[updatedBoardHistory.length - 1] = {
    ...updatedBoardHistory[updatedBoardHistory.length - 1],
    promotion: { type, side },
  };
  const checksData = isKingInCheck({
    kings: kingsCoords,
    boardState: updatedChessBoard,
  });
  const isCheckAndMate = isKingInCheckMate({
    boardState: updatedChessBoard,
    checks: checksData,
  });
  const updatedCP = getUpdatedCapturedPieces(
    capturedPieces,
    { side, type },
    -1,
  );
  return {
    updatedChessBoard,
    isCheckAndMate,
    updatedBoardHistory,

    checksData,
    updatedCP,
  };
};
