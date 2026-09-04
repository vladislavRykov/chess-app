import React, { useEffect, useRef } from "react";
import s from "./HistoryBlock.module.scss";
import type { BoardHistoryT } from "../../types";
import ChessPieceIcon from "../../shared/ui/ChessPieceIcon";
import { convertCoordsToChessType } from "../../game/helpers";

type HistoryBlockT = {
  boardHistory: BoardHistoryT[];
};

const HistoryBlock = ({ boardHistory }: HistoryBlockT) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
  }, [boardHistory]);
  return (
    <div className={s.history}>
      <div ref={wrapperRef} className={s.history_wrapper}>
        {boardHistory.map(({ from, to, promotion, castling }) => {
          const fromChessCoords = convertCoordsToChessType(
            +from.coords[0],
            +from.coords[1],
          );
          const toChessCoords = convertCoordsToChessType(
            +to.coords[0],
            +to.coords[1],
          );
          return (
            <>
              <div className={s.history_record}>
                {`${fromChessCoords.boardX + fromChessCoords.boardY} `}
                <ChessPieceIcon
                  cellStatus={{
                    type: from.pieceInfo.type,
                    side: from.pieceInfo.side,
                  }}
                />
                {` сходил на ${toChessCoords.boardX + toChessCoords.boardY}`}
                {to.pieceInfo !== "empty" && (
                  <>
                    <span> и съел </span>
                    <ChessPieceIcon
                      cellStatus={{
                        type: to.pieceInfo.type,
                        side: to.pieceInfo.side,
                      }}
                    />
                  </>
                )}
                <div className={s.underline}></div>
              </div>
              {promotion && (
                <div className={s.history_record}>
                  {`${toChessCoords.boardX + toChessCoords.boardY} `}
                  <ChessPieceIcon
                    cellStatus={{
                      type: from.pieceInfo.type,
                      side: from.pieceInfo.side,
                    }}
                  />
                  <span> повысился до </span>
                  <ChessPieceIcon
                    cellStatus={{ type: promotion.type, side: promotion.side }}
                  />
                  <div className={s.underline}></div>
                </div>
              )}
              {castling && (
                <div className={s.history_record}>
                  {`${toChessCoords.boardX + toChessCoords.boardY} `}
                  <ChessPieceIcon
                    cellStatus={{
                      type: from.pieceInfo.type,
                      side: from.pieceInfo.side,
                    }}
                  />
                  <span> совершил рокировку</span>
                  <div className={s.underline}></div>
                </div>
              )}
            </>
          );
        })}
        {boardHistory.length === 0 && <div>Логи игры</div>}
      </div>
    </div>
  );
};

export default HistoryBlock;
