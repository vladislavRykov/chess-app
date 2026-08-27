import React, { type HTMLAttributes } from "react";
import type { ChessPieceTypes, ChessSideT } from "../../types";
import { FaChessPawn } from "react-icons/fa6";
import { FaChessKing } from "react-icons/fa6";
import { FaChessQueen } from "react-icons/fa6";
import { FaChessBishop } from "react-icons/fa6";
import { FaChessKnight } from "react-icons/fa6";
import { FaChessRook } from "react-icons/fa6";
import type { IconType } from "react-icons";

type ChessPieceIconT = HTMLAttributes<IconType> & {
  cellStatus:
    | {
        type: ChessPieceTypes;
        side: ChessSideT;
      }
    | "empty";
};

const ChessPieceIcon = ({ cellStatus, className }: ChessPieceIconT) => {
  if (cellStatus === "empty") return <></>;
  if (cellStatus.type === "pawn")
    return <FaChessPawn color={cellStatus.side} className={className} />;
  if (cellStatus.type === "knight")
    return <FaChessKnight color={cellStatus.side} className={className} />;
  if (cellStatus.type === "bishop")
    return <FaChessBishop color={cellStatus.side} className={className} />;
  if (cellStatus.type === "rook")
    return <FaChessRook color={cellStatus.side} className={className} />;
  if (cellStatus.type === "king")
    return <FaChessKing color={cellStatus.side} className={className} />;
  if (cellStatus.type === "queen")
    return <FaChessQueen color={cellStatus.side} className={className} />;
  return <div>ChessPieceIcon</div>;
};

export default ChessPieceIcon;
