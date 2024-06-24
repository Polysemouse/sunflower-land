## Crops And Chickens

Crops And Chickens is a mini-game where players must gather crops in a dangerous field of wandering chickens.

Those who deposit enough crops are rewarded with various rewards!

## Setup

To play Crops And Chickens locally, run `cp .env.local .env` first then `yarn` then `yarn dev`

## Architecture

`CropsAndChickens.ts` - Handles the major states in the game (eg. loading, rules, completed, error). Will show the game scene once 'ready'.
`CropsAndChickensPhaser.tsx` - Initialises the World Scene and components used inside of the game.
`CropsAndChickensScene.tsx` - Sets up the game logic - custom mechanics.
`lib/cropsAndChickensMachine.ts` - Handles the connection to Sunflower Land API and any API interactions.
