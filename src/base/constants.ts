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

export const COLOR_ITEMS: { color: string; backgroundColor: string, name?: string }[] = [
   {
    color: "#EF9D4A",
    backgroundColor: "#397A45",
    name: "FF7F3B"
  },
  {
    color: "#6D8FD9",
    backgroundColor: "#A3CB63",
    name: "violet"
  },
  {
    color: "#364893",
    backgroundColor: "#6EBED9",
    name: "lavender"
  },
  {
    color: "#B9DA87",
    backgroundColor: "#668FE8",
    name: "green"
  },
  {
    color: "#397A45",
    backgroundColor: "#EF9D4A",
    name: "blue"
  },
  {
    color: "#E76542",
    backgroundColor: "#FFCC00",
    name: "violet"
  },
  {
    color: "#F3A487",
    backgroundColor: "#BF3039",
    name: "yellow"
  },
  {
    color: "#FFCC00",
    backgroundColor: "#E76542",
    name: "violet"
  },
  {
    color: "#FFCC00",
    backgroundColor: "#039FC4",
    name: "yellow"
  },

  {
    color: "#6EBED9",
    backgroundColor: "#364893",
    name: "yellow"
  },

  
  // {
  //   color: "#FF7F3B",
  //   backgroundColor: "#F6D143",
  //   name: "FF7F3B"
  // },
  // {
  //   color: "#FFEE8B",
  //   backgroundColor: "#EC76CB",
  //   name: "violet"
  // },
  // {
  //   color: "#F6D143",
  //   backgroundColor: "#FF7F3B",
  //   name: "lavender"
  // },
  // {
  //   color: "#797AFF",
  //   backgroundColor: "#C4E7E1",
  //   name: "green"
  // },
  // {
  //   color: "#C4E7E1",
  //   backgroundColor: "#797AFF",
  //   name: "blue"
  // },
  // {
  //   color: "#C8C8FF",
  //   backgroundColor: "#1C8493",
  //   name: "violet"
  // },
  // {
  //   color: "#8547F0",
  //   backgroundColor: "#FFEE8B",
  //   name: "yellow"
  // },
  // {
  //   color: "#FFEE8B",
  //   backgroundColor: "#8547F0",
  //   name: "violet"
  // },
  // {
  //   color: "#E5D5CA",
  //   backgroundColor: "#608AFF",
  //   name: "yellow"
  // },
  // {
  //   color: "#1C8493",
  //   backgroundColor: "#C8C8FF",
  //   name: "yellow"
  // },



  // {
  //   color: "#EE7A2C",
  //   backgroundColor: "#B9DA87",
  //   name: "orange"
  // },
  // {
  //   color: "#B9A0FF",
  //   backgroundColor: "#039FC4",
  //   name: "violet"
  // },
  // {
  //   color: "#F4BAB5",
  //   backgroundColor: "#484DAB",
  //   name: "lavender"
  // },
  // {
  //   color: "#00965F",
  //   backgroundColor: "#97A3F7",
  //   name: "green"
  // },
  // {
  //   color: "#0B86D1",
  //   backgroundColor: "#EF9D4A",
  //   name: "blue"
  // },
  // {
  //   color: "#B9A0FF",
  //   backgroundColor: "#FE9690",
  //   name: "violet"
  // },
  // {
  //   color: "#F4CF54",
  //   backgroundColor: "#32ADFF",
  //   name: "yellow"
  // },
  // {
  //   color: "#B9A0FF",
  //   backgroundColor: "#007AFF",
  //   name: "violet"
  // },
  // {
  //   color: "#F4CF54",
  //   backgroundColor: "#B97BD9",
  //   name: "yellow"
  // },

    // original

  // {
  //   color: "#EE7A2C",
  //   backgroundColor: "#F4CF54",
  //   name: "orange"
  // },
  // {
  //   color: "#B9A0FF",
  //   backgroundColor: "#00965F",
  //   name: "violet"
  // },
  // {
  //   color: "#F4BAB5",
  //   backgroundColor: "#0B86D1",
  //   name: "lavender"
  // },
  // {
  //   color: "#00965F",
  //   backgroundColor: "#B9A0FF",
  //   name: "green"
  // },
  // {
  //   color: "#0B86D1",
  //   backgroundColor: "#F4BAB5",
  //   name: "blue"
  // },
  // {
  //   color: "#B9A0FF",
  //   backgroundColor: "#446DFF",
  //   name: "violet"
  // },
  // {
  //   color: "#F4CF54",
  //   backgroundColor: "#EE7A2C",
  //   name: "yellow"
  // },

  // { color: '#FF3B30', name: 'Red', backgroundColor: '#FFB9B6' },
  // { color: '#FF9500', name: 'Orange', backgroundColor: '#FFD3A6' },
  // { color: '#FFCC00', name: 'Yellow', backgroundColor: '#FFE6A6' },
  // { color: '#34C759', name: 'Green', backgroundColor: '#A8E3B7' },
  // { color: '#30B0C7', name: 'Tea', backgroundColor: '#A6D9E3' },
  // { color: '#32ADFF', name: 'Cyan', backgroundColor: '#A7D8EF' },
  // { color: '#007AFF', name: 'Blue', backgroundColor: '#93C4F9' },
  // { color: '#5856D6', name: 'Indigo', backgroundColor: '#C5C5EB' },
  // { color: '#AF52DE', name: 'Purple', backgroundColor: '#D9B4EC' },
  // { color: '#FF2D55', name: 'Pink', backgroundColor: '#F9A5B5' },
  // { color: '#A2845E', name: 'Brown', backgroundColor: '#D4C8B9' },

  // { color: 'rgb(255, 59, 48)', name: 'Red', backgroundColor: 'rgba(255, 59, 48, 0.45)' },
  // { color: 'rgb(255, 149, 0)', name: 'Orange', backgroundColor: 'rgba(255, 149, 0, 0.45)' },
  // { color: 'rgb(255, 204, 0)', name: 'Yellow', backgroundColor: 'rgba(255, 204, 0, 0.450)' },
  // { color: 'rgb(52, 199, 89)', name: 'Green', backgroundColor: 'rgba(52, 199, 89, 0.45)' },
  // { color: 'rgb(0, 199, 190)', name: 'Mint', backgroundColor: 'rgba(0, 199, 190, 0.45)' },
  // { color: 'rgb(48, 176, 199)', name: 'Tea', backgroundColor: 'rgba(48, 176, 199, 0.45)' },
  // { color: 'rgb(50, 173, 230)', name: 'Cyan', backgroundColor: 'rgba(50, 173, 230, 0.45)' },
  // { color: 'rgb(0, 122, 255)', name: 'Blue', backgroundColor: 'rgba(0, 122, 255, 0.45)' },
  // { color: 'rgb(88, 86, 214)', name: 'Indigo', backgroundColor: 'rgba(88, 86, 214, 0.45)' },
  // { color: 'rgb(175, 82, 222)', name: 'Purple', backgroundColor: 'rgba(175, 82, 222, 0.45)' },
  // { color: 'rgb(255, 45, 85)', name: 'Pink', backgroundColor: 'rgba(255, 45, 85, 0.45)' },
  // { color: 'rgb(162, 132, 94)', name: 'Brown', backgroundColor: 'rgba(162, 132, 94, 0.45)' },
  // { color: 'rgb(255, 87, 34)', name: 'Carrot', backgroundColor: 'rgba(255, 87, 34, 0.45)' },
  // { color: 'rgb(255, 162, 0)', name: 'Apricot', backgroundColor: 'rgba(255, 162, 0, 0.45)' },
  // { color: 'rgb(255, 217, 91)', name: 'Lemon', backgroundColor: 'rgba(255, 217, 91, 0.45)' },
  // { color: 'rgb(76, 217, 100)', name: 'Lime', backgroundColor: 'rgba(76, 217, 100, 0.45)' },
  // { color: 'rgb(0, 208, 132)', name: 'Jade', backgroundColor: 'rgba(0, 208, 132, 0.45)' },
  // { color: 'rgb(73, 201, 218)', name: 'Sky', backgroundColor: 'rgba(73, 201, 218, 0.45)' },
  // { color: 'rgb(29, 112, 237)', name: 'Sapphire', backgroundColor: 'rgba(29, 112, 237, 0.45)' },
  // { color: 'rgb(123, 85, 224)', name: 'Lavender', backgroundColor: 'rgba(123, 85, 224, 0.45)' },
  // { color: 'rgb(199, 76, 245)', name: 'Orchid', backgroundColor: 'rgba(199, 76, 245, 0.45)' },
  // { color: 'rgb(255, 64, 129)', name: 'Cherry', backgroundColor: 'rgba(255, 64, 129, 0.45)' },
 
];
