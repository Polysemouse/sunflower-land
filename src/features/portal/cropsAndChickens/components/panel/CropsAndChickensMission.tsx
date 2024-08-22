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
          <div className="overflow-y-auto scrollable px-1">
            <div className="flex justify-between gap-1 items-center mb-1 py-1 pl-2">
              {mode === "introduction" && (
                <Label type="default" icon={factions}>
                  {t("crops-and-chickens.portal.title")}
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

            <div
              className="flex flex-row"
              style={{
                marginBottom: `${PIXEL_SCALE * 1}px`,
              }}
            >
              <div className="flex justify-between flex-col space-y-1 px-1 mb-3 text-sm flex-grow">
                {showScore && (
                  <span>
                    {t("crops-and-chickens.score", {
                      score: score,
                    })}
                  </span>
                )}
                <span>
                  {t("crops-and-chickens.bestToday", {
                    score: minigame?.history[dateKey]?.highscore ?? 0,
                  })}
                </span>
                <span>
                  {t("crops-and-chickens.bestAllTime", {
                    score: Object.values(minigame?.history ?? {}).reduce(
                      (acc, { highscore }) => Math.max(acc, highscore),
                      0,
                    ),
                  })}
                </span>
              </div>
              <div className="flex mt-1 space-x-1">
                {hasBetaAccess && (
                  <Button
                    className="whitespace-nowrap capitalize w-12"
                    onClick={() => setPage("achievements")}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <SquareIcon icon={trophy} width={9} />
                    </div>
                  </Button>
                )}
                <Button
                  className="whitespace-nowrap capitalize w-12"
                  onClick={() => setPage("guide")}
                >
                  <div className="flex flex-row items-center gap-1">
                    <SquareIcon
                      icon={SUNNYSIDE.icons.expression_confused}
                      width={7}
                    />
                  </div>
                </Button>
              </div>
            </div>

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
