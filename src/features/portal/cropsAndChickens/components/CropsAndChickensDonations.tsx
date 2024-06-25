import React, { useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { Loading, roundToOneDecimal } from "features/auth/components";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { ITEM_DETAILS } from "features/game/types/images";

const CONTRIBUTORS = ["Polysemouse"];

export const CropsAndChickensDonations: React.FC = () => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);
  const [donation, setDonation] = useState(1);
  const CHRISTMAS_EVENT_DONATION_ADDRESS = CONFIG.CHRISTMAS_EVENT_DONATION;
  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(roundToOneDecimal(Number(e.target.value)));
  };
  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.2) {
      setDonation(0.2);
    } else if (donation < 0.2) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const donate = () => {
    send("DONATE", {
      donation,
      to: CHRISTMAS_EVENT_DONATION_ADDRESS,
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

          <div className="flex flex-wrap mt-1 mb-2 gap-1 justify-center">
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
              <Button
                className="cursor-pointer w-12"
                onClick={decrementDonation}
              >
                {"-"}
              </Button>
              <input
                type="number"
                className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-1 mx-2 text-center"
                step="0.1"
                min={0.1}
                value={donation}
                required
                onChange={onDonationChange}
                onBlur={() => {
                  if (donation < 0.1) setDonation(0.1);
                }}
              />
              <Button
                className="cursor-pointer w-12"
                onClick={incrementDonation}
              >
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
            disabled={isComingSoon || donation < 0.1}
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
