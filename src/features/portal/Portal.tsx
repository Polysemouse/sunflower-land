/**
 * Entry Point to Portal App
 * Include any initialisation logic, stylesheets + more here.
 */
import React from "react";
import "src/styles.css";

import { initialise } from "lib/utils/init";

import { CropsAndChickensApp } from "./examples/cropsAndChickens/CropsAndChickens";
import { CropBoomApp } from "./examples/cropBoom/CropBoom";
import { MushroomForest } from "./examples/mushroomForest/MushroomForest";
import { CONFIG } from "lib/config";
import { GoblinSwarm } from "./examples/goblinSwarm/GoblinSwarm";

initialise();

export const PortalApp: React.FC = () => {
  if (CONFIG.PORTAL_APP === "crops-and-chickens") {
    return <CropsAndChickensApp />;
  }

  if (CONFIG.PORTAL_APP === "crop-boom") {
    return <CropBoomApp />;
  }

  if (CONFIG.PORTAL_APP === "mushroom-forest") {
    return <MushroomForest />;
  }

  if (CONFIG.PORTAL_APP === "goblin-swarm") {
    return <GoblinSwarm />;
  }

  // Return your app
  return null;
};
