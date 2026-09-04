import s from "./Chessboard.module.scss";
import type {
  BoardHistoryT,
  ChessCheck,
  ChessPieceTypes,
  ChessSideT,
} from "../../types";
import {
  CHECK_HIGHLIGHT_COLOR,
  HIGHLIGHT_COLOR,
  LAST_MOVE_HIGHLIGHT_COLOR,
} from "../../game/ui/constants";
import ChessPieceIcon from "../../shared/ui/ChessPieceIcon";

type CellT = {
  color: string;
  idx: string;
  width: number;
  height: number;
  cellStatus:
    | {
        type: ChessPieceTypes;
        side: ChessSideT;
      }
    | "empty";
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
  turn: ChessSideT;
  lastMove: BoardHistoryT | null;
  checks: ChessCheck[];
};

const Cell = ({
  checks,
  lastMove,
  turn,
  color,
  idx,
  width,
  height,
  cellStatus,
  selectedPiece,
  onCellClickHandler,
}: CellT) => {
  const ifItsLastMoveCell =
    lastMove && (lastMove.from.coords === idx || lastMove.to.coords === idx);
  const row = Number(idx[0]);
  const col = Number(idx[1]);
  const isInAllowedMoves = Boolean(
    selectedPiece &&
    selectedPiece.allowedMoves.some(([r, c]) => r === row && c === col),
  );
  const isKingOrAttacker = checks.some(
    (check) =>
      (check.attaker.row === row && check.attaker.col === col) ||
      (check.king.row === row && check.king.col === col),
  );
  return (
    <div
      onClick={() => onCellClickHandler({ cellStatus, idx })}
      className={s.cell}
      style={{
        backgroundColor: color,
        width,
        height,
        cursor:
          cellStatus === "empty" || turn !== cellStatus.side
            ? "default"
            : "pointer",
      }}
    >
      {isInAllowedMoves && (
        <div
          className={s.cell_highligher}
          style={{ backgroundColor: HIGHLIGHT_COLOR }}
        ></div>
      )}
      {ifItsLastMoveCell && (
        <div
          className={s.cell_highligher}
          style={{ backgroundColor: LAST_MOVE_HIGHLIGHT_COLOR }}
        ></div>
      )}
      {isKingOrAttacker && !isInAllowedMoves && (
        <div
          className={s.cell_highligher}
          style={{ backgroundColor: CHECK_HIGHLIGHT_COLOR }}
        ></div>
      )}
      <ChessPieceIcon className={s.cell_img} cellStatus={cellStatus} />
    </div>
  );
};

export default Cell;
