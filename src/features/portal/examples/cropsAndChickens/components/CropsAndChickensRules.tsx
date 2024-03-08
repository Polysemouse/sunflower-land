import React from "react";

import tutorial from "features/portal/examples/cropsAndChickens/assets/crops-and-chickens-tutorial.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SquareIcon } from "components/ui/SquareIcon";

interface Props {
  onAcknowledged: () => void;
}
export const CropsAndChickensRules: React.FC<Props> = ({ onAcknowledged }) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-2">{t("crops-and-chickens.welcome")}</p>
        <img src={tutorial} className="w-full mx-auto rounded-lg mb-2" />

        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Sunflower"].image} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.collectCrops")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.basket} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.depositCrops")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={ITEM_DETAILS["Chicken"].image} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.bewareWanderingChickens")}
          </p>
        </div>

        <div className="flex items-center mb-3">
          <SquareIcon icon={SUNNYSIDE.icons.stopwatch} width={12} />
          <p className="text-xs ml-3 flex-1">
            {t("crops-and-chickens.newChallengeDaily")}
          </p>
        </div>
      </div>
      <Button
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={() => {
          onAcknowledged();
        }}
      >
        {t("ok")}
      </Button>
    </>
  );
};
