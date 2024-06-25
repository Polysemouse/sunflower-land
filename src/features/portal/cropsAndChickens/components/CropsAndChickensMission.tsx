import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { CropsAndChickensPrize } from "./CropsAndChickensPrize";
import { CropsAndChickensAttempts } from "./CropsAndChickensAttempts";
import factions from "assets/icons/factions.webp";
import { getAttemptsLeft } from "../lib/cropsAndChickensUtils";
import { goHome } from "features/portal/lib/portalUtil";
import { PortalMachineState } from "../lib/cropsAndChickensMachine";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
}

const _minigame = (state: PortalMachineState) =>
  state.context.state?.minigames.games["crops-and-chickens"];
const _score = (state: PortalMachineState) => state.context.score;

export const CropsAndChickensMission: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
}) => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const minigame = useSelector(portalService, _minigame);
  const attemptsLeft = getAttemptsLeft(minigame);
  const score = useSelector(portalService, _score);

  return (
    <>
      <div>
        <div className="w-full relative flex justify-between gap-1 items-center mb-1 p-1 pl-2">
          {mode === "introduction" && (
            <Label type="default" icon={factions}>
              {t("crops-and-chickens.minigame")}
            </Label>
          )}
          {mode === "success" && (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("crops-and-chickens.missionComplete")}
            </Label>
          )}
          {mode === "failed" && (
            <Label type="danger" icon={SUNNYSIDE.icons.death}>
              {t("crops-and-chickens.missionFailed")}
            </Label>
          )}
          <CropsAndChickensAttempts attemptsLeft={attemptsLeft} />
        </div>

        <div className="flex justify-between flex-col space-y-1 px-1 mb-3 text-sm">
          {showScore && (
            <span>
              {t("crops-and-chickens.score", {
                score: score,
              })}
            </span>
          )}
          <span>
            {t("crops-and-chickens.highscore", {
              allTimeHighscore: minigame?.highscore ?? 0,
            })}
          </span>
        </div>

        <CropsAndChickensPrize />
      </div>

      <div className="flex mt-1 space-x-1">
        {showExitButton && (
          <Button className="whitespace-nowrap capitalize" onClick={goHome}>
            {t("exit")}
          </Button>
        )}
        <Button className="whitespace-nowrap capitalize" onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </div>
    </>
  );
};
