import type {
  BoardHistoryT,
  CapturedPieceType,
  CastlingRights,
  ChessBoardDataT,
  ChessSideT,
  SelectedPieceType,
} from "../types";
import {
  getBoardAfterMove,
  getUpdateCastlingRights,
  getUpdatedCapturedPieces,
} from "./helpers";
import { isMoveIsCastling, makeCastlingMove } from "./rules/castling";
import { isKingInCheck, isKingInCheckMate } from "./rules/checksAndMates";
import { isMoveIsPromotion } from "./rules/promotion/promition";

type getNextGameStateT = {
  row: number;
  col: number;
  kingsCoords: {
    white: number[];
    black: number[];
  };
  chessBoardData: ChessBoardDataT;
  capturedPieces: CapturedPieceType[];
  selectedPiece: SelectedPieceType;
  castlingRights: CastlingRights;
  boardHistory: BoardHistoryT[];
  turn: ChessSideT;
};

export const getNextGameState = ({
  capturedPieces,
  boardHistory,
  turn,
  castlingRights,
  kingsCoords,
  chessBoardData,
  selectedPiece,
  row,
  col,
}: getNextGameStateT) => {
  const isKing = selectedPiece.type === "king";

  const updatedKingCoords = isKing
    ? { ...kingsCoords, [selectedPiece.side]: [row, col] }
    : null;

  const updatedTurn: ChessSideT = turn === "white" ? "black" : "white";
  const updatedCastlingRight = getUpdateCastlingRights({
    castlingRights,
    movingPiece: {
      type: selectedPiece.type,
      side: selectedPiece.side,
      row: selectedPiece.row,
      col: selectedPiece.col,
    },
  });
  const isCastling = isMoveIsCastling({
    row,
    col,
    type: selectedPiece.type,
    isKingMoved: castlingRights[selectedPiece.side].kingMoved,
  });

  //Board history update
  const updatedBoardHistory = [
    ...boardHistory,
    {
      from: {
        pieceInfo: { type: selectedPiece.type, side: selectedPiece.side },
        coords: `${selectedPiece.row}${selectedPiece.col}`,
      },
      to: { pieceInfo: chessBoardData[row][col], coords: `${row}${col}` },
      promotion: null,
      castling: isCastling,
    },
  ];

  //Chessboard update
  const from = { row: selectedPiece.row, col: selectedPiece.col };
  const to = { row, col };
  const updatedChessBoardData: ChessBoardDataT = isCastling
    ? makeCastlingMove({
        boardState: chessBoardData,
        row,
        col,
      })
    : getBoardAfterMove({
        boardState: chessBoardData,
        side: selectedPiece.side,
        type: selectedPiece.type,
        to,
        from,
      });

  //Captured pieces update
  const newPositionData = chessBoardData[row][col];
  const updatedCP: CapturedPieceType[] | null =
    newPositionData !== "empty"
      ? getUpdatedCapturedPieces(capturedPieces, newPositionData, 1)
      : null;

  //Promotion status update
  const isPromotion = isMoveIsPromotion({
    pieceInfo: { type: selectedPiece.type, side: selectedPiece.side },
    row,
  });
  const isCapturedPiecesNotOnlyPawns = capturedPieces.some(
    (piece) => piece.side === selectedPiece.side && piece.type !== "pawn",
  );

  const promotionPieceInfo = {
    type: selectedPiece.type,
    side: selectedPiece.side,
    row,
    col,
  };
  const promotionData =
    isPromotion && isCapturedPiecesNotOnlyPawns
      ? { pieceInfo: promotionPieceInfo, active: true }
      : null;

  //Checks and checkmate
  const checksData = isKingInCheck({
    kings: isKing
      ? { ...kingsCoords, [selectedPiece.side]: [row, col] }
      : kingsCoords,
    boardState: updatedChessBoardData,
  });
  const isCheckAndMate = isKingInCheckMate({
    boardState: updatedChessBoardData,
    checks: checksData,
  });

  return {
    checksData,
    isCheckAndMate,
    updatedCP,
    updatedChessBoardData,
    updatedBoardHistory,
    updatedTurn,
    updatedCastlingRight,
    promotionData,
    updatedKingCoords,
  };
};
