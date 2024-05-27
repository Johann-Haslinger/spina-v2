import { formatNavLinkAsPath } from "../utils/formatNavLinkAsPath";

import { NavigationLinks, SupportedLanguages } from "./enums";

export const SELECTED_LANGUAGE = SupportedLanguages.DE;

export const NAV_LINKS = [
  {
    title: NavigationLinks.OVERVIEW,
    path: formatNavLinkAsPath(NavigationLinks.OVERVIEW),
  },
  {
    title: NavigationLinks.STUDY,
    path: formatNavLinkAsPath(NavigationLinks.STUDY),
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

  {
    title: NavigationLinks.GROUPS,
    path: formatNavLinkAsPath(NavigationLinks.GROUPS),
  },
];

export const COLORS = ["#F4CF54", "#00965F", "#0B86D1", "#B9A0FF", "#F4BAB5", "#EE7A2C", "#446DFF"];

export const COLOR_ITEMS: { color: string; accentColor: string; name?: string; backgroundColor: string }[] = [
  {
    color: "#EF9D4A",
    accentColor: "#397A45",
    name: "FF7F3B",
    backgroundColor: "#97B79D",
  },
  {
    color: "#6D8FD9",
    accentColor: "#A3CB63",
    name: "violet",
    backgroundColor: "#CBE0AB",
  },
  {
    color: "#364893",
    accentColor: "#6EBED9",
    name: "lavender",
    backgroundColor: "#B1D9E7",
  },
  {
    color: "#B9DA87",
    accentColor: "#668FE8",
    name: "green",
    backgroundColor: "#ADC1EE",
  },
  {
    color: "#397A45",
    accentColor: "#EF9D4A",
    name: "blue",
    backgroundColor: "#F2C99F",
  },
  {
    color: "#E76542",
    accentColor: "#FFCC00",
    name: "violet",
    backgroundColor: "#FAE07A",
  },
  {
    color: "#F3A487",
    accentColor: "#BF3039",
    name: "yellow",
    backgroundColor: "#DA9297",
  },
  {
    color: "#FFCC00",
    accentColor: "#E76542",
    name: "violet",
    backgroundColor: "#EEAD9B",
  },
  {
    color: "#FFCC00",
    accentColor: "#039FC4",
    name: "yellow",
    backgroundColor: "#7CCADC",
  },
  {
    color: "#6EBED9",
    accentColor: "#364893",
    name: "yellow",
    backgroundColor: "#959EC4",
  },
];
