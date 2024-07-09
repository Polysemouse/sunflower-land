import React, { useContext, useEffect } from "react";

import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext } from "./lib/PortalProvider";
import { CropsAndChickensHud } from "features/portal/cropsAndChickens/components/hud/CropsAndChickensHud";
import { CropsAndChickensPhaser } from "./CropsAndChickensPhaser";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "./lib/cropsAndChickensMachine";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import lock from "assets/skills/lock.png";
import sfl from "assets/icons/sfl.webp";
import {
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
  DAILY_ATTEMPTS,
} from "./CropsAndChickensConstants";
import {
  authorisePortal,
  claimPrize,
  goHome,
  purchase,
} from "../lib/portalUtil";
import { CropsAndChickensRulesPanel } from "./components/panel/CropsAndChickensRulesPanel";

const _sflBalance = (state: PortalMachineState) => state.context.state?.balance;
const _isError = (state: PortalMachineState) => state.matches("error");
const _isUnauthorised = (state: PortalMachineState) =>
  state.matches("unauthorised");
const _isLoading = (state: PortalMachineState) => state.matches("loading");
const _isIdle = (state: PortalMachineState) => state.matches("idle");
const _isNoAttempts = (state: PortalMachineState) =>
  state.matches("noAttempts");
const _isIntroduction = (state: PortalMachineState) =>
  state.matches("introduction");
const _isLoser = (state: PortalMachineState) => state.matches("loser");
const _isWinner = (state: PortalMachineState) => state.matches("winner");
const _isComplete = (state: PortalMachineState) => state.matches("complete");

export const CropsAndChickens: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const sflBalance = useSelector(portalService, _sflBalance);
  const isError = useSelector(portalService, _isError);
  const isUnauthorised = useSelector(portalService, _isUnauthorised);
  const isLoading = useSelector(portalService, _isLoading);
  const isIdle = useSelector(portalService, _isIdle);
  const isNoAttempts = useSelector(portalService, _isNoAttempts);
  const isIntroduction = useSelector(portalService, _isIntroduction);
  const isWinner = useSelector(portalService, _isWinner);
  const isLoser = useSelector(portalService, _isLoser);
  const isComplete = useSelector(portalService, _isComplete);

  useEffect(() => {
    // If a player tries to quit while playing, mark it as an attempt
    const handleBeforeUnload = () => {
      portalService.send("GAME_OVER");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (isError) {
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

  if (isUnauthorised) {
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

  if (isLoading) {
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

  return (
    <div>
      {isIdle && (
        <Modal show>
          <Panel>
            <Button onClick={() => portalService.send("START")}>
              {t("start")}
            </Button>
          </Panel>
        </Modal>
      )}

      {isNoAttempts && (
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
                    sflBalance?.lt(RESTOCK_ATTEMPTS_SFL) ? "danger" : "default"
                  }
                >
                  {t("crops-and-chickens.sflRequired")}
                </Label>
              </div>

              <p className="text-sm mb-2">
                {t("crops-and-chickens.youHaveRunOutOfAttempts")}
              </p>
              <p className="text-sm mb-2">
                {t("crops-and-chickens.wouldYouLikeToUnlock")}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Button onClick={goHome}>{t("exit")}</Button>
              <Button
                disabled={sflBalance?.lt(RESTOCK_ATTEMPTS_SFL)}
                onClick={() =>
                  purchase({
                    sfl: RESTOCK_ATTEMPTS_SFL,
                    items: {},
                  })
                }
              >
                {t("crops-and-chickens.buyAttempts", {
                  attempts: DAILY_ATTEMPTS,
                  sfl: RESTOCK_ATTEMPTS_SFL,
                })}
              </Button>
              <Button
                disabled={sflBalance?.lt(UNLIMITED_ATTEMPTS_SFL)}
                onClick={() =>
                  purchase({
                    sfl: UNLIMITED_ATTEMPTS_SFL,
                    items: {},
                  })
                }
              >
                {t("crops-and-chickens.unlockAttempts", {
                  sfl: UNLIMITED_ATTEMPTS_SFL,
                })}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {isIntroduction && (
        <Modal show>
          <CropsAndChickensRulesPanel
            mode={"introduction"}
            showScore={false}
            showExitButton={true}
            confirmButtonText={t("start")}
            onConfirm={() => portalService.send("CONTINUE")}
          />
        </Modal>
      )}

      {isLoser && (
        <Modal show>
          <CropsAndChickensRulesPanel
            mode={"failed"}
            showScore={true}
            showExitButton={true}
            confirmButtonText={t("play.again")}
            onConfirm={() => portalService.send("RETRY")}
          />
        </Modal>
      )}

      {isWinner && (
        <Modal show>
          <CropsAndChickensRulesPanel
            mode={"success"}
            showScore={true}
            showExitButton={false}
            confirmButtonText={t("claim")}
            onConfirm={claimPrize}
          />
        </Modal>
      )}

      {isComplete && (
        <Modal show>
          <CropsAndChickensRulesPanel
            mode={"introduction"}
            showScore={true}
            showExitButton={true}
            confirmButtonText={t("play.again")}
            onConfirm={() => portalService.send("RETRY")}
          />
        </Modal>
      )}

      {sflBalance && (
        <>
          <CropsAndChickensHud />
          <CropsAndChickensPhaser />
        </>
      )}
    </div>
  );
};
