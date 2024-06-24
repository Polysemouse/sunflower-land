import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import { SCORE_TABLE } from "../CropsAndChickensConstants";
import chickenHunter from "public/world/chicken_hunter.png";

export const CropsAndChickensLegend: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <tbody>
        {Object.values(SCORE_TABLE).map(({ item, points }, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/6">
              <div className="flex items-center justify-center">
                <SquareIcon icon={ITEM_DETAILS[item].image} width={7} />
              </div>
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5 w-5/6">
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
