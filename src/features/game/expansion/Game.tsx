import React, { useContext, useEffect } from "react";
import { Modal } from "components/ui/Modal";
import { useSelector } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Refreshing } from "features/auth/components/Refreshing";
import { AddingSFL } from "features/auth/components/AddingSFL";
import { Context } from "../GameProvider";
import { INITIAL_SESSION, MachineState, StateValues } from "../lib/gameMachine";
import { ToastProvider } from "../toast/ToastProvider";
import { ToastPanel } from "../toast/ToastPanel";
import { Panel } from "components/ui/Panel";

import { Hoarding } from "../components/Hoarding";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
import { Route, Routes } from "react-router-dom";
import { Land } from "./Land";
import { Helios } from "features/helios/Helios";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

import { IslandNotFound } from "./components/IslandNotFound";
import { Rules } from "../components/Rules";
import { Introduction } from "./components/Introduction";
import { Purchasing } from "../components/Purchasing";
import { ClaimAuction } from "../components/auctionResults/ClaimAuction";
import { RefundAuction } from "../components/auctionResults/RefundAuction";
import { Promo } from "./components/Promo";
import { Traded } from "../components/Traded";
import { Sniped } from "../components/Sniped";
import { NewMail } from "./components/NewMail";
import { Blacklisted } from "../components/Blacklisted";
import { AirdropPopup } from "./components/Airdrop";
import { OffersPopup } from "./components/Offers";
import { PIXEL_SCALE, TEST_FARM } from "../lib/constants";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { Home } from "features/home/Home";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Listed } from "../components/Listed";
import { ListingDeleted } from "../components/listingDeleted";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { PersonhoodContent } from "features/retreat/components/personhood/PersonhoodContent";
import { hasFeatureAccess } from "lib/flags";
import { SUNNYSIDE } from "assets/sunnyside";
import { PriceChange } from "../components/PriceChange";
import { VIPOffer } from "../components/modal/components/VIPItems";
import { GreenhouseInside } from "features/greenhouse/GreenhouseInside";
import { useSound } from "lib/utils/hooks/useSound";
import { SomethingArrived } from "./components/SomethingArrived";
import { TradeAlreadyFulfilled } from "../components/TradeAlreadyFulfilled";
import { NPC_WEARABLES } from "lib/npcs";
import { Transaction } from "features/island/hud/Transaction";

const land = SUNNYSIDE.land.island;

export const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  error: true,
  buyingBlockBucks: true,
  refreshing: true,
  hoarding: true,
  landscaping: false,
  swarming: true,
  coolingDown: true,
  gameRules: true,
  randomising: false,
  visiting: false,
  loadLandToVisit: true,
  landToVisitNotFound: true,
  revealing: false,
  revealed: false,
  genieRevealed: false,
  beanRevealed: false,
  buyingSFL: true,
  depositing: true,
  introduction: false,
  specialOffer: true,
  transacting: true,
  auctionResults: false,
  claimAuction: false,
  refundAuction: false,
  promo: true,
  trading: true,
  listing: true,
  deleteTradeListing: true,
  tradeListingDeleted: true,
  fulfillTradeListing: false,
  listed: true,
  sniped: true,
  tradeAlreadyFulfilled: true,
  priceChanged: true,
  buds: false,
  mailbox: false,
  blacklisted: true,
  airdrop: true,
  offers: true,
  portalling: true,
  provingPersonhood: false,
  sellMarketResource: false,
  somethingArrived: true,
};

// State change selectors
const isLoading = (state: MachineState) =>
  state.matches("loading") || state.matches("portalling");
const isPortalling = (state: MachineState) => state.matches("portalling");
const isTrading = (state: MachineState) => state.matches("trading");
const isTraded = (state: MachineState) => state.matches("traded");
const isListing = (state: MachineState) => state.matches("listing");
const isListed = (state: MachineState) => state.matches("listed");
const isDeletingListing = (state: MachineState) =>
  state.matches("deleteTradeListing");
