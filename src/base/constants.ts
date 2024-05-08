import { formatNavLinkAsPath } from "../utils/formatNavLinkAsPath";

import { NavigationLinks, SupportedLanguages } from "./enums";

export const SELECTED_LANGUAGE = SupportedLanguages.DE;

export const NAV_LINKS = [
  // {
  //   title: NavigationLinks.OVERVIEW,
  //   path: formatNavLinkAsPath(NavigationLinks.OVERVIEW),
  // },
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

  // {
  //   title: NavigationLinks.GROUPS,
  //   path: formatNavLinkAsPath(NavigationLinks.GROUPS),
  // },
];

export const COLORS = ["#F4CF54", "#00965F", "#0B86D1", "#B9A0FF", "#F4BAB5", "#EE7A2C", "#446DFF"];

export const COLOR_ITEMS: { color: string; backgroundColor: string }[] = [
  {
    color: "#EE7A2C",
    backgroundColor: "#F4CF54",
  },
  {
    color: "#B9A0FF",
    backgroundColor: "#00965F",
  },
  {
    color: "#F4BAB5",
    backgroundColor: "#0B86D1",
  },
  {
    color: "#00965F",
    backgroundColor: "#B9A0FF",
  },
  {
    color: "#0B86D1",
    backgroundColor: "#F4BAB5",
  },
  {
    color: "#B9A0FF",
    backgroundColor: "#446DFF",
  },
  {
    color: "#F4CF54",
    backgroundColor: "#EE7A2C",
  },
 
];
