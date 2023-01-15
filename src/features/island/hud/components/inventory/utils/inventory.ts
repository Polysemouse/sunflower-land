import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { setPrecision } from "lib/utils/formatNumber";

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
};

export const getBasketItems = (inventory: Inventory) => {
  return getKeys(inventory)
    .filter((itemName) =>
      setPrecision(new Decimal(inventory[itemName] || 0)).greaterThan(0)
    )
    .reduce((acc, itemName) => {
      if (itemName in PLACEABLE_DIMENSIONS) {
        return acc;
      }

      return {
        ...acc,
        [itemName]: inventory[itemName],
      };
    }, {} as Inventory);
};

export const getChestItems = (state: GameState) => {
  const { collectibles } = state;
  return getKeys(state.inventory).reduce((acc, itemName) => {
    const isCollectible = itemName in collectibles;
    const collectiblesPlaced = new Decimal(
      collectibles[itemName as CollectibleName]?.length ?? 0
    );
    const collectibleInventory = state.inventory[itemName] ?? new Decimal(0);
    if (
      itemName in COLLECTIBLES_DIMENSIONS &&
      !(isCollectible && collectiblesPlaced.eq(collectibleInventory))
    ) {
      return {
        ...acc,
        [itemName]: state.inventory[itemName],
      };
    }

    return acc;
  }, {} as Inventory);
};

export const getUnplacedAmount = (
  gameState: GameState | GoblinState,
  item: InventoryItemName
) => {
  const inventoryAmount = gameState.inventory[item] ?? new Decimal(0);
  const placedAmount =
    gameState.collectibles[item as CollectibleName]?.length ?? 0;
  return inventoryAmount.minus(placedAmount);
};

export const hasIngredient = (
  gameState: GameState | GoblinState,
  item: InventoryItemName,
  requirement: Decimal | number
) => {
  return getUnplacedAmount(gameState, item).greaterThanOrEqualTo(requirement);
};
