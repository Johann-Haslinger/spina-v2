import { formatNavLinkAsPath } from '../utilities/formatNavLinkAsPath';
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
  backgroundColorDark?: string;
  colorTheme?: string;
  colorThemeDark?: string;
}[] = [
  {
    color: '#668FE8',
    name: 'lavendar',
    backgroundColor: '#ADC1EE',
    backgroundColorDark: '#0F1523',
    colorTheme: '#97A9D0',
    colorThemeDark: '#070A11',
  },
  {
    color: '#A3CB63',
    name: 'green',
    backgroundColor: '#CBE0AB',
    backgroundColorDark: '#181E0F',
    colorTheme: '#B2C496',
    colorThemeDark: '#0C0F07',
  },
  {
    color: '#6EBED9',
    name: 'light blue',
    backgroundColor: '#B1D9E7',
    backgroundColorDark: '#111D21',
    colorTheme: '#9BBECA',
    colorThemeDark: '#080E10',
  },

  {
    color: '#EF9D4A',
    name: 'orange',
    backgroundColor: '#F2C99F',
    backgroundColorDark: '#24180B',
    colorTheme: '#D4B08B',
    colorThemeDark: '#120C05',
  },

  {
    color: '#E76542',
    name: 'red',
    backgroundColor: '#EEAD9B',
    backgroundColorDark: '#260A0B',
    colorTheme: '#D09788',
    colorThemeDark: '#130505',
  },

  {
    color: '#BF3039',
    name: 'camin',
    backgroundColor: '#DA9297',
    backgroundColorDark: '#260A0B',
    colorTheme: '#BF8084',
    colorThemeDark: '#130505',
  },
  {
    color: '#397A45',
    name: 'dark green',
    backgroundColor: '#97B79D',
    backgroundColorDark: '#0B180E',
    colorTheme: '#84A089',
    colorThemeDark: '#050C07',
  },
  {
    color: '#039FC4',
    name: 'blue',
    backgroundColor: '#7CCADC',
    backgroundColorDark: '#012027',
    colorTheme: '#6CB1C0',
    colorThemeDark: '#101E21',
  },
  {
    color: '#364893',
    name: 'navy',
    backgroundColor: '#959EC4',
    backgroundColorDark: '#0B0E1D',
    colorTheme: '#828AAB',
    colorThemeDark: '#05070E',
  },
];

export const SCHOOL_SUBJECTS: string[] = [
  'Deutsch',
  'Englisch',
  'Französisch',
  'Spanisch',
  'Latein',
  'Mathematik',
  'Biologie',
  'Chemie',
  'Physik',
  'Geschichte',
  'Geographie',
  'Sozialkunde',
  'Kunst',
  'Musik',
  'Literatur',
  'Sport',
  'Ethik',
  'Religion',
  'Informatik',
  'Technik',
  'Darstellendes Spiel',
  'Wirtschaftslehre',
  'Italienisch',
];
