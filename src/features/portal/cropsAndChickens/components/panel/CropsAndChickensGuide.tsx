import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import chickenNormal from "public/crops-and-chickens/chicken_normal.png";
import chickenNormalHalloween from "public/crops-and-chickens/chicken_normal_halloween.png";
import chickenNormalChristmas from "public/crops-and-chickens/chicken_normal_christmas.png";
import chickenHunter from "public/crops-and-chickens/chicken_hunter.png";
import chickenHunterHalloween from "public/crops-and-chickens/chicken_hunter_halloween.png";
import chickenHunterChristmas from "public/crops-and-chickens/chicken_hunter_christmas.png";
import { Label } from "components/ui/Label";
import { SCORE_TABLE } from "../../CropsAndChickensConstants";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSound } from "lib/utils/hooks/useSound";
import { getCropImage, getHolidayEvent } from "../../lib/cropsAndChickensUtils";

type Props = {
  onBack: () => void;
};

export const CropsAndChickensGuide: React.FC<Props> = ({ onBack }) => {
  const { t } = useAppTranslation();

  const button = useSound("button");

  const holidayEvent = getHolidayEvent();

  return (
    <div className="flex flex-col gap-1 max-h-[75vh]">
      {/* title */}
      <div className="flex flex-col gap-1">
        <div className="flex text-center">
          <div
            className="flex-none"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
              marginLeft: `${PIXEL_SCALE * 2}px`,
            }}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className="cursor-pointer"
              onClick={() => {
                button.play();
                onBack();
              }}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="grow mb-3 text-lg">
            {t("crops-and-chickens.guide")}
          </div>
          <div className="flex-none">
            <div
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                marginRight: `${PIXEL_SCALE * 2}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col gap-1 overflow-y-auto scrollable px-1">
        {/* instructions */}
        <Label type="default">{t("crops-and-chickens.instructions")}</Label>
        <div>
          <div className="flex items-center mb-3 mx-2">
            <SquareIcon icon={ITEM_DETAILS["Sunflower"].image} width={7} />
            <p className="text-xs ml-3 flex-1">
              {t("crops-and-chickens.instructions1")}
            </p>
          </div>

          <div className="flex items-center mb-3 mx-2">
            <SquareIcon icon={SUNNYSIDE.icons.basket} width={7} />
            <p className="text-xs ml-3 flex-1">
              {t("crops-and-chickens.instructions2")}
            </p>
          </div>

          <div className="flex items-center mb-3 mx-2">
            <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={7} />
            <p className="text-xs ml-3 flex-1">
              {t("crops-and-chickens.instructions3")}
            </p>
          </div>

          <div className="flex items-center mb-3 mx-2">
            <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={7} />
            <p className="text-xs ml-3 flex-1">
              {t("crops-and-chickens.instructions4")}
            </p>
          </div>
        </div>

        {/* legend */}
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
                    <SquareIcon icon={getCropImage(item)} width={7} />
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
                  <SquareIcon
                    icon={
                      holidayEvent === "halloween"
                        ? chickenNormalHalloween
                        : holidayEvent === "christmas"
                          ? chickenNormalChristmas
                          : chickenNormal
                    }
                    width={7}
                  />
                </div>
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {t("crops-and-chickens.normalChickenDescription")}
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex items-center justify-center">
                  <SquareIcon
                    icon={
                      holidayEvent === "halloween"
                        ? chickenHunterHalloween
                        : holidayEvent === "christmas"
                          ? chickenHunterChristmas
                          : chickenHunter
                    }
                    width={7}
                  />
                </div>
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {t("crops-and-chickens.hunterChickenDescription")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
