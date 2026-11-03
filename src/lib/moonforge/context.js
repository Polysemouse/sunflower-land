// MoonForge Web SDK — device/network context + game-state store.
const NET_TYPES = new Set(["wifi", "cellular", "ethernet", "none"]);
const gs = { value: {} };

function ua() {
  return globalThis.navigator?.userAgent ?? "";
}
function osVersion(s) {
  const m = s.match(
    /(Windows NT [\d.]+|Mac OS X [\d_]+|Android [\d.]+|iPhone OS [\d_]+|CPU OS [\d_]+)/,
  );
  return (
    (m
      ? m[1].replace(/_/g, ".")
      : globalThis.navigator?.platform || "unknown") || "unknown"
  );
}
function deviceModel(s) {
  if (/iPhone/.test(s)) return "iPhone";
  if (/iPad/.test(s)) return "iPad";
  if (/Android/.test(s)) {
    const m = s.match(/;\s?([^;)]+)\sBuild/);
    return (m ? m[1].trim() : "Android") || "Android";
  }
  const b = s.match(/(Chrome|Firefox|Safari|Edg|OPR)\/[\d.]+/);
  return (b ? `Browser (${b[1]})` : "Browser") || "Browser";
}

export function getDeviceContext() {
  const s = ua();
  const ctx = {
    platform: "web",
    osVersion: osVersion(s),
    deviceModel: deviceModel(s),
  };
  const mem = globalThis.performance?.memory;
  if (mem) {
    ctx.memoryUsedMb = Math.round(mem.usedJSHeapSize / 1048576);
    ctx.memoryAvailableMb = Math.round(mem.jsHeapSizeLimit / 1048576);
  }
  return ctx;
}
export function getNetworkContext() {
  const c = globalThis.navigator?.connection;
  if (!c) return undefined;
  const out = {};
  if (NET_TYPES.has(c.type)) out.type = c.type;
  if (c.effectiveType) out.effectiveType = c.effectiveType;
  return Object.keys(out).length ? out : undefined;
}
export function setGameState(next = {}) {
  gs.value = {
    ...gs.value,
    ...(next.sceneName !== undefined ? { sceneName: next.sceneName } : {}),
    ...(next.gameMode !== undefined ? { gameMode: next.gameMode } : {}),
    ...(next.levelId !== undefined ? { levelId: next.levelId } : {}),
  };
}
export function setGameStateData(k, v) {
  gs.value = {
    ...gs.value,
    customData: { ...(gs.value.customData ?? {}), [k]: v },
  };
}
export function getGameState() {
  return {
    ...gs.value,
    ...(gs.value.customData ? { customData: { ...gs.value.customData } } : {}),
  };
}
export function clearGameState() {
  gs.value = {};
}
