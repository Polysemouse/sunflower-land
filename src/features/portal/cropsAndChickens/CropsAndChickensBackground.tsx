import React from "react";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

import backgroundLight from "public/crops-and-chickens/crops_and_chickens_background_light.png";
import backgroundDark from "public/crops-and-chickens/crops_and_chickens_background_dark.png";
import { useIsZoomOut } from "./hooks/useIsZoomOut";
import { ZOOM_OUT_SCALE } from "./CropsAndChickensConstants";

export const CropsAndChickensBackground: React.FC = ({ children }) => {
  const { isDarkMode } = useIsDarkMode();
  const { isZoomOut } = useIsZoomOut();

  const zoomScale = isZoomOut
    ? ZOOM_OUT_SCALE
    : window.innerWidth < 500
      ? 3
      : 4;

  return (
    <div
      className="w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundColor: "#63c74d",
        backgroundImage: `url(${
          isDarkMode ? backgroundDark : backgroundLight
        })`,
        backgroundSize: `${192 * zoomScale}px`, // zoom level is not PIXEL_SCALE for base scene
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
};
