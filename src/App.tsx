import { useState } from "react";
import s from "./App.module.scss";
import Chessboard from "./components/Chessboard/Chessboard";
import type {
  BoardHistoryT,
  ChessBoardDataT,
  ChessPieceTypes,
  ChessSideT,
} from "./types";
import { initialBoardState } from "./game/chessboard";
import { calcAllowedPieceMoves } from "./game/rules";
import HistoryBlock from "./components/HistoryBlock/HistoryBlock";
import { triggerMoveAudio } from "./game/sound";
import {
  getGameDataToLS,
  removeGameDataToLS,
  saveGameDataToLS,
} from "./game/localStorage";

function App() {
  const [chessBoardData, setChessBoardData] = useState<ChessBoardDataT>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.boardState : initialBoardState;
  });
  const [boardHistory, setBoardHistory] = useState<BoardHistoryT[]>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.history : [];
  });
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [turn, setTurn] = useState<ChessSideT>(() => {
    const gameData = getGameDataToLS();
    return gameData ? gameData.turn : "white";
  });
  const [selectedPiece, setSelectedPiece] = useState<{
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
    allowedMoves: number[][];
  } | null>(null);

  const changeSelectedPiecePosition = ({
    row,
    col,
  }: {
    row: number;
    col: number;
  }) => {
    if (!selectedPiece) return;
    const allowedMoves = calcAllowedPieceMoves({
      boardState: chessBoardData,
      pieceType: selectedPiece.type,
      side: selectedPiece.side,
      row: selectedPiece.row,
      col: selectedPiece.col,
    });
    if (!allowedMoves.some(([r, c]) => r === row && c === col)) return;
    const updatedChessBoardData = chessBoardData.map((boardRow, rowIdx) => {
      return boardRow.map((cellData, colIdx) => {
        if (rowIdx === row && colIdx === col) {
          return {
            type: selectedPiece.type,
            side: selectedPiece.side,
          };
        }
        if (rowIdx === selectedPiece.row && colIdx === selectedPiece.col) {
          return "empty";
        }
        return cellData;
      });
    });
    const updatedTurn = turn === "white" ? "black" : "white";
    const updatedBoardHistory = [
      ...boardHistory,
      {
        from: {
          pieceInfo: { type: selectedPiece.type, side: selectedPiece.side },
          coords: `${selectedPiece.row}${selectedPiece.col}`,
        },
        to: { pieceInfo: chessBoardData[row][col], coords: `${row}${col}` },
      },
    ];
    setChessBoardData(updatedChessBoardData);
    setTurn(updatedTurn);
    setBoardHistory(updatedBoardHistory);
    setSelectedPiece(null);
    saveGameDataToLS({
      boardState: updatedChessBoardData,
      history: updatedBoardHistory,
      turn: updatedTurn,
    });
    triggerMoveAudio();
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

      setSelectedPiece({
        side: cellStatus.side,
        type: cellStatus.type,
        row: Number(idx[0]),
        col: Number(idx[1]),
        allowedMoves: calcAllowedPieceMoves({
          boardState: chessBoardData,
          pieceType: cellStatus.type,
          side: cellStatus.side,
          row: Number(idx[0]),
          col: Number(idx[1]),
        }),
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
    setIsFlipped((prev) => !prev);
  };
  const resetGameBoard = () => {
    setChessBoardData(initialBoardState);
    setSelectedPiece(null);
    setTurn("white");
    setBoardHistory([]);
    setIsFlipped(false);
    removeGameDataToLS();
  };

  return (
    <main className={s.main}>
      <div className={s.chessBoard}>
        <Chessboard
          lastMove={
            boardHistory.length - 1 in boardHistory
              ? boardHistory[boardHistory.length - 1]
              : null
          }
          turn={turn}
          isFlipped={isFlipped}
          selectedPiece={selectedPiece}
          chessBoardData={chessBoardData}
          onCellClickHandler={onCellClickHandler}
        />
        <div
          className={s.chessBoard_turn}
          style={{ color: turn }}
        >{`Ход ${turn === "white" ? "Белых" : "Черных"}`}</div>
      </div>
      <HistoryBlock boardHistory={boardHistory} />
      <button className={s.chessBoard_reverse} onClick={reverseGameBoard}>
        Развернуть доску
      </button>
      <button className={s.chessBoard_reset} onClick={resetGameBoard}>
        Начать заного
      </button>
    </main>
  );
}

export default App;
