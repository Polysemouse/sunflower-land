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

    return `${difference > 0 ? "+" : ""}${difference}`;
  };

  const getHarvestedCountDisplay = () => {
    if (cropIndex == undefined) return "";

    return `${harvestedCropIndexes.filter((i) => i === cropIndex).length}/${getTotalCropsInGame(INDEX_TO_CROP[cropIndex])}`;
  };

  return (
    <div className="relative flex flex-col gap-1 mt-1 w-fit">
      <div className="relative flex sm:flex-col items-start justify-between gap-5 sm:gap-0 text-xs text-white text-shadow bg-[#0000007f] px-2 py-1 rounded">
        <span>{t("crops-and-chickens.scoreColon")}</span>
        <div className="flex flex-row items-center justify-between sm:w-full gap-2 sm:gap-5">
          <span className="sm:text-2xl">{previousScore}</span>
          {!!scoreDifference && (
            <div className="absolute sm:static h-full right-0 sm:mt-1">
              <span className="absolute sm:static h-full left-2 bg-[#0000007f] sm:bg-transparent px-2 py-1 sm:px-0 sm:py-0 rounded">
                {getDifferenceDisplay(scoreDifference)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex sm:flex-col items-start justify-between gap-5 sm:gap-0 text-xs text-white text-shadow bg-[#0000007f] px-2 py-1 rounded">
        <span>{t("crops-and-chickens.inventoryColon")}</span>
        <div className="flex flex-row items-center justify-between sm:w-full gap-2 sm:gap-5">
          <span className="sm:text-2xl">{previousInventory}</span>
          {!!inventoryDifference && (
            <div className="absolute sm:static h-full right-0 sm:mt-1">
              <span className="absolute sm:static h-full left-2 bg-[#0000007f] sm:bg-transparent px-2 py-1 sm:px-0 sm:py-0 rounded">
                {getDifferenceDisplay(inventoryDifference)}
              </span>
            </div>
          )}
        </div>
      </div>

      {cropIndex !== undefined && (
        <div className="flex flex-row items-center gap-2 text-xs text-white text-shadow bg-[#0000007f] px-2 py-1 rounded">
          <SquareIcon icon={getCropImage(INDEX_TO_CROP[cropIndex])} width={7} />
          <span>{getHarvestedCountDisplay()}</span>
        </div>
      )}
    </div>
  );
};
