import type { CapturedPieceType } from "../../types";
import ChessPieceIcon from "../../shared/ui/ChessPieceIcon";
import s from "./CapturedPiecesC.module.scss";

type CapturedPiecesC = {
  capturedPieces: CapturedPieceType[];
};

const CapturedPiecesC = ({ capturedPieces }: CapturedPiecesC) => {
  const whiteSide = capturedPieces
    .filter((piece) => piece.side === "white")
    .sort((a, b) => a.type.localeCompare(b.type));
  const blackSide = capturedPieces
    .filter((piece) => piece.side === "black")
    .sort((a, b) => a.type.localeCompare(b.type));
  return (
    <div className={s.capturedBlock}>
      <h2 className={s.capturedBlock_title}>Захваченные фигуры</h2>
      {whiteSide.length > 0 && (
        <div className={s.capturedBlock_list}>
          {whiteSide.map((whitePiece) => (
            <span className={s.capturedBlock_item}>
              <ChessPieceIcon
                cellStatus={{ type: whitePiece.type, side: whitePiece.side }}
              />
              <span className={s.capturedBlock_count}>
                {`${whitePiece.count > 1 ? ` x${whitePiece.count}` : ""}`}
              </span>
            </span>
          ))}
        </div>
      )}
      {blackSide.length > 0 && (
        <div className={s.capturedBlock_list}>
          {blackSide.map((blackPiece) => (
            <span className={s.capturedBlock_item}>
              <ChessPieceIcon
                cellStatus={{ type: blackPiece.type, side: blackPiece.side }}
              />
              <span className={s.capturedBlock_count}>
                {`${blackPiece.count > 1 ? ` x${blackPiece.count}` : ""}`}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CapturedPiecesC;
