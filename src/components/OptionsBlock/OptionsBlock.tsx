import React from "react";
import s from "./OptionsBlock.module.scss";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { AiOutlineRotateLeft } from "react-icons/ai";
import { useSound } from "../../game/useSound";
import VolumeIcon from "./VolumeIcon";
import cn from "classnames";

type resetGameBoard = {
  reverseGameBoard: () => void;
  resetGameBoard: () => void;
};

const OptionsBlock = ({ reverseGameBoard, resetGameBoard }: resetGameBoard) => {
  const { volume, isMuted, setAllVolume, setMutedAllVolume } = useSound();
  console.log(isMuted);
  return (
    <div className={s.optionsBlock}>
      <button
        title="Развернуть доску"
        className={s.optionsBlock_button}
        onClick={reverseGameBoard}
      >
        <AiOutlineRotateLeft className={s.optionsBlock_icon} />
      </button>
      <button
        title="Начать сначала"
        className={s.optionsBlock_button}
        onClick={resetGameBoard}
      >
        <FaArrowRotateLeft className={s.optionsBlock_icon} />
      </button>
      <div className={s.volume}>
        <button
          title="Заглушить"
          className={s.optionsBlock_button}
          onClick={() => setMutedAllVolume(!isMuted)}
        >
          <VolumeIcon isMuted={isMuted} volume={volume} />
        </button>
        <input
          value={volume * 100}
          min={0}
          max={100}
          onChange={(e) => {
            setAllVolume(+e.target.value / 100);
          }}
          className={s.volume_input}
          type="range"
        />
      </div>
    </div>
  );
};

export default OptionsBlock;
