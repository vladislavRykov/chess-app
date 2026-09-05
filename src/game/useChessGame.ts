import { useState } from "react";
import type {
  BoardHistoryT,
  CapturedPieceType,
  CastlingRights,
  CellType,
  ChessBoardDataT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
  Promotion,
  SelectedPieceType,
} from "../types";

import {
  getGameDataToLS,
  removeGameDataToLS,
  saveGameDataToLS,
} from "./localStorage";
import { triggerMoveAudio } from "./sound";
import {
  getlocalStorageData,
  setlocalStorageData,
} from "../services/storageService";
import {
  createInitialBoardState,
  createInitialCastlingRights,
  KingsInitialPositions,
} from "./rules/state";
import { checkIsCastlingAllowed } from "./rules/castling";
import { getlegalMoves } from "./rules/checksAndMates";
import { calcAllowedPieceMoves } from "./rules/moves";
import { getNextGameState } from "./GetNextGameState";
import { getBoardAfterPromotion } from "./rules/promotion/promition";

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
  const [selectedPiece, setSelectedPiece] = useState<SelectedPieceType | null>(
    null,
  );
  const [promotion, setPromotion] = useState<Promotion>({
    active: false,
    pieceInfo: null,
  });

  const changeSelectedPiecePosition = ({
    selectedPiece,
    row,
    col,
  }: {
    selectedPiece: SelectedPieceType;
    row: number;
    col: number;
  }) => {
    if (!selectedPiece.allowedMoves.some(([r, c]) => r === row && c === col))
      return;
    const {
      checksData,
      isCheckAndMate,
      updatedCP,
      updatedChessBoardData,
      updatedBoardHistory,
      updatedTurn,
      updatedCastlingRight,
      promotionData,
      updatedKingCoords,
    } = getNextGameState({
      capturedPieces,
      turn,
      row,
      col,
      boardHistory,
      kingsCoords,
      chessBoardData,
      selectedPiece,
      castlingRights,
    });

    //set States
    if (updatedKingCoords) setKingsCoords(updatedKingCoords);
    if (updatedCastlingRight) setCastlingRights(updatedCastlingRight);
    if (promotionData) setPromotion(promotionData);
    if (updatedCP) setCapturedPieces(updatedCP);
    setChessBoardData(updatedChessBoardData);
    setTurn(updatedTurn);
    setBoardHistory(updatedBoardHistory);
    setSelectedPiece(null);
    setIsCheckMate(isCheckAndMate);
    setChecks(checksData);

    //Save to LS
    saveGameDataToLS({
      boardState: updatedChessBoardData,
      history: updatedBoardHistory,
      castlingRights: updatedCastlingRight || castlingRights,
      turn: updatedTurn,
      checks: checksData,
      isCheckMate: isCheckAndMate,
      capturedPieces: updatedCP || capturedPieces,
      kingsCoords: updatedKingCoords || kingsCoords,
    });

    //Audio effects
    triggerMoveAudio();
    // if (chessBoardData[row][col] !== "empty") {
    //   triggerDeathAudio();
    // }
  };
  const selectPiece = (
    cellStatus: {
      type: ChessPieceTypes;
      side: ChessSideT;
    },
    idx: string,
  ) => {
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
  };
  const onCellClickHandler = ({
    cellStatus,
    idx,
  }: {
    cellStatus: CellType;
    idx: string;
  }) => {
    if (!selectedPiece && cellStatus === "empty") return;
    else if (cellStatus !== "empty" && cellStatus.side === turn) {
      selectPiece(cellStatus, idx);
    } else if (
      selectedPiece &&
      `${selectedPiece.row}${selectedPiece.col}` !== idx
    ) {
      changeSelectedPiecePosition({
        selectedPiece,
        row: +idx[0],
        col: +idx[1],
      });
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
  const onPromotionOptionClick = ({
    type,
    side,
  }: {
    type: ChessPieceTypes;
    side: ChessSideT;
  }) => {
    const pawn = promotion.pieceInfo;
    const replacement = { type, side };
    if (pawn && promotion.active) {
      const {
        updatedBoardHistory,
        isCheckAndMate,
        updatedChessBoard,
        updatedCP,
        checksData,
      } = getBoardAfterPromotion({
        chessBoardData,
        choosedReplacement: replacement,
        promotedPawn: pawn,
        kingsCoords,
        capturedPieces,
        boardHistory,
      });

      setChessBoardData(updatedChessBoard);
      setIsCheckMate(isCheckAndMate);
      setBoardHistory(updatedBoardHistory);
      setChecks(checksData);
      setCapturedPieces(updatedCP);
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
    }
    onClosePromotionModal();
  };
  return {
    onPromotionOptionClick,
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
