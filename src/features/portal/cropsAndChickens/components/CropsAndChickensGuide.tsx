import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import { SCORE_TABLE } from "../CropsAndChickensConstants";
import chickenHunter from "public/world/chicken_hunter.png";
import { Label } from "components/ui/Label";

export const CropsAndChickensGuide: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-2 mt-1">
      <Label type="default">{t("crops-and-chickens.instructions")}</Label>
      <div>
        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Sunflower"].image} width={7} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.instructions1")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.basket} width={7} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.instructions2")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={7} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.instructions3")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={7} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.instructions4")}
          </p>
        </div>
      </div>

      <Label type="default">{t("crops-and-chickens.legend")}</Label>
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
    </div>
  );
};
