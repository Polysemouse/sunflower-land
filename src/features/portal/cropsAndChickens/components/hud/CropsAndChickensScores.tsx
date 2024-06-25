import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";

const _isReady = (state: PortalMachineState) => state.matches("ready");
const _isPlaying = (state: PortalMachineState) => state.matches("playing");
const _inventory = (state: PortalMachineState) => state.context.inventory;
const _score = (state: PortalMachineState) => state.context.score;

export const CropsAndChickensScores: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isReady = useSelector(portalService, _isReady);
  const isPlaying = useSelector(portalService, _isPlaying);
  const inventory = useSelector(portalService, _inventory);
  const score = useSelector(portalService, _score);

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
    </>
  );
};
