import React from "react";

import grassland from "assets/brand/green_bg.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const Grassland: React.FC = ({ children }) => {
  return (
    <div
      className="w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundColor: "#63c74d",
        backgroundImage: `url(${grassland})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
};
