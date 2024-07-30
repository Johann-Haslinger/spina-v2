import { formatNavLinkAsPath } from "../utils/formatNavLinkAsPath";

import { NavigationLinks, SupportedLanguages } from "./enums";

export const SELECTED_LANGUAGE = SupportedLanguages.DE;

export const MEDIUM_DEVICE_WIDTH = 768;

export const LARGE_DEVICE_WIDTH = 1400;

export const NAV_LINKS = [
  {
    title: NavigationLinks.OVERVIEW,
    path: formatNavLinkAsPath(NavigationLinks.OVERVIEW),
  },
  {
    title: NavigationLinks.FLASHCARDS,
    path: formatNavLinkAsPath(NavigationLinks.FLASHCARDS),
  },
  {
    title: NavigationLinks.HOMEWORKS,
    path: formatNavLinkAsPath(NavigationLinks.HOMEWORKS),
  },
  {
    title: NavigationLinks.EXAMS,
    path: formatNavLinkAsPath(NavigationLinks.EXAMS),
  },
  {
    title: NavigationLinks.COLLECTION,
    path: formatNavLinkAsPath(NavigationLinks.COLLECTION),
  },

  // {
  //   title: NavigationLinks.GROUPS,
  //   path: formatNavLinkAsPath(NavigationLinks.GROUPS),
  // },
];

export const COLORS = [
  "#FFD600",
  "#FF8A00",
  "#FF0000",
  "#DB00FF",
  "#8F00FF",
  "#0000FF",
  "#0094FF",
  "#00E0FF",
  "#0ECB65",
];

export const COLOR_ITEMS: {
  color: string;
  accentColor: string;
  name?: string;
  backgroundColor: string;
}[] = [
  {
    color: "#EF9D4A",
    accentColor: "#397A45",
    name: "dark green",
    backgroundColor: "#97B79D",
  },
  {
    color: "#6D8FD9",
    accentColor: "#A3CB63",
    name: "green",
    backgroundColor: "#CBE0AB",
  },
  {
    color: "#364893",
    accentColor: "#6EBED9",
    name: "light blue",
    backgroundColor: "#B1D9E7",
  },
  {
    color: "#B9DA87",
    accentColor: "#668FE8",
    name: "lavendar",
    backgroundColor: "#ADC1EE",
  },
  {
    color: "#397A45",
    accentColor: "#EF9D4A",
    name: "orange",
    backgroundColor: "#F2C99F",
  },

  {
    color: "#FFCC00",
    accentColor: "#E76542",
    name: "red",
    backgroundColor: "#EEAD9B",
  },

  {
    color: "#F3A487",
    accentColor: "#BF3039",
    name: "camin",
    backgroundColor: "#DA9297",
  },
  {
    color: "#E76542",
    accentColor: "#FFCC00",
    name: "yellow",
    backgroundColor: "#FAE07A",
  },
  {
    color: "#FFCC00",
    accentColor: "#039FC4",
    name: "blue",
    backgroundColor: "#7CCADC",
  },
  {
    color: "#6EBED9",
    accentColor: "#364893",
    name: "navy",
    backgroundColor: "#959EC4",
  },
];
