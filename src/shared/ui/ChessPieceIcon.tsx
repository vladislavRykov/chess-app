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
  size?: string | number;
  cellStatus:
    | {
        type: ChessPieceTypes;
        side: ChessSideT;
      }
    | "empty";
};

const ChessPieceIcon = ({ cellStatus, className, size }: ChessPieceIconT) => {
  if (cellStatus === "empty") return <></>;
  if (cellStatus.type === "pawn")
    return (
      <FaChessPawn size={size} color={cellStatus.side} className={className} />
    );
  if (cellStatus.type === "knight")
    return (
      <FaChessKnight
        size={size}
        color={cellStatus.side}
        className={className}
      />
    );
  if (cellStatus.type === "bishop")
    return (
      <FaChessBishop
        size={size}
        color={cellStatus.side}
        className={className}
      />
    );
  if (cellStatus.type === "rook")
    return (
      <FaChessRook size={size} color={cellStatus.side} className={className} />
    );
  if (cellStatus.type === "king")
    return (
      <FaChessKing size={size} color={cellStatus.side} className={className} />
    );
  if (cellStatus.type === "queen")
    return (
      <FaChessQueen size={size} color={cellStatus.side} className={className} />
    );
  return <div>ChessPieceIcon</div>;
};

export default ChessPieceIcon;
