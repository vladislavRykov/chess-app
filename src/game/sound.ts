const audio = new Audio("/sounds/piece_is_placed.mp3");

export const triggerMoveAudio = () => {
  audio.currentTime = 0;
  audio.play();
};
