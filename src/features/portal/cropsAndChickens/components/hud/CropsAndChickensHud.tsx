import React, { useContext, useEffect, useState } from "react";
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
import { CropsAndChickensTimer } from "../CropsAndChickensTimer";
import { CropsAndChickensSettings } from "./CropsAndChickensSettings";
import { CropsAndChickensTravel } from "./CropsAndChickensTravel";

const _isReady = (state: PortalMachineState) => state.matches("ready");
const _isPlaying = (state: PortalMachineState) => state.matches("playing");
const _inventory = (state: PortalMachineState) => state.context.inventory;
const _score = (state: PortalMachineState) => state.context.score;
const _target = (state: PortalMachineState) =>
  state.context.state?.minigames.prizes["crops-and-chickens"]?.score ?? 0;
const _sflBalance = (state: PortalMachineState) =>
  state.context.state?.balance ?? new Decimal(0);

export const CropsAndChickensHud: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isReady = useSelector(portalService, _isReady);
  const isPlaying = useSelector(portalService, _isPlaying);
  const inventory = useSelector(portalService, _inventory);
  const score = useSelector(portalService, _score);
  const target = useSelector(portalService, _target);
  const sflBalance = useSelector(portalService, _sflBalance);

  const [previousScore, setPreviousScore] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);
  const [previousInventory, setPreviousInventory] = useState(0);
  const [inventoryDifference, setInventoryDifference] = useState(0);

  // hide exit confirmation when game ends
  useEffect(() => {
    if (!isReady) return;

    setPreviousScore(0);
    setScoreDifference(0);
    setPreviousInventory(0);
    setInventoryDifference(0);
  }, [isReady]);

  useEffect(() => {
    if (!isPlaying) return;

    setScoreDifference(score - previousScore);
    setPreviousScore(score);

    // create a timeout to reset score difference after 2 seconds
    const timeout = setTimeout(() => {
      setScoreDifference(0);
    }, 2000);

    // cleanup function to clear timeout if score changes before 2 seconds
    return () => clearTimeout(timeout);
  }, [score]);

  useEffect(() => {
    if (!isPlaying) return;

    setInventoryDifference(inventory - previousInventory);
    setPreviousInventory(inventory);

    // create a timeout to reset score difference after 2 seconds
    const timeout = setTimeout(() => {
      setInventoryDifference(0);
    }, 2000);

    // cleanup function to clear timeout if score changes before 2 seconds
    return () => clearTimeout(timeout);
  }, [inventory]);

  const getDifferenceDisplay = (difference: number) => {
    if (!difference) return "";

    return `(${difference > 0 ? "+" : ""}${difference})`;
  };

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
              className="flex items-center space-x-2 text-xs text-white text-shadow"
              style={{
                width: "200px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.score", {
                  score: previousScore,
                })}
              </span>
              <span>{getDifferenceDisplay(scoreDifference)}</span>
            </div>
          </div>
          <div className="relative">
            <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
            <div
              className="flex items-center space-x-2 text-xs text-white text-shadow"
              style={{
                width: "200px",
                paddingTop: "7px",
                paddingLeft: "3px",
              }}
            >
              <span>
                {t("crops-and-chickens.inventory", {
                  inventory: previousInventory,
                })}
              </span>
              <span>{getDifferenceDisplay(inventoryDifference)}</span>
            </div>
          </div>
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
      </HudContainer>
    </>
  );
};
