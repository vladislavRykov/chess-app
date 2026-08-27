import React from "react";
import s from "./HistoryBlock.module.scss";
import { convertCoordsToChessType } from "../../game/chessboard";
import type { BoardHistoryT } from "../../types";

type HistoryBlockT = {
  boardHistory: BoardHistoryT[];
};

const HistoryBlock = ({ boardHistory }: HistoryBlockT) => {
  return (
    <div className={s.history}>
      {boardHistory.map(({ from, to }) => {
        const fromChessCoords = convertCoordsToChessType(
          +from.coords[0],
          +from.coords[1],
        );
        const toChessCoords = convertCoordsToChessType(
          +to.coords[0],
          +to.coords[1],
        );
        return (
          <div>{`${fromChessCoords.boardX + fromChessCoords.boardY} ${from.pieceInfo.side} ${from.pieceInfo.type} сходил на ${toChessCoords.boardX + toChessCoords.boardY}${to.pieceInfo !== "empty" ? ` и съел ${to.pieceInfo.side + " " + to.pieceInfo.type}` : ""}`}</div>
        );
      })}
      {boardHistory.map(({ from, to }) => {
        const fromChessCoords = convertCoordsToChessType(
          +from.coords[0],
          +from.coords[1],
        );
        const toChessCoords = convertCoordsToChessType(
          +to.coords[0],
          +to.coords[1],
        );
        return (
          <div>{`${fromChessCoords.boardX + fromChessCoords.boardY} ${from.pieceInfo.side} ${from.pieceInfo.type} сходил на ${toChessCoords.boardX + toChessCoords.boardY}${to.pieceInfo !== "empty" ? ` и съел ${to.pieceInfo.side + " " + to.pieceInfo.type}` : ""}`}</div>
        );
      })}
      {boardHistory.map(({ from, to }) => {
        const fromChessCoords = convertCoordsToChessType(
          +from.coords[0],
          +from.coords[1],
        );
        const toChessCoords = convertCoordsToChessType(
          +to.coords[0],
          +to.coords[1],
        );
        return (
          <div>{`${fromChessCoords.boardX + fromChessCoords.boardY} ${from.pieceInfo.side} ${from.pieceInfo.type} сходил на ${toChessCoords.boardX + toChessCoords.boardY}${to.pieceInfo !== "empty" ? ` и съел ${to.pieceInfo.side + " " + to.pieceInfo.type}` : ""}`}</div>
        );
      })}
    </div>
  );
};

export default HistoryBlock;
