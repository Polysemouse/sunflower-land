import React from "react";

import { SquareIcon } from "components/ui/SquareIcon";
import { useSound } from "lib/utils/hooks/useSound";
import { ButtonPanel } from "components/ui/Panel";
import { CROPS_AND_CHICKEN_MAILS, useMailRead } from "../../hooks/useMailRead";

type Props = {
  setMailId: (id: number) => void;
};

export const CropsAndChickensMailList: React.FC<Props> = ({ setMailId }) => {
  const { isMailRead } = useMailRead();

  const button = useSound("button");

  return (
    <div className="flex flex-col gap-1 overflow-y-auto scrollable px-1">
      {/* mails */}
      {CROPS_AND_CHICKEN_MAILS.map((mail, index) => (
        <ButtonPanel
          key={index}
          onClick={() => {
            button.play();
            setMailId(mail.id);
          }}
        >
          <div className="flex items-center justify-start gap-1 w-full">
            <div className="mr-1">
              <SquareIcon icon={mail.icon} width={16} />
            </div>
            <span className="text-sm">{mail.title}</span>
            {!isMailRead(mail.id) && (
              <div className="bg-blue-500 border-1 border-white w-3 h-3 rounded-full absolute right-1 top-1" />
            )}
          </div>
        </ButtonPanel>
      ))}
    </div>
  );
};
