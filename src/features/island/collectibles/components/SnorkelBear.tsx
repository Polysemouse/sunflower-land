import React from "react";

import snorkelBear from "assets/sfts/bears/snorkel_bear.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SnorkelBear: React.FC = () => {
  return (
    <>
      <img
        src={snorkelBear}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Snorkel Bear"
      />
    </>
  );
};
