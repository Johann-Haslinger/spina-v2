import { SupportedLanguages } from "../base/enums";
import { HeaderTexts } from "../base/text";

export const displayHeaderTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    collectionHeaderText: getHeaderText(HeaderTexts.COLLECTION, selectedLanguage),
    homeworksHeaderText: getHeaderText(HeaderTexts.HOMEWORKS, selectedLanguage),
    examsHeaderText: getHeaderText(HeaderTexts.EXAMS, selectedLanguage),
    groupsHeaderText: getHeaderText(HeaderTexts.GROUPS, selectedLanguage),
    overviewHeaderText: getHeaderText(HeaderTexts.OVERVIEW, selectedLanguage),
    settingsHeaderText: getHeaderText(HeaderTexts.SETTINGS, selectedLanguage),
  };
};

const getHeaderText = (headerText: HeaderTexts, selectedLanguage: SupportedLanguages) => {
  switch (headerText) {
    case HeaderTexts.COLLECTION:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Sammlung";
        case SupportedLanguages.EN:
          return "Collection";
        default:
          return "";
      }
    case HeaderTexts.HOMEWORKS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Hausaufgaben";
        case SupportedLanguages.EN:
          return "Homeworks";
        default:
          return "";
      }
    case HeaderTexts.EXAMS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Prüfungen";
        case SupportedLanguages.EN:
          return "Exams";
        default:
          return "";
      }
    case HeaderTexts.GROUPS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Gruppen";
        case SupportedLanguages.EN:
          return "Groups";
        default:
          return "";
      }
    case HeaderTexts.OVERVIEW:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Übersicht";
        case SupportedLanguages.EN:
          return "Overview";
        default:
          return "";
      }
    case HeaderTexts.SETTINGS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Einstellungen";
        case SupportedLanguages.EN:
          return "Settings";
        default:
          return "";
      }
    default:
      return "";
  }
};
