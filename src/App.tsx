import s from "./App.module.scss";
import Chessboard from "./components/Chessboard/Chessboard";
import HistoryBlock from "./components/HistoryBlock/HistoryBlock";

import { useChessGame } from "./game/useChessGame";
import PromotionModal from "./game/rules/promotion/PromotionModal/PromotionModal";
import CapturedPiecesC from "./components/CapturedPiecesC/CapturedPiecesC";
import OptionsBlock from "./components/OptionsBlock/OptionsBlock";

function App() {
  const {
    isCheckMate,
    chessBoardData,
    selectedPiece,
    isFlipped,
    turn,
    checks,
    boardHistory,
    promotion,
    capturedPieces,
    onPromotionOptionClick,
    onClosePromotionModal,
    onCellClickHandler,
    reverseGameBoard,
    resetGameBoard,
  } = useChessGame();
  return (
    <main className={s.main}>
      <div className={s.main_wrapper}>
        <OptionsBlock
          resetGameBoard={resetGameBoard}
          reverseGameBoard={reverseGameBoard}
        />
        <div className={s.chessBoard}>
          <Chessboard
            checks={checks}
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
          <div className={s.chessBoard_turn} style={{ color: turn }}>
            {`Ход ${turn === "white" ? "Белых" : "Черных"}`}
            <span className={s.chessBoard_check}>
              {checks.length > 0 ? (isCheckMate ? ": Шах и мат" : ": Шах") : ""}
            </span>
          </div>
        </div>
        <div className={s.rightSide}>
          <HistoryBlock boardHistory={boardHistory} />
          <CapturedPiecesC capturedPieces={capturedPieces} />
        </div>
        {promotion.active && promotion.pieceInfo && (
          <PromotionModal
            promotionPieceInfo={promotion.pieceInfo}
            onClose={onClosePromotionModal}
            promotePawn={onPromotionOptionClick}
            capturedPieces={capturedPieces}
          />
        )}
      </div>
    </main>
  );
}

export default App;
