"use client";

const SESSION_KEY = "lpv_session_id";

function getSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
  } catch {
    return crypto.randomUUID();
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  data: Record<string, unknown> = {}
) {
  const params = new URLSearchParams(window.location.search);

  const payload = {
    eventName,
    clientEventId: crypto.randomUUID(),
    sessionId: getSessionId(),
    occurredAt: new Date().toISOString(),
    pagePath: window.location.pathname,
    referrer: document.referrer || null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    ...data,
  };

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the visitor experience.
  });
}
