import React from "react";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

import backgroundLight from "public/world/crops_and_chickens_background_light.png";
import backgroundDark from "public/world/crops_and_chickens_background_dark.png";

export const CropsAndChickensBackground: React.FC = ({ children }) => {
  const { isDarkMode } = useIsDarkMode();

  return (
    <div
      className="w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundColor: "#63c74d",
        backgroundImage: `url(${
          isDarkMode ? backgroundDark : backgroundLight
        })`,
        backgroundSize: `${192 * (window.innerWidth < 500 ? 3 : 4)}px`, // zoom level is not PIXEL_SCALE for base scene
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
};
