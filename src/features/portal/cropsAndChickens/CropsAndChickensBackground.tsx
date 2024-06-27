import React from "react";

import background from "public/world/crops_and_chickens_background.png";

export const CropsAndChickensBackground: React.FC = ({ children }) => {
  return (
    <div
      className="w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundColor: "#63c74d",
        backgroundImage: `url(${background})`,
        backgroundSize: `${192 * (window.innerWidth < 500 ? 3 : 4)}px`, // zoom level is not PIXEL_SCALE for base scene
        imageRendering: "pixelated",
      }}
    >
      {children}
    </div>
  );
};
