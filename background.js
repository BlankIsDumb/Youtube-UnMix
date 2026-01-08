const lastRedirectForTab = new Map(); // tabId -> last URL redirected from

function buildCleanWatchUrl(u) {
  // if tab doesnt have watch url, quit
  if (u.pathname !== "/watch") return null;

  const v = u.searchParams.get("v");
  if (!v) return null;

  const hasList = u.searchParams.has("list"); //if url has &list
  const startRadio = u.searchParams.get("start_radio"); //if url has &start_radio

  // trigger if both passes
  if (!hasList || startRadio !== "1") return null;

  // Build the clean URL. “only the video page” usually means keep just v.
  const clean = new URL(u.origin + "/watch");
  clean.searchParams.set("v", v);

  // Preserve timestamp if present
  const t = u.searchParams.get("t") || u.searchParams.get("start");
  if (t) clean.searchParams.set("t", t);

  return clean.toString();
}

function maybeRedirect(tabId, rawUrl) {
  if (!rawUrl) return;

  // quit early if extension is not needed
  if (
    !rawUrl.includes("youtube.com/watch") ||
    !rawUrl.includes("list=") ||
    !rawUrl.includes("start_radio=1")
  ) {
    return;
  }

  // Parse URL
  let u;
  try {
    u = new URL(rawUrl);
  } catch {
    return;
  }

  // Safety: make sure it really is a watch page
  if (u.pathname !== "/watch") return;

  const v = u.searchParams.get("v");
  if (!v) return;

  // Loop guard
  const last = lastRedirectForTab.get(tabId);
  if (last === rawUrl) return;

  lastRedirectForTab.set(tabId, rawUrl);

  const clean = new URL(u.origin + "/watch");
  clean.searchParams.set("v", v);

  chrome.tabs.update(tabId, { url: clean.toString() });
}


// Fires when the URL changes (navigation, redirects, SPA updates that pushState)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    maybeRedirect(tabId, changeInfo.url);
  }
});

// Also catch tab replacements / restores where onUpdated sometimes doesn’t include url
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab?.url) maybeRedirect(tabId, tab.url);
  } catch {
    // ignore
  }
});
