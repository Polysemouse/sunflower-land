import React, { useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { ITEM_DETAILS } from "features/game/types/images";
import { NumberInput } from "components/ui/NumberInput";
import Decimal from "decimal.js-light";

const CONTRIBUTORS = ["Polysemouse"];

export const CropsAndChickensDonations: React.FC = () => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);
  const [donation, setDonation] = useState(new Decimal(1));
  const onDonationChange = (value: Decimal) => {
    setDonation(value);
  };
  const incrementDonation = () => {
    setDonation((value) => value.add(0.1));
  };

  const decrementDonation = () => {
    setDonation((value) => {
      if (value.lessThanOrEqualTo(0.1)) return new Decimal(0.1);
      return value.minus(0.1);
    });
  };

  const donate = () => {
    send("DONATE", {
      donation,
      to: CONFIG.CROPS_AND_CHICKENS_DONATION,
    });
  };

  // waiting confirmation for address
  const isComingSoon = true;

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col mb-1 p-2 text-sm">
          <p className="mb-2 text-center">
            {t("crops-and-chickens.donationDescription")}
          </p>

          <div className="flex flex-wrap mt-1 mb-4 gap-x-3 gap-y-1 justify-center">
            {CONTRIBUTORS.map((name) => (
              <Label
                key={name}
                type="chill"
                icon={ITEM_DETAILS["Chicken"].image}
              >
                <span className="pl-1">{name}</span>
              </Label>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <div className="flex">
              <Button className="w-12" onClick={decrementDonation}>
                {"-"}
              </Button>
              <div className="flex items-center w-24 mx-2 mt-1">
                <NumberInput
                  value={donation}
                  maxDecimalPlaces={1}
                  isOutOfRange={donation.lessThan(0.1)}
                  onValueChange={onDonationChange}
                />
              </div>
              <Button className="w-12" onClick={incrementDonation}>
                {"+"}
              </Button>
            </div>
            <span className="text-xs font-secondary my-2">
              {t("amount.matic")}
            </span>
          </div>

          {isComingSoon && (
            <Label type="default" className="mb-2">
              {t("coming.soon")}
            </Label>
          )}

          <Button
            className="w-full ml-1"
            onClick={donate}
            disabled={isComingSoon || donation.lessThan(0.1)}
          >
            <span className="whitespace-nowrap">{t("donate")}</span>
          </Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <Loading className="mb-4" text={t("donating")} />
        </div>
      )}
      {state.matches("donated") && (
        <div className="flex flex-col items-center">
          <p className="mb-4">{t("thank.you")}</p>
        </div>
      )}
      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-4">{t("statements.ohNo")}</p>
        </div>
      )}
      {state.matches("confirming") && (
        <GameWallet action="donate">
          <p className="m-2">{`${donation} (MATIC)`}</p>
          <Button className="w-full ml-1" onClick={donate}>
            <span className="text-xs whitespace-nowrap">{t("confirm")}</span>
          </Button>
        </GameWallet>
      )}
    </>
  );
};
