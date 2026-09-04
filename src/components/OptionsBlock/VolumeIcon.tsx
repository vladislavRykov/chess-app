import React from "react";
import {
  IoVolumeHigh,
  IoVolumeLow,
  IoVolumeMedium,
  IoVolumeMute,
  IoVolumeOff,
} from "react-icons/io5";

const VolumeIcon = ({
  volume,
  isMuted,
  size,
  color,
}: {
  volume: number;
  isMuted: boolean;
  size?: string | number;
  color?: string;
}) => {
  if (isMuted) return <IoVolumeOff size={size} color={color} />;
  if (volume * 100 === 0) return <IoVolumeMute size={size} color={color} />;
  if (volume * 100 > 70) return <IoVolumeHigh size={size} color={color} />;
  if (volume * 100 > 30) return <IoVolumeMedium size={size} color={color} />;
  if (volume * 100 <= 30) return <IoVolumeLow size={size} color={color} />;
};

export default VolumeIcon;
