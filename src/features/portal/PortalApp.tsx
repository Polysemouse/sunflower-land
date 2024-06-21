import React from "react";

import { Ocean } from "features/world/ui/Ocean";

import { WalletProvider } from "features/wallet/WalletProvider";

import { CropsAndChickens } from "./examples/cropsAndChickens/CropsAndChickens";
import { PortalProvider } from "./examples/cropsAndChickens/lib/PortalProvider";

export const PortalApp: React.FC = () => {
  return (
    // WalletProvider - if you need to connect to a players wallet
    <WalletProvider>
      {/* PortalProvider - gives you access to a xstate machine which handles state management */}
      <PortalProvider>
        <Ocean>
          <CropsAndChickens />
        </Ocean>
      </PortalProvider>
    </WalletProvider>
  );
};
