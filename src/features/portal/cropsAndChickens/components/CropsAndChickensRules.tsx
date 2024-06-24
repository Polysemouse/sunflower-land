import React, { useContext, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { useActor } from "@xstate/react";
import { PortalContext } from "../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { CropsAndChickensPrize } from "./CropsAndChickensPrize";
import { CropsAndChickensAttempts } from "./CropsAndChickensAttempts";
import factions from "assets/icons/factions.webp";
import chores from "assets/icons/chores.webp";
import chickenHunter from "public/world/chicken_hunter.png";
import { SCORE_TABLE } from "../CropsAndChickensConstants";

interface Props {
  onAcknowledged: () => void;
  onClose: () => void;
}
export const CropsAndChickensRules: React.FC<Props> = ({
  onAcknowledged,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);

  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const dateKey = new Date().toISOString().slice(0, 10);
  const minigame =
    portalState.context.state!.minigames.games["crops-and-chickens"];
  const history = minigame?.history ?? {};
  const attemptsLeft = portalState.context.attemptsLeft;

  const weeklyAttempt = history[dateKey] ?? {
    attempts: 0,
    highscore: 0,
  };

  const prize =
    portalState.context.state!.minigames.prizes["crops-and-chickens"];

  const mission = () => {
    return (
      <>
        <div>
          <div className="w-full relative flex justify-between gap-1 p-1 items-center mb-2">
            <Label type="default" icon={factions}>
              {t("crops-and-chickens.minigame")}
            </Label>

            <CropsAndChickensAttempts
              attemptsLeft={attemptsLeft}
              purchases={minigame?.purchases}
            />
          </div>
          <CropsAndChickensPrize history={weeklyAttempt} prize={prize} />
        </div>
        <div className="flex space-x-1">
          <Button
            className="mt-1 whitespace-nowrap capitalize"
            onClick={() => {
              onClose();
            }}
          >
            {t("exit")}
          </Button>
          <Button
            className="mt-1 whitespace-nowrap capitalize"
            onClick={() => {
              onAcknowledged();
            }}
          >
            {t("start")}
          </Button>
        </div>
      </>
    );
  };

  const rules = () => {
    return (
      <div className="p-2">
        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Sunflower"].image} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.rules1")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.basket} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.rules2")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.rules3")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.rules4")}
          </p>
        </div>
      </div>
    );
  };

  const legend = () => {
    return (
      <table className="w-full text-xs table-fixed border-collapse">
        <tbody>
          {Object.values(SCORE_TABLE).map(({ item, points }, index) => (
            <tr key={index}>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/6"
              >
                <div className="flex items-center justify-center">
                  <SquareIcon icon={ITEM_DETAILS[item].image} width={7} />
                </div>
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-5/6"
              >
                {t("crops-and-chickens.cropDescription", { points: points })}
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <div className="flex items-center justify-center">
                <SquareIcon icon={SUNNYSIDE.icons.treasure} width={7} />
              </div>
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {t("crops-and-chickens.depositAreaDescription")}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <div className="flex items-center justify-center">
                <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={7} />
              </div>
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {t("crops-and-chickens.normalChickenDescription")}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <div className="flex items-center justify-center">
                <SquareIcon icon={chickenHunter} width={7} />
              </div>
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {t("crops-and-chickens.hunterChickenDescription")}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <>
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES["chicken farmer"]}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          {
            icon: SUNNYSIDE.icons.plant,
            name: t("crops-and-chickens.mission"),
          },
          { icon: chores, name: t("crops-and-chickens.rules") },
          {
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("crops-and-chickens.legend"),
          },
        ]}
      >
        <>
          {tab === 0 && mission()}
          {tab === 1 && rules()}
          {tab === 2 && legend()}
        </>
      </CloseButtonPanel>
    </>
  );
};
