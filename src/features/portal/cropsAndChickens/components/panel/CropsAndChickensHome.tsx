import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { CropsAndChickensAttempts } from "./CropsAndChickensAttempts";
import factions from "assets/icons/factions.webp";
import {
  getAttemptsLeft,
  getDailyHighscore,
  getPersonalHighscore,
} from "../../lib/cropsAndChickensUtils";
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
import letter from "assets/icons/letter.png";
import { CropsAndChickensMailbox } from "./CropsAndChickensMailbox";
import { ITEM_DETAILS } from "features/game/types/images";
import { CropsAndChickensMissions } from "./CropsAndChickensMissions";

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

export const CropsAndChickensHome: React.FC<Props> = ({
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

  const dailyHighscore = getDailyHighscore(minigame);
  const personalHighscore = getPersonalHighscore(minigame);

  const [page, setPage] = React.useState<
    "main" | "mailbox" | "missions" | "achievements" | "guide"
  >("main");

  return (
    <>
      {page === "main" && (
        <div className="flex flex-col gap-1 max-h-[75vh]">
          <div className="flex flex-col gap-1 overflow-x-hidden overflow-y-auto scrollable px-1">
            {/* header */}
            <div className="flex justify-between gap-2 items-center mb-1 py-1 pl-1">
              {mode === "introduction" && (
                <Label
                  type="default"
                  className="text-center"
                  icon={ITEM_DETAILS["Kale"].image}
                  secondaryIcon={SUNNYSIDE.resource.chicken}
                >
                  {t("crops-and-chickens.homeTitle")}
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

            {/* navigation buttons */}
            <div className="flex flex-wrap gap-1 justify-center">
              <Button
                className="whitespace-nowrap capitalize w-12"
                onClick={() => setPage("mailbox")}
              >
                <SquareIcon icon={letter} width={9} />
              </Button>
              <Button
                className="whitespace-nowrap capitalize w-12"
                onClick={() => setPage("missions")}
              >
                <SquareIcon icon={factions} width={8} />
              </Button>
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
                  width={7.5}
                />
              </Button>
            </div>

            {/* Scores */}
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
                    {formatNumber(dailyHighscore)}
                  </span>
                </div>
                <div className="flex flex-col items-center w-1/2">
                  <span className="text-xs text-center">
                    {t("crops-and-chickens.personalBest")}
                  </span>
                  <span className="text-sm text-center">
                    {formatNumber(personalHighscore)}
                  </span>
                </div>
              </div>
            </Label>
          </div>

          {/* play and exit buttons */}
          <div className="flex gap-1">
            {showExitButton && <Button onClick={goHome}>{t("exit")}</Button>}
            <Button onClick={onConfirm}>{confirmButtonText}</Button>
          </div>
        </div>
      )}
      {page === "mailbox" && (
        <CropsAndChickensMailbox onBack={() => setPage("main")} />
      )}
      {page === "missions" && (
        <CropsAndChickensMissions onBack={() => setPage("main")} />
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
