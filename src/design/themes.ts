import { ThemeId } from "../types.js";

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  fonts: {
    display: string;
    body: string;
    mono: string;
  };
  colors: {
    background: string;
    surface: string;
    textStrong: string;
    textSoft: string;
    accent: string;
    accentAlt: string;
    border: string;
    good: string;
  };
}

export const themes: Record<ThemeId, ThemeTokens> = {
  aurora: {
    id: "aurora",
    name: "Aurora Editorial",
    fonts: {
      display: "Aptos Display",
      body: "Aptos",
      mono: "Cascadia Code"
    },
    colors: {
      background: "F7F8FC",
      surface: "FFFFFF",
      textStrong: "171A23",
      textSoft: "535A6C",
      accent: "0E5CFF",
      accentAlt: "16C5B8",
      border: "DDE4F4",
      good: "07835E"
    }
  },
  graphite: {
    id: "graphite",
    name: "Graphite Boardroom",
    fonts: {
      display: "Aptos Display",
      body: "Aptos",
      mono: "Consolas"
    },
    colors: {
      background: "F2F3F5",
      surface: "FFFFFF",
      textStrong: "101216",
      textSoft: "505A66",
      accent: "222A68",
      accentAlt: "E36D20",
      border: "D5DCE6",
      good: "0A7B5F"
    }
  },
  ember: {
    id: "ember",
    name: "Ember Momentum",
    fonts: {
      display: "Aptos Display",
      body: "Aptos",
      mono: "Consolas"
    },
    colors: {
      background: "FCF7F2",
      surface: "FFFFFF",
      textStrong: "221810",
      textSoft: "6A5646",
      accent: "E74917",
      accentAlt: "FFB06A",
      border: "F0DFD1",
      good: "1F855A"
    }
  }
};

export function getTheme(themeId: ThemeId = "aurora"): ThemeTokens {
  return themes[themeId] ?? themes.aurora;
}
