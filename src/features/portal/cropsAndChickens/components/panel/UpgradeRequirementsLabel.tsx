import React from "react";
import classNames from "classnames";
import { formatNumber } from "lib/utils/formatNumber";
import { SquareIcon } from "components/ui/SquareIcon";
import goldenSeed from "public/crops-and-chickens/golden_seed.png";
import { Label } from "components/ui/Label";

/**
 * The props for requirement label.
 * @param points The points of the player.
 * @param requirement The points requirement.
 */
interface Props {
  points: number;
  requirement: number;
}

/**
 * The requirement label that consists of an icon and a requirement description.
 * This component is used when displaying individual requirements in a recipe.
 * @props The component props.
 */
export const UpgradeRequirementsLabel: React.FC<Props> = (props) => {
  const isRequirementMet = props.points >= props.requirement;

  return (
    <div className="flex justify-between min-h-[26px]">
      <div className="flex items-center">
        <SquareIcon icon={goldenSeed} width={7} />
      </div>

      <Label
        className={classNames("whitespace-nowrap font-secondary relative", {
          "ml-1": !isRequirementMet,
        })}
        type={isRequirementMet ? "transparent" : "danger"}
      >
        {`${formatNumber(props.points)}/${formatNumber(props.requirement)}`}
      </Label>
    </div>
  );
};