const isListingDeleted = (state: MachineState) =>
  state.matches("tradeListingDeleted");
const isFulfillingTradeListing = (state: MachineState) =>
  state.matches("fulfillTradeListing");
const isSniped = (state: MachineState) => state.matches("sniped");
const isTradeAlreadyFulfilled = (state: MachineState) =>
  state.matches("tradeAlreadyFulfilled");
const hasMarketPriceChanged = (state: MachineState) =>
  state.matches("priceChanged");
const isRefreshing = (state: MachineState) => state.matches("refreshing");
const isBuyingSFL = (state: MachineState) => state.matches("buyingSFL");
const isError = (state: MachineState) => state.matches("error");
const isHoarding = (state: MachineState) => state.matches("hoarding");
const isVisiting = (state: MachineState) => state.matches("visiting");
const isSwarming = (state: MachineState) => state.matches("swarming");
const isPurchasing = (state: MachineState) =>
  state.matches("purchasing") || state.matches("buyingBlockBucks");

const isCoolingDown = (state: MachineState) => state.matches("coolingDown");
const isGameRules = (state: MachineState) => state.matches("gameRules");
const isDepositing = (state: MachineState) => state.matches("depositing");
const isLoadingLandToVisit = (state: MachineState) =>
  state.matches("loadLandToVisit");
const isLoadingSession = (state: MachineState) =>
  state.matches("loading") && state.context.sessionId === INITIAL_SESSION;
const isLandToVisitNotFound = (state: MachineState) =>
  state.matches("landToVisitNotFound");
const currentState = (state: MachineState) => state.value;
const getErrorCode = (state: MachineState) => state.context.errorCode;
const getActions = (state: MachineState) => state.context.actions;

const isTransacting = (state: MachineState) => state.matches("transacting");
const isClaimAuction = (state: MachineState) => state.matches("claimAuction");
const isRefundingAuction = (state: MachineState) =>
  state.matches("refundAuction");
const isPromoing = (state: MachineState) => state.matches("promo");
const isBlacklisted = (state: MachineState) => state.matches("blacklisted");
const hasAirdrop = (state: MachineState) => state.matches("airdrop");
const hasFulfilledOffers = (state: MachineState) => state.matches("offers");
const hasSpecialOffer = (state: MachineState) => state.matches("specialOffer");
const isPlaying = (state: MachineState) => state.matches("playing");
const somethingArrived = (state: MachineState) =>
  state.matches("somethingArrived");
const isProvingPersonhood = (state: MachineState) =>
  state.matches("provingPersonhood");

