import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { setPrecision } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import Decimal from "decimal.js-light";
import { CropsAndChickensTimer } from "./CropsAndChickensTimer";
import { CropsAndChickensSettings } from "./CropsAndChickensSettings";
import { CropsAndChickensTravel } from "./CropsAndChickensTravel";
import { CropsAndChickensScores } from "./CropsAndChickensScores";
import classNames from "classnames";

const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;
const _target = (state: PortalMachineState) =>
  state.context.state?.minigames.prizes["crops-and-chickens"]?.score ?? 0;
const _sflBalance = (state: PortalMachineState) =>
  state.context.state?.balance ?? new Decimal(0);

export const CropsAndChickensHud: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isJoystickActive = useSelector(portalService, _isJoystickActive);
  const target = useSelector(portalService, _target);
  const sflBalance = useSelector(portalService, _sflBalance);

  return (
    <HudContainer>
      <div
        className={classNames({
          "pointer-events-none": isJoystickActive,
        })}
      >
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
          <CropsAndChickensScores />
        </div>

        <div className="flex flex-col absolute space-y-1 items-end z-50 right-3 top-3 !text-[28px] text-stroke">
          <div className="flex items-center space-x-1 relative">
            <div className="h-9 w-full bg-black opacity-25 absolute sfl-hud-backdrop -z-10" />
            <span className="balance-text">
              {setPrecision(sflBalance).toString()}
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

        <CropsAndChickensTimer />
        <CropsAndChickensTravel />
        <CropsAndChickensSettings />
      </div>
    </HudContainer>
  );
};
