import Cell from "./Cell";
import s from "./Chessboard.module.scss";
import { boardLetters, boardNumbers, cellData } from "../../game/ui/constants";
import type {
  BoardHistoryT,
  ChessBoardDataT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
} from "../../types";
import { getRealCoords } from "../../game/helpers";

type ChessboardT = {
  chessBoardData: ChessBoardDataT;
  lastMove: BoardHistoryT | null;
  onCellClickHandler: ({
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
  }) => void;
  selectedPiece: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
    allowedMoves: number[][];
  } | null;
  isFlipped: boolean;
  turn: ChessSideT;
  checks: ChessCheck[];
};

const Chessboard = ({
  checks,
  turn,
  isFlipped,
  chessBoardData,
  onCellClickHandler,
  selectedPiece,
  lastMove,
}: ChessboardT) => {
  const FlippFriendlyBoardNums = isFlipped
    ? boardNumbers
    : [...boardNumbers].reverse();
  const FlippFriendlyBoardLetters = isFlipped
    ? [...boardLetters].reverse()
    : boardLetters;

  const chessboard = isFlipped
    ? [...chessBoardData].reverse().map((row) => [...row].reverse())
    : chessBoardData;
  return (
    <div className={s.chessboard_wrapper}>
      <div className={s.chessboard_topLetters}>
        {FlippFriendlyBoardLetters.map((letter) => (
          <div>{letter}</div>
        ))}
      </div>
      <div className={s.chessboard_bottomLetters}>
        {FlippFriendlyBoardLetters.map((letter) => (
          <div>{letter}</div>
        ))}
      </div>
      <div className={s.chessboard_rightNumbers}>
        {FlippFriendlyBoardNums.map((number) => (
          <div>{number}</div>
        ))}
      </div>
      <div className={s.chessboard_leftNumbers}>
        {FlippFriendlyBoardNums.map((number) => (
          <div>{number}</div>
        ))}
      </div>
      <div
        className={s.chessboard}
        style={{ gridTemplateColumns: `repeat(8, ${cellData.width}px)` }}
      >
        {chessboard.map((row, rowIdx) =>
          row.map((col, colIdx) => {
            const realIdxes = getRealCoords(rowIdx, colIdx, isFlipped);
            return (
              <Cell
                checks={checks}
                lastMove={lastMove}
                turn={turn}
                selectedPiece={selectedPiece}
                onCellClickHandler={onCellClickHandler}
                cellStatus={col}
                color={
                  (colIdx + rowIdx) % 2 === 1
                    ? cellData.color1
                    : cellData.color2
                }
                key={`${realIdxes[0]}${realIdxes[1]}`}
                idx={`${realIdxes[0]}${realIdxes[1]}`}
                width={cellData.width}
                height={cellData.height}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default Chessboard;
