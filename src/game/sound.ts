import { getlocalStorageData } from "../services/storageService";

const moveAudio = new Audio("/chess-app/sounds/piece_is_placed.mp3");
const deathSound = new Audio("/chess-app/sounds/umineko-door.mp3");
const storageVolume = getlocalStorageData("game_volume");
deathSound.volume = storageVolume !== null ? storageVolume / 10 : 0.05;
moveAudio.volume = storageVolume !== null ? storageVolume : 0.5;

export const triggerMoveAudio = () => {
  moveAudio.currentTime = 0;
  moveAudio.play();
};
export const triggerDeathAudio = () => {
  deathSound.currentTime = 0;
  deathSound.play();
};

export const changeAllAudioVolume = (value: number) => {
  deathSound.volume = value / 10;
  moveAudio.volume = value;
};
export const setMutedAllAudioVolume = (value: boolean) => {
  deathSound.muted = value;
  moveAudio.muted = value;
};
