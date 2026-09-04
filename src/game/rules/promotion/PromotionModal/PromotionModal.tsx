import DefaultModal from "../../../../shared/ui/Modals/DefaultModal";
import type {
  CapturedPieceType,
  ChessPieceTypes,
  ChessSideT,
} from "../../../../types";
import s from "./PromotionModal.module.scss";
import ChessPieceIcon from "../../../../shared/ui/ChessPieceIcon";

type PromotionModalT = {
  onClose: () => void;
  promotePawn: ({
    type,
    side,
  }: {
    type: ChessPieceTypes;
    side: ChessSideT;
  }) => void;
  capturedPieces: CapturedPieceType[];
  promotionPieceInfo: {
    type: ChessPieceTypes;
    side: ChessSideT;
    row: number;
    col: number;
  };
};

const PromotionModal = ({
  onClose,
  promotePawn,
  promotionPieceInfo,
  capturedPieces,
}: PromotionModalT) => {
  const currentSideCapturedP = capturedPieces.filter(
    (piece) => piece.side === promotionPieceInfo.side && piece.type !== "pawn",
  );
  const oppositeSide = promotionPieceInfo.side === "white" ? "black" : "white";
  console.log(capturedPieces);
  return (
    <DefaultModal onClose={onClose}>
      <div className={s.window}>
        <div className={s.window_list}>
          {currentSideCapturedP.map(({ type, side }) => (
            <div
              className={s.window_item}
              style={{ backgroundColor: oppositeSide }}
              onClick={() => promotePawn({ type, side })}
            >
              <ChessPieceIcon cellStatus={{ type, side }} size={50} />
            </div>
          ))}
        </div>
      </div>
    </DefaultModal>
  );
};

export default PromotionModal;
