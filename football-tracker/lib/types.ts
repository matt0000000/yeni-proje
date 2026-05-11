export type ValueTrend = "up" | "down" | "stable";
export type PositionGroup = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
export type Currency = "EUR" | "USD" | "GBP" | "TRY";

export interface League {
  id: string;
  slug: string;
  name: string;
  country: string;
  logo: string;
  clubs: Club[];
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  stadium?: string;
  founded?: number;
  leagueId: string;
  leagueSlug: string;
  leagueName: string;
  players: Player[];
}

export interface Player {
  id: string;
  slug: string;
  name: string;
  fullName?: string;
  nationality: string;
  nationalityCode: string;
  position: string;
  positionGroup: PositionGroup;
  age: number;
  dateOfBirth?: string;
  height?: string;
  foot?: string;
  currentValue: number;
  valueTrend: ValueTrend;
  contractExpiry?: string;
  shirtNumber?: number;
  clubId: string;
  clubName: string;
  clubSlug: string;
  clubLogo: string;
  leagueId: string;
  leagueName: string;
  leagueSlug: string;
  valueHistory: ValuePoint[];
}

export interface ValuePoint {
  date: string;
  value: number;
}

export const EXCHANGE_RATES: Record<Currency, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.86,
  TRY: 35.8,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  TRY: "₺",
};

export function formatValue(valueEur: number, currency: Currency = "EUR"): string {
  const rate = EXCHANGE_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];
  const converted = valueEur * rate;

  if (converted >= 1_000_000_000) {
    return `${symbol}${(converted / 1_000_000_000).toFixed(2)}B`;
  }
  if (converted >= 1_000_000) {
    return `${symbol}${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (converted >= 1_000) {
    return `${symbol}${(converted / 1_000).toFixed(0)}K`;
  }
  return `${symbol}${converted.toFixed(0)}`;
}

export function getSquadValue(players: Player[]): number {
  return players.reduce((sum, p) => sum + p.currentValue, 0);
}

export function getMostValuablePlayer(players: Player[]): Player | null {
  if (!players.length) return null;
  return players.reduce((top, p) => (p.currentValue > top.currentValue ? p : top));
}
