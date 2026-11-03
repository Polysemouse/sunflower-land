// MoonForge Web SDK — error pipeline (POST /api/errors).
import {
  isReady,
  postError,
  getConfig,
  getSessionId,
  unixSeconds,
  BreadcrumbType,
  BreadcrumbLevel,
  ErrorLevel,
  warnLog,
} from "./core.js";
import {
  getDeviceContext,
  getNetworkContext,
  getGameState,
} from "./context.js";

const MAX_BREADCRUMBS = 50;
const store = { breadcrumbs: [], user: null };

function ensure() {
  if (!isReady()) {
    warnLog("call MoonForgeAnalytics.init() before capturing errors.");
    return false;
  }
  return true;
}
function stringTags(tags) {
  const out = {};
  for (const [k, v] of Object.entries(tags ?? {})) out[k] = String(v);
  return out;
}

export function setUser(userId, tags = {}) {
  store.user = { userId, tags: stringTags(tags) };
}
export function clearUser() {
  store.user = null;
}

export function addBreadcrumb(
  message,
  {
    type = BreadcrumbType.User,
    level = BreadcrumbLevel.Info,
    category,
    data,
  } = {},
) {
  const bc = { type, level, message, category, data, timestamp: Date.now() };
  store.breadcrumbs = [...store.breadcrumbs, bc].slice(-MAX_BREADCRUMBS);
  return bc;
}
export function getBreadcrumbs() {
  return [...store.breadcrumbs];
}
export function clearBreadcrumbs() {
  store.breadcrumbs = [];
}

function parseFrames(stack) {
  if (!stack) return [];
  return String(stack)
    .split("\n")
    .map((raw) => {
      const line = raw.trim();
      let m = line.match(/^at (?:(.+?) )?\(?(.+?):(\d+):(\d+)\)?$/); // V8
      if (!m) m = line.match(/^(.*?)@(.+?):(\d+):(\d+)$/); // Firefox/Safari
      if (!m) return null;
      const fn = m[1] && m[1].length ? m[1] : "<anonymous>";
      const filename = m[2];
      return {
        function: fn,
        filename,
        lineno: Number(m[3]),
        colno: Number(m[4]),
        inApp: !filename.includes("node_modules"),
      };
    })
    .filter(Boolean);
}

function baseEnvelope(errorType, errorCategory, errorLevel, extraTags) {
  const cfg = getConfig();
  const payload = {
    game: cfg.gameId,
    errorType,
    errorCategory,
    errorLevel,
    device: getDeviceContext(),
    appVersion: cfg.appVersion,
    buildNumber: cfg.buildNumber,
    sessionId: getSessionId(),
    timestamp: unixSeconds(),
    breadcrumbs: getBreadcrumbs(),
    tags: { ...(store.user?.tags ?? {}), ...stringTags(extraTags) },
  };
  const net = getNetworkContext();
  if (net) payload.network = net;
  const gsv = getGameState();
  if (Object.keys(gsv).length) payload.gameState = gsv;
  if (store.user?.userId) payload.userId = store.user.userId;
  return payload;
}

export function captureException(
  error,
  { level = ErrorLevel.Error, tags = {}, category = "handled" } = {},
) {
  if (!ensure()) return undefined;
  try {
    const e = error instanceof Error ? error : new Error(String(error));
    const payload = {
      ...baseEnvelope("exception", category, level, tags),
      message: String(e.message).slice(0, 5000),
      exceptionClass: e.name || "Error",
      frames: parseFrames(e.stack),
      rawStackTrace: e.stack ? String(e.stack).slice(0, 50000) : undefined,
    };
    return postError({ type: "error", payload });
  } catch {
    return false;
  }
}
export function captureMessage(
  message,
  { level = ErrorLevel.Info, tags = {} } = {},
) {
  if (!ensure()) return undefined;
  try {
    return postError({
      type: "error",
      payload: {
        ...baseEnvelope("custom", "handled", level, tags),
        message: String(message).slice(0, 5000),
      },
    });
  } catch {
    return false;
  }
}
export function captureNetworkError(
  url,
  { method = "GET", statusCode, errorMessage, durationMs, tags = {} } = {},
) {
  if (!ensure()) return undefined;
  try {
    addBreadcrumb(`${method} ${url} -> ${statusCode ?? "failed"}`, {
      type: BreadcrumbType.Network,
      level: BreadcrumbLevel.Error,
    });
    const payload = {
      ...baseEnvelope("network", "handled", ErrorLevel.Error, tags),
      message: String(errorMessage ?? `${method} ${url} failed`).slice(0, 5000),
      networkRequest: {
        url: String(url).slice(0, 2000),
        method,
        statusCode,
        durationMs,
      },
    };
    return postError({ type: "error", payload });
  } catch {
    return false;
  }
}
export function flush() {
  return Promise.resolve(true);
}

// Internal: used by index.js auto-capture.
export function _captureUnhandled(error) {
  return captureException(error, {
    category: "unhandled",
    level: ErrorLevel.Error,
  });
}
