import React from "react";

import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

import arrowLeft from "assets/icons/arrow_left.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <OuterPanel
      className="fixed z-50"
      style={{
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    >
      <Button className="text-white text-sm" onClick={() => navigate(-1)}>
        <div className="flex flex-row items-center justify-center">
          <img
            className="mr-1 -mb-1"
            src={arrowLeft}
            alt="back-arrow"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <span className="ml-1 md:flex">Back</span>
        </div>
      </Button>
    </OuterPanel>
  );
};
