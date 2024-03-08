import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { PortalContext } from "../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";
import { goHome } from "../lib/portalUtil";
import { HudContainer } from "components/ui/HudContainer";
import { InnerPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import { SquareIcon } from "components/ui/SquareIcon";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { GAME_SECONDS } from "../CropsAndChickensConstants";
import { ITEM_DETAILS } from "features/game/types/images";

export const CropsAndChickensHud: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const travelHome = () => {
    goHome();
  };

  const { inventoryScore, depositedScore, endAt } = portalState.context;
  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  return (
    <>
      <HudContainer>
        <InnerPanel
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 3}px`,
            right: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <div className="flex items-center">
            <SquareIcon icon={ITEM_DETAILS["Pirate Bounty"].image} width={16} />
            <span className="text-sm mx-2">{depositedScore}</span>
          </div>
          <div className="flex items-center">
            <SquareIcon icon={SUNNYSIDE.icons.basket} width={16} />
            <span className="text-sm mx-2">{inventoryScore}</span>
          </div>
        </InnerPanel>

        <InnerPanel
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <div className="flex items-center">
            <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={16} />
            <span className="text-sm mx-2">
              {secondsToString(secondsLeft, {
                length: "full",
              })}
            </span>
          </div>
        </InnerPanel>
        <div
          className="fixed z-50 flex flex-col justify-between"
          style={{
            left: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <div
            id="deliveries"
            className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              height: `${PIXEL_SCALE * 23}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              travelHome();
            }}
          >
            <img
              src={SUNNYSIDE.ui.round_button}
              className="absolute"
              style={{
                width: `${PIXEL_SCALE * 22}px`,
              }}
            />
            <img
              src={worldIcon}
              style={{
                width: `${PIXEL_SCALE * 12}px`,
                left: `${PIXEL_SCALE * 5}px`,
                top: `${PIXEL_SCALE * 4}px`,
              }}
              className="absolute"
            />
          </div>
        </div>
      </HudContainer>
    </>
  );
};
