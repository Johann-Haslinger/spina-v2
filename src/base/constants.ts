import { formatNavLinkAsPath } from "../utils";
import { NavigationLinks } from "./enums";

export const ADDITIONAL_TAGS = [

]



export const NAV_LINKS = [
  {
    title: NavigationLinks.OVERVIEW,
    path: formatNavLinkAsPath(NavigationLinks.OVERVIEW),
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

export const COLOR_ITEMS: { color: string; backgroundColor: string }[] = [
  {
    color: "#EEEEEC",
    backgroundColor: "#3D65E1",
  },
  {
    color: "#FA912C",
    backgroundColor: "#F4D4BD",
  },
  {
    color: "#FA912C",
    backgroundColor: "#98C3D3",
  },
  {
    color: "#E7C152",
    backgroundColor: "#F49527",
  },
  {
    color: "#3769E0",
    backgroundColor: "#E6C157",
  },
  {
    color: "#DDE2C4",
    backgroundColor: "#3764E5",
  },
  {
    color: "#F29533",
    backgroundColor: "#EEB1D2",
  },
  {
    color: "#EFF0F7",
    backgroundColor: "#E6C157",
  },
  {
    color: "#8ACAE5",
    backgroundColor: "#EADFCB",
  },
  {
    color: "#EDB1CF",
    backgroundColor: "#93BBA0",
  },
  {
    color: "#F4EAF3",
    backgroundColor: "#F97755",
  },
];
