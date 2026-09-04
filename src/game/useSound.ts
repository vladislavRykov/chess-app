import { useState } from "react";
import { changeAllAudioVolume, setMutedAllAudioVolume } from "./sound";
import {
  getlocalStorageData,
  setlocalStorageData,
} from "../services/storageService";

export const useSound = () => {
  const [volume, setVolume] = useState(() => {
    const storageVolume = getlocalStorageData("game_volume");
    return storageVolume ? storageVolume : 0.5;
  });
  const [isMuted, setIsMuted] = useState(false);

  const setAllVolume = (value: number) => {
    changeAllAudioVolume(value);
    setVolume(value);
    setlocalStorageData("game_volume", value);
  };
  const setMutedAllVolume = (value: boolean) => {
    setMutedAllAudioVolume(value);
    setIsMuted(value);
  };

  return { volume, isMuted, setVolume, setAllVolume, setMutedAllVolume };
};