const GameContent: React.FC = () => {
  const { gameService } = useContext(Context);

  useSound("desert", true);

  const visiting = useSelector(gameService, isVisiting);
  const landToVisitNotFound = useSelector(gameService, isLandToVisitNotFound);
  const { t } = useAppTranslation();
  if (landToVisitNotFound) {
    return (
      <>
        <div className="absolute z-20">
          <VisitingHud />
        </div>
        <div className="relative">
          <Modal show backdrop={false}>
            <Panel
              bumpkinParts={{
                body: "Beige Farmer Potion",
                hair: "Rancher Hair",
                pants: "Farmer Overalls",
                shirt: "Red Farmer Shirt",
                tool: "Farmer Pitchfork",
                background: "Farm Background",
                shoes: "Black Farmer Boots",
              }}
            >
              <div className="flex flex-col items-center">
                <h2 className="text-center">
                  {t("visitislandNotFound.title")}
                </h2>
                <img src={land} className="h-9 my-3" />
              </div>
              <VisitLandExpansionForm />
            </Panel>
          </Modal>
        </div>
      </>
    );
  }

  if (visiting) {
    return (
      <>
        <div className="absolute z-10 w-full h-full">
          <Routes>
            <Route path="/:id" element={<Land />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute w-full h-full z-10">
        <Routes>
          <Route path="/" element={<Land />} />
          <Route path="/marketplace/*" element={<Land />} />
          {/* Legacy route */}
          <Route path="/farm" element={<Land />} />
          <Route path="/home" element={<Home />} />
          <Route path="/greenhouse" element={<GreenhouseInside />} />
          <Route path="/helios" element={<Helios key="helios" />} />
          <Route path="*" element={<IslandNotFound />} />
        </Routes>
      </div>
    </>
  );
};

export const Game: React.FC = () => {
  return (
    <GameWrapper>
      <GameContent />
    </GameWrapper>
  );
};

const _showPWAInstallPrompt = (state: AuthMachineState) =>
  state.context.showPWAInstallPrompt;

export const GameWrapper: React.FC = ({ children }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const pwaInstallRef = usePWAInstall();

  const loading = useSelector(gameService, isLoading);
  const provingPersonhood = useSelector(gameService, isProvingPersonhood);
  const portalling = useSelector(gameService, isPortalling);
  const trading = useSelector(gameService, isTrading);
  const traded = useSelector(gameService, isTraded);
  const listing = useSelector(gameService, isListing);
  const listed = useSelector(gameService, isListed);
  const deletingListing = useSelector(gameService, isDeletingListing);
  const listingDeleted = useSelector(gameService, isListingDeleted);
  const sniped = useSelector(gameService, isSniped);
  const tradeAlreadyFulfilled = useSelector(
    gameService,
    isTradeAlreadyFulfilled,
  );
  const marketPriceChanged = useSelector(gameService, hasMarketPriceChanged);
  const refreshing = useSelector(gameService, isRefreshing);
  const buyingSFL = useSelector(gameService, isBuyingSFL);
  const error = useSelector(gameService, isError);
  const purchasing = useSelector(gameService, isPurchasing);
  const hoarding = useSelector(gameService, isHoarding);
  const swarming = useSelector(gameService, isSwarming);
  const coolingDown = useSelector(gameService, isCoolingDown);
  const gameRules = useSelector(gameService, isGameRules);
  const depositing = useSelector(gameService, isDepositing);
  const loadingLandToVisit = useSelector(gameService, isLoadingLandToVisit);
  const loadingSession = useSelector(gameService, isLoadingSession);
  const state = useSelector(gameService, currentState);
  const errorCode = useSelector(gameService, getErrorCode);
  const actions = useSelector(gameService, getActions);
  const transacting = useSelector(gameService, isTransacting);
  const claimingAuction = useSelector(gameService, isClaimAuction);
  const refundAuction = useSelector(gameService, isRefundingAuction);
  const promo = useSelector(gameService, isPromoing);
  const blacklisted = useSelector(gameService, isBlacklisted);
  const airdrop = useSelector(gameService, hasAirdrop);
  const showOffers = useSelector(gameService, hasFulfilledOffers);
  const specialOffer = useSelector(gameService, hasSpecialOffer);
  const playing = useSelector(gameService, isPlaying);
  const hasSomethingArrived = useSelector(gameService, somethingArrived);

  const showPWAInstallPrompt = useSelector(authService, _showPWAInstallPrompt);

  const { t } = useAppTranslation();
  useInterval(() => {
    gameService.send("SAVE");
  }, AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [actions]);

  useEffect(() => {
    const save = () => {
      gameService.send("SAVE");
    };

    window.addEventListener("blur", save);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("blur", save);

      // Do a final save
      save();
    };
  }, []);

  useEffect(() => {
    if (playing && showPWAInstallPrompt) {
      pwaInstallRef.current?.showDialog();

      authService.send("PWA_INSTALL_PROMPT_SHOWN");

      fixInstallPromptTextStyles();
    }
  }, [playing, pwaInstallRef, showPWAInstallPrompt]);

  if (loadingSession || loadingLandToVisit || portalling) {
    return (
      <>
        <div
          className="h-screen w-full fixed top-0"
          style={{
            zIndex: 49,

            backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
            backgroundSize: `${64 * PIXEL_SCALE}px`,
            imageRendering: "pixelated",
          }}
        >
          <Modal show backdrop={false}>
            <div
              className={classNames(
                "relative flex items-center justify-center mb-4 w-full -mt-12 max-w-xl transition-opacity duration-500 opacity-100",
              )}
            >
              <div className="w-[90%] relative">
                <img
                  src={SUNNYSIDE.fx.sparkle}
                  className="absolute animate-pulse"
                  style={{
                    width: `${PIXEL_SCALE * 8}px`,
                    top: `${PIXEL_SCALE * 0}px`,
                    right: `${PIXEL_SCALE * 0}px`,
                  }}
                />
                <>
                  {hasFeatureAccess(TEST_FARM, "EASTER") ? (
                    <img
                      id="logo"
                      src={SUNNYSIDE.brand.easterlogo}
                      className="w-full"
                    />
                  ) : (
                    <img
                      id="logo"
                      src={SUNNYSIDE.brand.logo}
                      className="w-full"
                    />
                  )}
                  <div className="flex justify-center">
                    <Label type="default" className="font-secondary">
                      {CONFIG.RELEASE_VERSION?.split("-")[0]}
                    </Label>
                    {hasFeatureAccess(TEST_FARM, "EASTER") && (
                      <Label
                        secondaryIcon={SUNNYSIDE.icons.stopwatch}
                        type="vibrant"
                        className="ml-2"
                      >
                        {t("event.Easter")}
                      </Label>
                    )}
                  </div>
                </>
              </div>
            </div>
            <Panel>
              <Loading />
            </Panel>
          </Modal>
        </div>
      </>
    );
  }

  if (blacklisted) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 49 }}>
        <Modal show backdrop={false}>
          <Panel>
            <Blacklisted />
          </Panel>
        </Modal>
      </div>
    );
  }

  const stateValue = typeof state === "object" ? Object.keys(state)[0] : state;

  const onHide = () => {
    listed ||
    listingDeleted ||
    traded ||
    sniped ||
    marketPriceChanged ||
    tradeAlreadyFulfilled
      ? gameService.send("CONTINUE")
      : undefined;
  };

  return (
    <>
      <ToastProvider>
        <ToastPanel />

        <Modal show={SHOW_MODAL[stateValue as StateValues]} onHide={onHide}>
          <Panel
            bumpkinParts={error ? NPC_WEARABLES["worried pete"] : undefined}
          >
            {loading && <Loading />}
            {refreshing && <Refreshing />}
            {buyingSFL && <AddingSFL />}
            {error && <ErrorMessage errorCode={errorCode as ErrorCode} />}
            {purchasing && <Purchasing />}
            {hoarding && <Hoarding />}
            {swarming && <Swarming />}

            {coolingDown && <Cooldown />}
            {gameRules && <Rules />}
            {transacting && <Transaction />}
            {depositing && <Loading text="Depositing" />}
            {trading && <Loading text="Trading" />}
            {traded && <Traded />}
            {listing && <Loading text="Listing" />}
            {listed && <Listed />}
            {deletingListing && <Loading text="Deleting listing" />}
            {listingDeleted && <ListingDeleted />}
            {sniped && <Sniped />}
            {tradeAlreadyFulfilled && <TradeAlreadyFulfilled />}
            {marketPriceChanged && <PriceChange />}
            {promo && <Promo />}
            {airdrop && <AirdropPopup />}
            {showOffers && <OffersPopup />}
            {specialOffer && <VIPOffer />}
            {hasSomethingArrived && <SomethingArrived />}
          </Panel>
        </Modal>

        {claimingAuction && <ClaimAuction />}
        {refundAuction && <RefundAuction />}

        <Introduction />
        <NewMail />

        {provingPersonhood && (
          <Modal
            show={true}
            onHide={() => gameService.send("PERSONHOOD_CANCELLED")}
          >
            <Panel className="text-shadow">
              <PersonhoodContent />
            </Panel>
          </Modal>
        )}

        {children}
      </ToastProvider>
    </>
  );
};
