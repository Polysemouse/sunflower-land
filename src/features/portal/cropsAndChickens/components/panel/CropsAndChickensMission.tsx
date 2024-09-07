import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { CropsAndChickensPrize } from "./CropsAndChickensPrize";
import { CropsAndChickensAttempts } from "./CropsAndChickensAttempts";
import factions from "assets/icons/factions.webp";
import { getAttemptsLeft } from "../../lib/cropsAndChickensUtils";
import { goHome } from "features/portal/lib/portalUtil";
import { PortalMachineState } from "../../lib/cropsAndChickensMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { CropsAndChickensAchievementsList } from "./CropsAndChickensAchievementsList";
import { CropsAndChickensGuide } from "./CropsAndChickensGuide";
import trophy from "assets/icons/trophy.png";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";
import { formatNumber } from "lib/utils/formatNumber";

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
const _state = (state: PortalMachineState) => state.context.state;

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
  const state = useSelector(portalService, _state);

  const hasBetaAccess = state
    ? hasFeatureAccess(state, "CROPS_AND_CHICKENS_BETA_TESTING")
    : false;

  const dateKey = new Date().toISOString().slice(0, 10);

  const [page, setPage] = React.useState<"main" | "achievements" | "guide">(
    "main",
  );

  return (
    <>
      {page === "main" && (
        <div className="flex flex-col gap-1 max-h-[75vh]">
          <div className="flex flex-col gap-1 overflow-x-hidden overflow-y-auto scrollable px-1">
            <div className="flex justify-between gap-1 items-center mb-1 py-1 pl-2">
              {mode === "introduction" && (
                <Label type="default" icon={factions}>
                  {t("crops-and-chickens.portal.title")}
                </Label>
              )}
              {mode === "success" && (
                <Label
                  type="success"
                  className="text-center"
                  icon={SUNNYSIDE.icons.confirm}
                >
                  {t("crops-and-chickens.missionComplete")}
                </Label>
              )}
              {mode === "failed" && (
                <Label
                  type="danger"
                  className="text-center"
                  icon={SUNNYSIDE.icons.death}
                >
                  {t("crops-and-chickens.missionFailed")}
                </Label>
              )}
              <CropsAndChickensAttempts attemptsLeft={attemptsLeft} />
            </div>

            <div className="flex flex-wrap gap-1 justify-center">
              {hasBetaAccess && (
                <Button
                  className="whitespace-nowrap capitalize w-12"
                  onClick={() => setPage("achievements")}
                >
                  <SquareIcon icon={trophy} width={9} />
                </Button>
              )}
              <Button
                className="whitespace-nowrap capitalize w-12"
                onClick={() => setPage("guide")}
              >
                <SquareIcon
                  icon={SUNNYSIDE.icons.expression_confused}
                  width={8}
                />
              </Button>
            </div>

            <Label
              type="chill"
              className="flex flex-col gap-1 items-center p-1 !w-full"
              style={{
                marginBottom: `${PIXEL_SCALE * 1}px`,
              }}
            >
              {showScore && (
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-sm">
                    {t("crops-and-chickens.score")}
                  </span>
                  <span className="text-lg">{formatNumber(score)}</span>
                </div>
              )}
              <div className="flex justify-between gap-2 w-full">
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-xs text-center">
                    {t("crops-and-chickens.todaysBest")}
                  </span>
                  <span className="text-sm text-center">
                    {formatNumber(minigame?.history[dateKey]?.highscore ?? 0)}
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-xs text-center">
                    {t("crops-and-chickens.personalBest")}
                  </span>
                  <span className="text-sm text-center">
                    {formatNumber(
                      Object.values(minigame?.history ?? {}).reduce(
                        (acc, { highscore }) => Math.max(acc, highscore),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </Label>

            <CropsAndChickensPrize />
          </div>

          <div className="flex mt-1 space-x-1">
            {showExitButton && (
              <Button className="whitespace-nowrap capitalize" onClick={goHome}>
                {t("exit")}
              </Button>
            )}
            <Button
              className="whitespace-nowrap capitalize"
              onClick={onConfirm}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      )}
      {page === "achievements" && (
        <CropsAndChickensAchievementsList onBack={() => setPage("main")} />
      )}
      {page === "guide" && (
        <CropsAndChickensGuide onBack={() => setPage("main")} />
      )}
    </>
  );
};
