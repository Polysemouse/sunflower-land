import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Minigame } from "features/game/types/game";
import { Label } from "components/ui/Label";

interface Props {
  attemptsLeft: number;
  purchases: Minigame["purchases"];
}

export const CropsAndChickensAttempts: React.FC<Props> = ({
  attemptsLeft,
  purchases = [],
}) => {
  const { t } = useAppTranslation();

  // There is only one type of purchase with crops and chickens - if they have activated in last 7 days
  const hasUnlimitedAttempts = purchases.some(
    (purchase) => purchase.purchasedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
  );

  if (hasUnlimitedAttempts) {
    return (
      <Label type="success">{t("crops-and-chickens.unlimitedAttempts")}</Label>
    );
  }

  if (attemptsLeft === 1) {
    return (
      <Label type="vibrant">
        {t("crops-and-chickens.attemptsRemainingSingular", {
          attempts: attemptsLeft,
        })}
      </Label>
    );
  }

  if (attemptsLeft > 0) {
    return (
      <Label type="vibrant">
        {t("crops-and-chickens.attemptsRemainingPlural", {
          attempts: attemptsLeft,
        })}
      </Label>
    );
  }

  return (
    <Label type="danger">{t("crops-and-chickens.noAttemptsRemaining")}</Label>
  );
};
