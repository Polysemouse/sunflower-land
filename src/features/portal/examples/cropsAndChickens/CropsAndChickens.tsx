import React, { useContext, useEffect } from "react";

import { useActor, useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext } from "./lib/PortalProvider";
import { CropsAndChickensHud } from "features/portal/examples/cropsAndChickens/components/CropsAndChickensHud";
import { CropsAndChickensPhaser } from "./CropsAndChickensPhaser";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { CropsAndChickensRules } from "./components/CropsAndChickensRules";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "./lib/cropsAndChickensMachine";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import lock from "assets/skills/lock.png";
import sfl from "assets/icons/sfl.webp";
import { UNLIMITED_ATTEMPTS_SFL } from "./CropsAndChickensConstants";
import {
  authorisePortal,
  claimPrize,
  goHome,
  purchase,
} from "../../lib/portalUtil";
import { CropsAndChickensPrize } from "./components/CropsAndChickensPrize";
import { CropsAndChickensAttempts } from "./components/CropsAndChickensAttempts";

const _gameState = (state: PortalMachineState) => state.context.state;

export const CropsAndChickens: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const { t } = useAppTranslation();

  const gameState = useSelector(portalService, _gameState);

  useEffect(() => {
    // If a player tries to quit while playing, mark it as an attempt
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      portalService.send("GAME_OVER");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (portalState.matches("error")) {
    return (
      <Modal show>
        <Panel>
          <div className="p-2">
            <Label type="danger">{t("error")}</Label>
            <span className="text-sm my-2">{t("error.wentWrong")}</span>
          </div>
          <Button onClick={() => portalService.send("RETRY")}>
            {t("retry")}
          </Button>
        </Panel>
      </Modal>
    );
  }

  if (portalState.matches("unauthorised")) {
    return (
      <Modal show>
        <Panel>
          <div className="p-2">
            <Label type="danger">{t("error")}</Label>
            <span className="text-sm my-2">{t("session.expired")}</span>
          </div>
          <Button onClick={authorisePortal}>{t("welcome.login")}</Button>
        </Panel>
      </Modal>
    );
  }

  if (portalState.matches("loading")) {
    return (
      <Modal show>
        <Panel>
          <Loading />
          <span className="text-xs">
            {`${t("last.updated")}:${CONFIG.CLIENT_VERSION}`}
          </span>
        </Panel>
      </Modal>
    );
  }

  const dateKey = new Date().toISOString().slice(0, 10);
  const minigame = gameState?.minigames.games["crops-and-chickens"];
  const history = minigame?.history ?? {};

  const prize = gameState?.minigames.prizes["crops-and-chickens"];

  const weeklyAttempt = history[dateKey] ?? {
    attempts: 0,
    highscore: 0,
  };

  const attemptsLeft = portalState.context.attemptsLeft;

  return (
    <div>
      {portalState.matches("idle") && (
        <Modal show>
          <Panel>
            <Button onClick={() => portalService.send("START")}>
              {t("start")}
            </Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("noAttempts") && (
        <Modal show>
          <Panel>
            <div className="p-1">
              <div className="flex gap-1 justify-between items-center mb-2">
                <Label icon={lock} type="danger">
                  {t("crops-and-chickens.noAttemptsRemaining")}
                </Label>
                <Label
                  icon={sfl}
                  type={
                    gameState?.balance.lt(UNLIMITED_ATTEMPTS_SFL)
                      ? "danger"
                      : "default"
                  }
                >
                  {`${UNLIMITED_ATTEMPTS_SFL} ${t(
                    "crops-and-chickens.sflRequired"
                  )}`}
                </Label>
              </div>

              <p className="text-sm mb-2">
                {t("crops-and-chickens.youHaveRunOutOfAttempts")}
              </p>
              <p className="text-sm mb-2">
                {t("crops-and-chickens.wouldYouLikeToUnlock")}
              </p>
            </div>
            <div className="flex">
              <Button onClick={goHome} className="mr-1">
                {t("exit")}
              </Button>
              <Button
                disabled={gameState?.balance.lt(UNLIMITED_ATTEMPTS_SFL)}
                onClick={() =>
                  purchase({ sfl: UNLIMITED_ATTEMPTS_SFL, items: {} })
                }
              >
                {t("crops-and-chickens.unlockAttempts")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.matches("introduction") && (
        <Modal show>
          <CropsAndChickensRules
            onAcknowledged={() => portalService.send("CONTINUE")}
            onClose={() => goHome()}
          />
        </Modal>
      )}

      {portalState.matches("loser") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <div className="w-full gap-1 relative flex justify-between p-1 items-center">
              <Label type="danger" icon={SUNNYSIDE.icons.death}>
                {t("crops-and-chickens.missionFailed")}
              </Label>
              <CropsAndChickensAttempts
                attemptsLeft={attemptsLeft}
                purchases={minigame?.purchases}
              />
            </div>
            <div className="mt-1 flex justify-between flex-col space-y-1 px-1 mb-2">
              <span className="text-sm">
                {t("crops-and-chickens.score", {
                  score: portalState.context.score,
                })}
              </span>
              <span className="text-xs">
                {t("crops-and-chickens.highscore", {
                  highscore: minigame?.highscore ?? 0,
                })}
              </span>
            </div>
            <CropsAndChickensPrize history={weeklyAttempt} prize={prize} />
            <div className="flex mt-1">
              <Button onClick={goHome} className="mr-1">
                {t("go.home")}
              </Button>
              <Button onClick={() => portalService.send("RETRY")}>
                {t("play.again")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.matches("winner") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <>
              <div>
                <div className="w-full relative flex justify-between p-1">
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {t("crops-and-chickens.missionComplete")}
                  </Label>
                  <CropsAndChickensAttempts
                    attemptsLeft={attemptsLeft}
                    purchases={minigame?.purchases}
                  />
                </div>
                <div className="mt-1 flex justify-between flex-col space-y-1 px-1 mb-2">
                  <span className="text-sm">
                    {t("crops-and-chickens.score", {
                      score: portalState.context.score,
                    })}
                  </span>
                  <span className="text-xs">
                    {t("crops-and-chickens.highscore", {
                      highscore: minigame?.highscore ?? 0,
                    })}
                  </span>
                </div>
                <CropsAndChickensPrize history={weeklyAttempt} prize={prize} />
              </div>
              <Button
                className="mt-1 whitespace-nowrap capitalize"
                onClick={() => {
                  claimPrize();
                }}
              >
                {t("claim")}
              </Button>
            </>
          </Panel>
        </Modal>
      )}

      {portalState.matches("complete") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.chicken}>
            <div className="w-full relative flex justify-between p-1 items-center">
              <Label type="default" icon={SUNNYSIDE.icons.death}>
                {t("minigame.chickenRescue")}
              </Label>
              <CropsAndChickensAttempts
                attemptsLeft={attemptsLeft}
                purchases={minigame?.purchases}
              />
            </div>
            <div className="mt-1 flex justify-between flex-col space-y-1 px-1 mb-2">
              <span className="text-sm">{`Score: ${portalState.context.score}`}</span>
              <span className="text-xs">{`Highscore: ${Math.max(
                portalState.context.score,
                minigame?.highscore ?? 0
              )}`}</span>
            </div>
            <div className="flex mt-1">
              <Button onClick={goHome} className="mr-1">
                {t("go.home")}
              </Button>
              <Button onClick={() => portalService.send("RETRY")}>
                {t("play.again")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {gameState && (
        <>
          <CropsAndChickensHud />
          <CropsAndChickensPhaser />
        </>
      )}
    </div>
  );
};
