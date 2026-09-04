import {
  getlocalStorageData,
  removelocalStorageData,
  setlocalStorageData,
} from "../services/storageService";
import type {
  BoardHistoryT,
  CapturedPieceType,
  CastlingRights,
  ChessBoardDataT,
  ChessCheck,
} from "../types";

export const saveGameDataToLS = (gameData: {
  boardState: ChessBoardDataT;
  turn: "white" | "black";
  capturedPieces: CapturedPieceType[];
  castlingRights: CastlingRights;
  history: BoardHistoryT[];
  checks: ChessCheck[];
  isCheckMate: boolean;
  kingsCoords: {
    white: number[];
    black: number[];
  };
}) => {
  setlocalStorageData("game_data", gameData);
};
export const getGameDataToLS = () => {
  const gameData: {
    castlingRights: CastlingRights;
    boardState: ChessBoardDataT;
    capturedPieces: CapturedPieceType[];
    turn: "white" | "black";
    history: BoardHistoryT[];
    checks: ChessCheck[];
    isCheckMate: boolean;
    kingsCoords: {
      white: number[];
      black: number[];
    };
  } | null = getlocalStorageData("game_data");
  return gameData;
};
export const removeGameDataToLS = () => {
  removelocalStorageData("game_data");
};
