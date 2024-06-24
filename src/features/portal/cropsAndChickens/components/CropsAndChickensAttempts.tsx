import React from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

interface Props {
  attemptsLeft: number;
}

export const CropsAndChickensAttempts: React.FC<Props> = ({ attemptsLeft }) => {
  const { t } = useAppTranslation();

  if (attemptsLeft === Infinity) {
    return (
      <Label type="success">{t("crops-and-chickens.unlimitedAttempts")}</Label>
    );
  }

  if (attemptsLeft > 1) {
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
