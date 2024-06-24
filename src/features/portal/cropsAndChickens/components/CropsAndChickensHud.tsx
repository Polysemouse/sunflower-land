import React, { useContext, useEffect, useState } from "react";
import { useActor, useSelector } from "@xstate/react";
import { PortalContext } from "../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import worldIcon from "assets/icons/world.png";
import { goHome } from "features/portal/lib/portalUtil";
import { HudContainer } from "components/ui/HudContainer";
import { secondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { GAME_SECONDS } from "../CropsAndChickensConstants";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { setPrecision } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { PortalMachineState } from "../lib/cropsAndChickensMachine";

const _isPlaying = (state: PortalMachineState) => state.matches("playing");

export const CropsAndChickensHud: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const isPlaying = useSelector(portalService, _isPlaying);
  const { t } = useAppTranslation();

  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const { inventory, score, endAt, state } = portalState.context;
  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  const target = state?.minigames.prizes["crops-and-chickens"]?.score ?? 0;

  useEffect(() => {
    if (!isPlaying) {
      setShowExitConfirmation(false);
    }
  }, [isPlaying]);

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
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="vibrant">
            {t("crops-and-chickens.targetScore", {
              target: target,
            })}
          </Label>
          <div className="relative">
            <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
            <div
              className="flex items-center space-x-2 text-xs text-white"
              style={{
                width: "200px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.score", {
                  score: score,
                })}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
            <div
              className="flex items-center space-x-2 text-xs text-white"
              style={{
                width: "200px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.inventory", {
                  inventory: inventory,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col absolute space-y-1 items-end z-50 right-3 top-3 !text-[28px] text-stroke">
          <div className="flex items-center space-x-2 relative">
            <div className="h-9 w-full bg-black opacity-25 absolute sfl-hud-backdrop -z-10" />
            <span className="balance-text">
              {setPrecision(portalState.context.state!.balance).toString()}
            </span>
            <img
              src={sflIcon}
              alt="SFL"
              style={{
                width: 26,
              }}
            />
          </div>
        </div>

        <Label
          className="absolute"
          icon={SUNNYSIDE.icons.stopwatch}
          type="info"
          style={{
            top: `${PIXEL_SCALE * 16}px`,
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
            className="flex relative z-50 justify-center cursor-pointer hover:img-highlight"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              height: `${PIXEL_SCALE * 23}px`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isPlaying) {
                setShowExitConfirmation(true);
              } else {
                goHome();
              }
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
        <ConfirmationModal
          show={showExitConfirmation}
          onHide={() => setShowExitConfirmation(false)}
          messages={[t("crops-and-chickens.endGameConfirmation")]}
          onCancel={() => setShowExitConfirmation(false)}
          onConfirm={() => {
            portalService.send("END_GAME_EARLY");
            setShowExitConfirmation(false);
          }}
          confirmButtonLabel={t("crops-and-chickens.endGame")}
        />
      </HudContainer>
    </>
  );
};
