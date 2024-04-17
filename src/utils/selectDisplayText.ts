import { SupportedLanguages } from "../base/enums";
import { AlertTexts, HeaderTexts } from "../base/text";

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


export const displayAlertTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    noContentAddedTitle: getAlertText(AlertTexts.NO_CONTENT_ADDED_TITLE, selectedLanguage),
    noContentAddedSubtitle: getAlertText(AlertTexts.NO_CONTENT_ADDED_SUBTITLE, selectedLanguage),
  };
}

const getAlertText = (alertText: AlertTexts, selectedLanguage: SupportedLanguages) => {
  switch (alertText) {
    case AlertTexts.NO_CONTENT_ADDED_TITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Keine Inhalte hinzugefügt";
        case SupportedLanguages.EN:
          return "No content added";
        default:
          return "";
      }
    case AlertTexts.NO_CONTENT_ADDED_SUBTITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return "Es siht so aus, als hätten Sie noch keine Inhalte hinzugefüg";
        case SupportedLanguages.EN:
          return "It looks like you haven't added any content yet";
        default:
          return "";
        

      }
    default:
      return "";
  }
};