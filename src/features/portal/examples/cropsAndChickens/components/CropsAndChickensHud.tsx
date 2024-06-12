import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { PortalContext } from "../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";
import { goHome } from "../lib/portalUtil";
import { HudContainer } from "components/ui/HudContainer";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { GAME_SECONDS } from "../CropsAndChickensConstants";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CropsAndChickensHud: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const { t } = useAppTranslation();

  const travelHome = () => {
    goHome();
  };

  const { inventoryScore, depositedScore, endAt } = portalState.context;
  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  const target = 1000;

  return (
    <>
      <HudContainer>
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 6}px`,
          }}
        >
          {!!target && (
            <Label icon={SUNNYSIDE.resource.pirate_bounty} type="vibrant">
              {t("crops-and-chickens.targetScore", {
                target: target,
              })}
            </Label>
          )}
          <div className="relative">
            <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
            <div
              className="flex items-center space-x-2 text-xs text-white"
              style={{
                width: "180px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.score", {
                  score: depositedScore,
                })}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
            <div
              className="flex items-center space-x-2 text-xs text-white"
              style={{
                width: "180px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.inventory", {
                  inventory: inventoryScore,
                })}
              </span>
            </div>
          </div>
        </div>

        <Label
          className="absolute"
          icon={SUNNYSIDE.icons.stopwatch}
          type="info"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            right: `${PIXEL_SCALE * 6}px`,
          }}
        >
          {secondsToString(secondsLeft, {
            length: "full",
          })}
        </Label>

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
