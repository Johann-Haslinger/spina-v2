import { formatNavLinkAsPath } from '../utils/formatNavLinkAsPath';

import { NavigationLink, SupportedLanguage } from './enums';

export const SELECTED_LANGUAGE = SupportedLanguage.DE;

export const MEDIUM_DEVICE_WIDTH = 700;

export const LARGE_DEVICE_WIDTH = 1400;

export const MAX_MASTERY_LEVEL = 5;
export const MIN_MASTERY_LEVEL = 0;

export const NAV_LINKS = [
  {
    title: NavigationLink.OVERVIEW,
    path: formatNavLinkAsPath(NavigationLink.OVERVIEW),
  },
  {
    title: NavigationLink.FLASHCARDS,
    path: formatNavLinkAsPath(NavigationLink.FLASHCARDS),
  },
  {
    title: NavigationLink.HOMEWORKS,
    path: formatNavLinkAsPath(NavigationLink.HOMEWORKS),
  },
  {
    title: NavigationLink.EXAMS,
    path: formatNavLinkAsPath(NavigationLink.EXAMS),
  },
  {
    title: NavigationLink.COLLECTION,
    path: formatNavLinkAsPath(NavigationLink.COLLECTION),
  },
];

export const COLORS = [
  '#668FE8',
  '#A3CB63',
  '#FF0000',
  '#DB00FF',
  '#8F00FF',
  '#0000FF',
  '#0094FF',
  '#00E0FF',
  '#0ECB65',
];

export const COLOR_ITEMS: {
  color: string;
  name?: string;
  backgroundColor: string;
}[] = [
  {
    color: '#668FE8',
    name: 'lavendar',
    backgroundColor: '#ADC1EE',
  },
  {
    color: '#A3CB63',
    name: 'green',
    backgroundColor: '#CBE0AB',
  },
  {
    color: '#6EBED9',
    name: 'light blue',
    backgroundColor: '#B1D9E7',
  },

  {
    color: '#EF9D4A',
    name: 'orange',
    backgroundColor: '#F2C99F',
  },

  {
    color: '#E76542',
    name: 'red',
    backgroundColor: '#EEAD9B',
  },

  {
    color: '#BF3039',
    name: 'camin',
    backgroundColor: '#DA9297',
  },
  {
    color: '#397A45',
    name: 'dark green',
    backgroundColor: '#97B79D',
  },
  {
    color: '#039FC4',
    name: 'blue',
    backgroundColor: '#7CCADC',
  },
  {
    color: '#364893',
    name: 'navy',
    backgroundColor: '#959EC4',
  },
];
