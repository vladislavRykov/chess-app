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
  getBoardAfterMove,
  getUpdateCastlingRights,
  getUpdatedCapturedPieces,
} from "./helpers";
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

    const isKing = selectedPiece.type === "king";
    const updatedTurn = turn === "white" ? "black" : "white";
    const updatedCastlingRight = getUpdateCastlingRights({
      castlingRights,
      movingPiece: {
        type: selectedPiece.type,
        side: selectedPiece.side,
        row: selectedPiece.row,
        col: selectedPiece.col,
      },
    });
    if (updatedCastlingRight) setCastlingRights(updatedCastlingRight);

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
    if (isKing) {
      setKingsCoords((prev) => {
        return {
          ...prev,
          [selectedPiece.side]: [row, col],
        };
      });
    }
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
    let updatedCP: CapturedPieceType[] = [];
    const newPositionData = chessBoardData[row][col];
    if (newPositionData !== "empty") {
      updatedCP = getUpdatedCapturedPieces(capturedPieces, newPositionData, 1);
      setCapturedPieces(updatedCP);
    }
    const isPromotion = isMoveIsPromotion({
      pieceInfo: { type: selectedPiece.type, side: selectedPiece.side },
      row,
    });
    const isCapturedPiecesNotOnlyPawns = capturedPieces.some(
      (piece) => piece.side === selectedPiece.side && piece.type !== "pawn",
    );
    if (isPromotion && isCapturedPiecesNotOnlyPawns) {
      const promotionPieceInfo = {
        type: selectedPiece.type,
        side: selectedPiece.side,
        row,
        col,
      };
      setPromotion({ pieceInfo: promotionPieceInfo, active: true });
    }

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

    //States
    // if (updatedCastlingRight) setCastlingRights(updatedCastlingRight);
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
      capturedPieces: newPositionData !== "empty" ? updatedCP : capturedPieces,
      kingsCoords: isKing
        ? { ...kingsCoords, [selectedPiece.side]: [row, col] }
        : kingsCoords,
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
      const updatedCP = getUpdatedCapturedPieces(
        capturedPieces,
        { side, type },
        -1,
      );
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
