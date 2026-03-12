export const EVENT_NAME = "UNCONF FOR NO REASON";
export const EVENT_DATE = "2026-04-25";
export const EVENT_START = "2026-04-25T13:00:00-04:00"; // 1pm EDT
export const EVENT_END = "2026-04-25T17:00:00-04:00"; // 5pm EDT
export const EVENT_LOCATION = "1629 Columbia Rd NW Apt 311, Washington DC";
export const EVENT_TIMEZONE = "America/New_York";

export const REACTION_EMOJIS = ["🔥", "🤮", "💀", "🙏", "👍", "🎉"] as const;

export const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD ?? "anarchy";

export const ADMIN_NAME = "quinn";

export const SLOT_TYPES = {
  lightning: { label: "LIGHTNING", duration: 10, color: "text-yellow-400" },
  standard: { label: "STANDARD", duration: 20, color: "text-primary" },
  micro: { label: "MICRO", duration: 5, color: "text-accent" },
} as const;
