import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import chores from "assets/icons/chores.webp";
import chickenHunter from "public/world/chicken_hunter.png";
import { SCORE_TABLE } from "../CropsAndChickensConstants";
import { CropsAndChickensMainMenu } from "./CropsAndChickensMainMenu";

interface Props {
  onAcknowledged: () => void;
}
export const CropsAndChickensRules: React.FC<Props> = ({ onAcknowledged }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);

  const mission = () => {
    return (
      <CropsAndChickensMainMenu
        mode={"introduction"}
        showScore={false}
        showExitButton={true}
        confirmButtonText={t("start")}
        onConfirm={onAcknowledged}
      />
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
