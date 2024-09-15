import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import coins from "assets/icons/coins.webp";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import giftIcon from "assets/icons/gift.png";
import classNames from "classnames";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";

type Props = {
  itemPrizes?: Partial<Record<InventoryItemName, number>>;
  wearablePrizes?: Partial<Record<BumpkinItem, number>>;
  coinPrizes?: number;
  customPrizes?: string[];
  isCompleted: boolean;
  targetScore: number;
  endAt: number;
};

export const CropsAndChickensMission: React.FC<Props> = ({
  itemPrizes,
  wearablePrizes,
  coinPrizes,
  customPrizes,
  isCompleted,
  targetScore,
  endAt,
}) => {
  const { t } = useAppTranslation();

  if (!itemPrizes && !wearablePrizes && !coinPrizes && !customPrizes) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("crops-and-chickens.noPrizesAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const secondsLeft = (endAt - Date.now()) / 1000;
  const secondsLeftDisplay = secondsToString(secondsLeft, { length: "medium" });

  return (
    <OuterPanel>
      <div className="flex flex-col gap-1">
        {/* mission */}
        <span className="text-xs px-1">
          {t("crops-and-chickens.objectives", {
            targetScore: targetScore,
          })}
        </span>

        {/* time left */}
        <div className="flex justify-start px-1">
          {isCompleted ? (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {t("crops-and-chickens.nextMission", {
                time: secondsLeftDisplay,
              })}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsLeftDisplay}
            </Label>
          )}
        </div>

        {/* rewards */}
        <div
          className={classNames(
            "flex flex-wrap justify-between items-center gap-2",
            {
              "px-1": isCompleted,
            },
          )}
        >
          {isCompleted ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("completed")}
            </Label>
          ) : (
            <Label type="default">{t("reward")}</Label>
          )}
          {itemPrizes &&
            getKeys(itemPrizes).map((item) => (
              <Label
                key={item}
                type="warning"
                icon={ITEM_DETAILS[item].image}
                secondaryIcon={
                  isCompleted ? SUNNYSIDE.icons.confirm : undefined
                }
              >
                {`${itemPrizes[item]} x ${item}`}
              </Label>
            ))}
          {wearablePrizes &&
            getKeys(wearablePrizes).map((item) => (
              <Label
                key={item}
                type="warning"
                icon={giftIcon}
                secondaryIcon={
                  isCompleted ? SUNNYSIDE.icons.confirm : undefined
                }
              >
                {`${wearablePrizes[item]} x ${item}`}
              </Label>
            ))}
          {!!coinPrizes && (
            <Label
              type="warning"
              icon={coins}
              secondaryIcon={isCompleted ? SUNNYSIDE.icons.confirm : undefined}
            >
              {coinPrizes}
            </Label>
          )}
          {customPrizes?.map((prize, index) => (
            <Label key={index} type="warning">
              {prize}
            </Label>
          ))}
        </div>
      </div>
    </OuterPanel>
  );
};
