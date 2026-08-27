import {
  getlocalStorageData,
  removelocalStorageData,
  setlocalStorageData,
} from "../services/storageService";
import type { BoardHistoryT, ChessBoardDataT } from "../types";

export const saveGameDataToLS = (gameData: {
  boardState: ChessBoardDataT;
  turn: "white" | "black";
  history: BoardHistoryT[];
}) => {
  setlocalStorageData("game_data", gameData);
};
export const getGameDataToLS = () => {
  const gameData: {
    boardState: ChessBoardDataT;
    turn: "white" | "black";
    history: BoardHistoryT[];
  } | null = getlocalStorageData("game_data");
  return gameData;
};
export const removeGameDataToLS = () => {
  removelocalStorageData("game_data");
};
