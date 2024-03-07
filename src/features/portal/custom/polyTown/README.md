## Poly Town

Poly Town is a casual map where players can hang out and discover mysteries.

## Setup

To play Poly Town locally, add the following variable to your `.env`

```
VITE_PORTAL_APP=poly-town
```

## Architecture

`PolyTown.ts` - Handles the major states in the game (loading, rules, completed, error). Will show the game scene once 'ready'.
`PolyTownPhaser.tsx` - Initialises the World Scene and components used inside of the game.
`PolyTownScene.tsx` - Sets up the game logic - custom walking, puzzle + exploding mechanic.
`lib/portalMachine.ts` - Handles the connection to Sunflower Land API and any API interactions.
