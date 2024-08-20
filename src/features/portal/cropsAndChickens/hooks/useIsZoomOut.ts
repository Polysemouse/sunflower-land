import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "settings.zoomOut";
export const ZOOM_OUT_EVENT = "zoomOutChanged";

export function cacheZoomOutSetting(value: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(ZOOM_OUT_EVENT, { detail: value }));
}

export function getZoomOutSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : false;
}

export const useIsZoomOut = () => {
  const [isZoomOut, setIsZoomOut] = useState(getZoomOutSetting());

  const toggleZoomOut = () => {
    const newValue = !isZoomOut;
    setIsZoomOut(newValue);
    cacheZoomOutSetting(newValue);
  };

  useEffect(() => {
    const handleZoomOutChange = (event: CustomEvent) => {
      setIsZoomOut(event.detail);
    };

    window.addEventListener(ZOOM_OUT_EVENT as any, handleZoomOutChange);

    return () => {
      window.removeEventListener(ZOOM_OUT_EVENT as any, handleZoomOutChange);
    };
  }, []);

  return { isZoomOut, toggleZoomOut };
};
