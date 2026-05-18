import type { Entry } from "@/lib/types";

export function classNames(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}

export function formatDay(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getUsernameFromEmail(email?: string | null): string {
  if (!email) return "Member";
  return email.split("@")[0] || "Member";
}

export function makeInviteCode(title: string): string {
  return `${title.slice(0, 4).toUpperCase()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

export function groupByDay(entries: Entry[]): Record<string, Entry[]> {
  return entries.reduce((acc: Record<string, Entry[]>, entry) => {
    const key = formatDay(entry.createdAt);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(entry);
    return acc;
  }, {});
}