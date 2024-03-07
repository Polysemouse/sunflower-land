/* eslint-disable react/jsx-no-literals */
import React, { useContext } from "react";

import { useActor } from "@xstate/react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import { PortalContext, PortalProvider } from "./lib/PortalProvider";
import { Ocean } from "features/world/ui/Ocean";
import { PolyTownHud } from "features/portal/custom/polyTown/components/PolyTownHud";
import { PolyTownPhaser } from "./PolyTownPhaser";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { secondsToString } from "lib/utils/time";
import {
  authorisePortal,
  goHome,
} from "features/portal/custom/polyTown/lib/portalUtil";
import { PolyTownRules } from "./components/PolyTownRules";
import { Modal } from "components/ui/Modal";

export const PolyTownApp: React.FC = () => {
  return (
    <PortalProvider>
      <Ocean>
        <PolyTown />
      </Ocean>
    </PortalProvider>
  );
};

export const PolyTown: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  return (
    <div>
      {portalState.matches("error") && (
        <Modal show>
          <Panel>
            <div className="p-2">
              <Label type="danger">Error</Label>
              <span className="text-sm my-2">Something went wrong</span>
            </div>
            <Button onClick={() => portalService.send("RETRY")}>Retry</Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("loading") && (
        <Modal show>
          <Panel>
            <span className="loading">Loading</span>
          </Panel>
        </Modal>
      )}

      {portalState.matches("unauthorised") && (
        <Modal show>
          <Panel>
            <div className="p-2">
              <Label type="danger">Error</Label>
              <span className="text-sm my-2">Your session has expired</span>
            </div>
            <Button onClick={authorisePortal}>Login</Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("idle") && (
        <Modal show>
          <Panel>
            <Button onClick={() => portalService.send("START")}>Start</Button>
          </Panel>
        </Modal>
      )}

      {portalState.matches("rules") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.wizard}>
            <PolyTownRules
              onAcknowledged={() => portalService.send("CONTINUE")}
            />
          </Panel>
        </Modal>
      )}

      {portalState.matches("claiming") && (
        <Modal show>
          <Panel>
            <p className="loading">Loading</p>
          </Panel>
        </Modal>
      )}

      {portalState.matches("completed") && (
        <Modal show>
          <Panel bumpkinParts={NPC_WEARABLES.wizard}>
            <div className="p-2">
              <p className="mb-2">
                {`Congratulations, you have completed today's challenge.`}
              </p>
              <p className="text-sm mb-1">
                Come back later for a brand new puzzle!
              </p>
              <Label type="info" icon={SUNNYSIDE.icons.timer}>
                {secondsToString(secondsTillReset(), { length: "medium" })}
              </Label>
            </div>
            <div className="flex">
              <Button onClick={goHome} className="mr-1">
                Go home
              </Button>
              <Button onClick={() => portalService.send("CONTINUE")}>
                Play again
              </Button>
            </div>
          </Panel>
        </Modal>
      )}

      {portalState.context.state && (
        <>
          <PolyTownHud />
          <PolyTownPhaser />
        </>
      )}
    </div>
  );
};
