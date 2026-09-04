import { useState } from "react";
import type {
  BoardHistoryT,
  CapturedPieceType,
  CastlingRights,
  ChessBoardDataT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
  Promotion,
} from "../types";

import {
  getGameDataToLS,
  removeGameDataToLS,
  saveGameDataToLS,
} from "./localStorage";
import { triggerDeathAudio, triggerMoveAudio } from "./sound";
import { getBoardAfterMove, getUpdateCastlingRights } from "./helpers";
import {
  getlocalStorageData,
  setlocalStorageData,
} from "../services/storageService";
import {
  createInitialBoardState,
  createInitialCastlingRights,
  KingsInitialPositions,
} from "./rules/state";
import {
  checkIsCastlingAllowed,
  isMoveIsCastling,
  makeCastlingMove,
} from "./rules/castling";
import { isMoveIsPromotion } from "./rules/promotion/promition";
import {
  getlegalMoves,
  isKingInCheck,
  isKingInCheckMate,
} from "./rules/checksAndMates";
import { calcAllowedPieceMoves } from "./rules/moves";

export const useChessGame = () => {
  const [chessBoardData, setChessBoardData] = useState<ChessBoardDataT>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.boardState : createInitialBoardState();
    // return gameData ? gameData.boardState : createInitialBoardStateCastling();
  });
  const [boardHistory, setBoardHistory] = useState<BoardHistoryT[]>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.history : [];
  });
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieceType[]>(
    () => {
      const gameData = getGameDataToLS();
      return gameData ? gameData.capturedPieces : [];
    },
  );
  const [isFlipped, setIsFlipped] = useState<boolean>(() => {
    const flipped = getlocalStorageData("flipped");
    return flipped ? flipped : false;
  });
  const [turn, setTurn] = useState<ChessSideT>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.turn : "white";
  });
  const [checks, setChecks] = useState<ChessCheck[]>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.checks : [];
  });
  const [isCheckMate, setIsCheckMate] = useState<boolean>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.isCheckMate : false;
  });
  const [kingsCoords, setKingsCoords] = useState<{
    white: number[];
    black: number[];
  }>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.kingsCoords : KingsInitialPositions;
  });
  const [castlingRights, setCastlingRights] = useState<CastlingRights>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.castlingRights : createInitialCastlingRights();
  });
  const [selectedPiece, setSelectedPiece] = useState<{
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
    allowedMoves: number[][];
  } | null>(null);
  const [promotion, setPromotion] = useState<Promotion>({
    active: false,
    pieceInfo: null,
  });
  const getUpdatedCapturedPieces = (
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
  const changeSelectedPiecePosition = ({
    row,
    col,
  }: {
    row: number;
    col: number;
  }) => {
    if (!selectedPiece) return;
    const isKing = selectedPiece.type === "king";
    if (!selectedPiece.allowedMoves.some(([r, c]) => r === row && c === col))
      return;
    const updatedTurn = turn === "white" ? "black" : "white";
    if (isKing) {
      console.log([selectedPiece.side], [selectedPiece.row, selectedPiece.col]);
      setKingsCoords((prev) => {
        return {
          ...prev,
          [selectedPiece.side]: [row, col],
        };
      });
    }
    const updatedCastlingRight = getUpdateCastlingRights({
      castlingRights,
      movingPiece: {
        type: selectedPiece.type,
        side: selectedPiece.side,
        row: selectedPiece.row,
        col: selectedPiece.col,
      },
    });
    let updatedChessBoardData: ChessBoardDataT;
    const isCastling = isMoveIsCastling({
      row,
      col,
      type: selectedPiece.type,
      isKingMoved: castlingRights[selectedPiece.side].kingMoved,
    });
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
    if (isCastling) {
      updatedChessBoardData = makeCastlingMove({
        boardState: chessBoardData,
        row,
        col,
      });
    } else {
      updatedChessBoardData = getBoardAfterMove({
        boardState: chessBoardData,
        side: selectedPiece.side,
        type: selectedPiece.type,
        to: { row, col },
        from: { row: selectedPiece.row, col: selectedPiece.col },
      });
    }
    const newPositionData = chessBoardData[row][col];
    let updatedCP: CapturedPieceType[] = [];
    if (newPositionData !== "empty") {
      updatedCP = getUpdatedCapturedPieces(newPositionData, 1);
      setCapturedPieces(updatedCP);
      console.log(updatedCP);
      // setCapturedPieces((prev) => [...prev, newPositionData]);
    }
    const promotionPawn = isMoveIsPromotion({
      pieceInfo: { type: selectedPiece.type, side: selectedPiece.side },
      row,
      col,
    });
    if (
      promotionPawn &&
      capturedPieces.some(
        (piece) => piece.side === promotionPawn.side && piece.type !== "pawn",
      )
    ) {
      setPromotion({ pieceInfo: promotionPawn, active: true });
    }

    if (updatedCastlingRight) setCastlingRights(updatedCastlingRight);
    setChessBoardData(updatedChessBoardData);
    setTurn(updatedTurn);
    setBoardHistory(updatedBoardHistory);
    setSelectedPiece(null);
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
    console.log(checksData, isCheckAndMate);
    setIsCheckMate(isCheckAndMate);
    saveGameDataToLS({
      boardState: updatedChessBoardData,
      history: updatedBoardHistory,
      castlingRights: updatedCastlingRight || castlingRights,
      turn: updatedTurn,
      checks: checksData,
      isCheckMate: isCheckAndMate,
      capturedPieces: newPositionData !== "empty" ? updatedCP : capturedPieces,
      kingsCoords: isKing
        ? { ...kingsCoords, [selectedPiece.side]: [row, col] }
        : kingsCoords,
    });
    setChecks(checksData);
    triggerMoveAudio();
    if (chessBoardData[row][col] !== "empty") {
      console.log(chessBoardData[row][col]);
      triggerDeathAudio();
    }
  };
  const onCellClickHandler = ({
    cellStatus,
    idx,
  }: {
    cellStatus:
      | "empty"
      | {
          type: ChessPieceTypes;
          side: ChessSideT;
        };
    idx: string;
  }) => {
    if (!selectedPiece && cellStatus === "empty") return;
    else if (
      (!selectedPiece && cellStatus !== "empty") ||
      (selectedPiece &&
        cellStatus !== "empty" &&
        cellStatus.side === selectedPiece.side)
    ) {
      if (cellStatus.side !== turn) return;
      const allowedMoves = calcAllowedPieceMoves({
        boardState: chessBoardData,
        pieceType: cellStatus.type,
        side: cellStatus.side,
        row: Number(idx[0]),
        col: Number(idx[1]),
      });
      const { moves } = checkIsCastlingAllowed({
        boardState: chessBoardData,
        type: cellStatus.type,
        side: cellStatus.side,
        checks: checks,
        isCheckMate,
        castlingRight: castlingRights,
      });
      console.log(123, moves, castlingRights);
      const legalMoves = getlegalMoves({
        moves: allowedMoves,
        boardState: chessBoardData,
        pieceKing: kingsCoords[cellStatus.side],
        pieceInfo: {
          side: cellStatus.side,
          type: cellStatus.type,
          row: Number(idx[0]),
          col: Number(idx[1]),
        },
      });
      setSelectedPiece({
        side: cellStatus.side,
        type: cellStatus.type,
        row: Number(idx[0]),
        col: Number(idx[1]),
        allowedMoves: [...legalMoves, ...moves],
      });
    } else if (
      selectedPiece &&
      `${selectedPiece.row}${selectedPiece.col}` !== idx
    ) {
      if (selectedPiece && selectedPiece.side !== turn) return;

      changeSelectedPiecePosition({ row: +idx[0], col: +idx[1] });
    }
  };
  const reverseGameBoard = () => {
    const newIsFlipped = !isFlipped;
    setlocalStorageData("flipped", newIsFlipped);
    setIsFlipped(newIsFlipped);
  };
  const resetGameBoard = () => {
    setChessBoardData(createInitialBoardState());
    // setChessBoardData(createInitialBoardStateCastling());
    setCastlingRights(createInitialCastlingRights());
    setSelectedPiece(null);
    setTurn("white");
    setBoardHistory([]);
    setChecks([]);
    setIsCheckMate(false);
    setKingsCoords(KingsInitialPositions);
    setCapturedPieces([]);
    removeGameDataToLS();
  };
  const onClosePromotionModal = () =>
    setPromotion({ active: false, pieceInfo: null });
  const promotePawn = ({
    type,
    side,
  }: {
    type: ChessPieceTypes;
    side: ChessSideT;
  }) => {
    const pawn = promotion.pieceInfo;
    if (pawn && promotion.active) {
      const updatedChessBoard = structuredClone(chessBoardData);
      updatedChessBoard[pawn.row][pawn.col] = { type, side };
      const updatedBoardHistory = [...boardHistory];
      updatedBoardHistory[updatedBoardHistory.length - 1] = {
        ...updatedBoardHistory[updatedBoardHistory.length - 1],
        promotion: { type, side },
      };
      setChessBoardData(updatedChessBoard);
      const checksData = isKingInCheck({
        kings: kingsCoords,
        boardState: updatedChessBoard,
      });
      const isCheckAndMate = isKingInCheckMate({
        boardState: updatedChessBoard,
        checks: checksData,
      });
      console.log(checksData, isCheckAndMate);
      setIsCheckMate(isCheckAndMate);
      setBoardHistory(updatedBoardHistory);
      saveGameDataToLS({
        boardState: updatedChessBoard,
        history: updatedBoardHistory,
        turn,
        checks: checksData,
        isCheckMate: isCheckAndMate,
        capturedPieces,
        kingsCoords,
        castlingRights,
      });
      setChecks(checksData);
      const updatedCP = getUpdatedCapturedPieces({ side, type }, -1);
      console.log(updatedCP);
      setCapturedPieces(updatedCP);
    }
    onClosePromotionModal();
  };
  return {
    promotePawn,
    onClosePromotionModal,
    resetGameBoard,
    reverseGameBoard,
    onCellClickHandler,
    changeSelectedPiecePosition,
    capturedPieces,
    boardHistory,
    chessBoardData,
    selectedPiece,
    promotion,
    isCheckMate,
    isFlipped,
    checks,
    turn,
    kingsCoords,
  };
};
