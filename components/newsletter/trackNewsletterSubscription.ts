"use client";

export type NewsletterSourceType =
  | "newsletter_page_fr"
  | "newsletter_page_en"
  | "coming_soon_fr"
  | "coming_soon_en";

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

export function buildNewsletterAnalyticsContext(
  sourceType: NewsletterSourceType
) {
  const params = new URLSearchParams(window.location.search);

  return {
    clientEventId: crypto.randomUUID(),
    sessionId: getSessionId(),
    pagePath: window.location.pathname,
    referrer: document.referrer || null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    sourceType,
  };
}
