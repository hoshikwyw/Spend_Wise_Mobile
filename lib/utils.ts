function hexToHSL(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function deriveAccentShades(hex: string) {
  const { h, s, l } = hexToHSL(hex);
  return {
    base: hex,
    light: hslToHex(h, Math.min(s + 5, 100), Math.min(l + 15, 95)),
    dark: hslToHex(h, s, Math.max(l - 10, 10)),
  };
}

export function formatCurrency(amount: number): string {
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)} MMK`;
}

export function getMonthStart(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

export function getMonthName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

export function getDateRange(filterType: "daily" | "monthly" | "yearly", offset: number) {
  const now = new Date();
  if (filterType === "daily") {
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const dateStr = target.toISOString().split("T")[0];
    const nextDay = new Date(target); nextDay.setDate(nextDay.getDate() + 1);
    return { start: dateStr, end: nextDay.toISOString().split("T")[0], label: getDateLabel(dateStr) };
  }
  if (filterType === "monthly") {
    const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const start = getMonthStart(target);
    const [y, m] = start.split("-").map(Number);
    const end = new Date(y, m, 1).toISOString().split("T")[0];
    return { start, end, label: getMonthName(start) };
  }
  const year = now.getFullYear() + offset;
  return { start: `${year}-01-01`, end: `${year + 1}-01-01`, label: String(year) };
}
