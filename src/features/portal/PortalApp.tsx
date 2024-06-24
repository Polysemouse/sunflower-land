import React from "react";

import { WalletProvider } from "features/wallet/WalletProvider";

import { CropsAndChickens } from "./cropsAndChickens/CropsAndChickens";
import { PortalProvider } from "./cropsAndChickens/lib/PortalProvider";
import { Grassland } from "features/world/ui/Grassland";

export const PortalApp: React.FC = () => {
  return (
    // WalletProvider - if you need to connect to a players wallet
    <WalletProvider>
      {/* PortalProvider - gives you access to a xstate machine which handles state management */}
      <PortalProvider>
        <Grassland>
          <CropsAndChickens />
        </Grassland>
      </PortalProvider>
    </WalletProvider>
  );
};
