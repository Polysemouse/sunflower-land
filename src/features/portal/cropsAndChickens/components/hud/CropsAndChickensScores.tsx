import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import {
  getCropImage,
  getTotalCropsInGame,
} from "../../lib/cropsAndChickensUtils";
import { INDEX_TO_CROP } from "../../CropsAndChickensConstants";
import { SquareIcon } from "components/ui/SquareIcon";

const _isReady = (state: PortalMachineState) => state.matches("ready");
const _isPlaying = (state: PortalMachineState) => state.matches("playing");
const _inventory = (state: PortalMachineState) => state.context.inventory;
const _score = (state: PortalMachineState) => state.context.score;
const _harvestedCropIndexes = (state: PortalMachineState) =>
  state.context.harvestedCropIndexes;
const _compareHarvestedCropIndexes = (prev: number[], next: number[]) =>
  JSON.stringify(prev) === JSON.stringify(next);

export const CropsAndChickensScores: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isReady = useSelector(portalService, _isReady);
  const isPlaying = useSelector(portalService, _isPlaying);
  const inventory = useSelector(portalService, _inventory);
  const score = useSelector(portalService, _score);
  const harvestedCropIndexes = useSelector(
    portalService,
    _harvestedCropIndexes,
    _compareHarvestedCropIndexes,
  );

  const [previousScore, setPreviousScore] = useState(0);
  const [scoreDifference, setScoreDifference] = useState(0);
  const [previousInventory, setPreviousInventory] = useState(0);
  const [inventoryDifference, setInventoryDifference] = useState(0);
  const [cropIndex, setCropIndex] = useState<number>();

  // hide exit confirmation when game ends
  useEffect(() => {
    if (!isReady) return;

    setPreviousScore(0);
    setScoreDifference(0);
    setPreviousInventory(0);
    setInventoryDifference(0);
    setCropIndex(undefined);
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

  useEffect(() => {
    if (!isPlaying || harvestedCropIndexes.length === 0) return;

    const harvestedCropIndex =
      harvestedCropIndexes[harvestedCropIndexes.length - 1];
    setCropIndex(harvestedCropIndex);

    // create a timeout to reset harvested crop index after 2 seconds
    const timeout = setTimeout(() => {
      setCropIndex(undefined);
    }, 2000);

    // cleanup function to clear timeout if score changes before 2 seconds
    return () => clearTimeout(timeout);
  }, [harvestedCropIndexes]);

  const getDifferenceDisplay = (difference: number) => {
    if (!difference) return "";

    return `(${difference > 0 ? "+" : ""}${difference})`;
  };

  const getHarvestedCountDisplay = () => {
    if (cropIndex == undefined) return "";

    return `${harvestedCropIndexes.filter((i) => i === cropIndex).length}/${getTotalCropsInGame(INDEX_TO_CROP[cropIndex])}`;
  };

  return (
    <>
      <div className="relative">
        <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
        <div
          className="flex items-center space-x-2 text-xs text-white text-shadow"
          style={{
            width: "250px",
            paddingTop: "7px",
            paddingLeft: "3px",
          }}
        >
          <span>
            {t("crops-and-chickens.scoreColon", {
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
            width: "250px",
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

      {cropIndex !== undefined && (
        <div className="relative">
          <div className="h-12 w-full bg-black opacity-50 absolute coins-bb-hud-backdrop-reverse" />
          <div
            className="flex items-center space-x-2 text-xs text-white text-shadow"
            style={{
              width: "250px",
              paddingTop: "7px",
              paddingLeft: "3px",
            }}
          >
            <SquareIcon
              icon={getCropImage(INDEX_TO_CROP[cropIndex])}
              width={7}
            />
            <span>{getHarvestedCountDisplay()}</span>
          </div>
        </div>
      )}
    </>
  );
};
