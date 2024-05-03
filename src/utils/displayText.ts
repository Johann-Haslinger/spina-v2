import { DataTypes, SupportedLanguages } from "../base/enums";
import { ActionTexts, AlertTexts, ButtonTexts, HeaderTexts, LabelTexts } from "../base/textTypes";
import {
  ACTION_TEXT_DATA,
  ALERT_TEXT_DATA,
  BUTTON_TEXT_DATA,
  DATA_TYPE_TEXT_DATA,
  HEADER_TEXT_DATA,
  LABEL_TEXT_DATA,
} from "../base/textData";

export const displayHeaderTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    collectionHeaderText: getHeaderText(HeaderTexts.COLLECTION, selectedLanguage),
    homeworksHeaderText: getHeaderText(HeaderTexts.HOMEWORKS, selectedLanguage),
    studyHeaderText: getHeaderText(HeaderTexts.STUDY, selectedLanguage),
    examsHeaderText: getHeaderText(HeaderTexts.EXAMS, selectedLanguage),
    groupsHeaderText: getHeaderText(HeaderTexts.GROUPS, selectedLanguage),
    overviewHeaderText: getHeaderText(HeaderTexts.OVERVIEW, selectedLanguage),
    settingsHeaderText: getHeaderText(HeaderTexts.SETTINGS, selectedLanguage),
    whatToDoHeaderText: getHeaderText(HeaderTexts.WHAT_TO_DO, selectedLanguage),
  };
};

const getHeaderText = (headerText: HeaderTexts, selectedLanguage: SupportedLanguages) => {
  switch (headerText) {
    case HeaderTexts.COLLECTION:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.COLLECTION.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.COLLECTION.EN;
        default:
          return "";
      }

    case HeaderTexts.STUDY:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.STUDY.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.STUDY.EN;
        default:
          return "";
      }

    case HeaderTexts.HOMEWORKS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.HOMEWORKS.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.HOMEWORKS.EN;
        default:
          return "";
      }
    case HeaderTexts.EXAMS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.EXAMS.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.EXAMS.EN;
        default:
          return "";
      }
    case HeaderTexts.GROUPS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.GROUPS.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.GROUPS.EN;
        default:
          return "";
      }
    case HeaderTexts.OVERVIEW:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.OVERVIEW.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.OVERVIEW.EN;
        default:
          return "";
      }
    case HeaderTexts.SETTINGS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.SETTINGS.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.SETTINGS.EN;
        default:
          return "";
      }
    case HeaderTexts.WHAT_TO_DO:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return HEADER_TEXT_DATA.WHAT_TO_DO.DE;
        case SupportedLanguages.EN:
          return HEADER_TEXT_DATA.WHAT_TO_DO.EN;
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
    noDescription: getAlertText(AlertTexts.NO_DESCRIPTION, selectedLanguage),
    noTopics: getAlertText(AlertTexts.NO_TOPICS, selectedLanguage),
    noTitle: getAlertText(AlertTexts.NO_TITLE, selectedLanguage),
    deleteAlertTitle: getAlertText(AlertTexts.DELETE_ALERT_TITLE, selectedLanguage),
    deleteAlertSubtitle: getAlertText(AlertTexts.DELETE_ALERT_SUBTITLE, selectedLanguage),
    noUserSignedIn: getAlertText(AlertTexts.NO_USER_SIGNED_IN, selectedLanguage),
  };
};

const getAlertText = (alertText: AlertTexts, selectedLanguage: SupportedLanguages) => {
  switch (alertText) {
    case AlertTexts.NO_CONTENT_ADDED_TITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_CONTENT_ADDED_TITLE.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_CONTENT_ADDED_TITLE.EN;
        default:
          return "";
      }
    case AlertTexts.NO_CONTENT_ADDED_SUBTITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_CONTENT_ADDED_SUBTITLE.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_CONTENT_ADDED_SUBTITLE.EN;
        default:
          return "";
      }
    case AlertTexts.NO_DESCRIPTION:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_DESCRIPTION.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_DESCRIPTION.EN;
        default:
          return "";
      }
    case AlertTexts.NO_TOPICS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_TOPICS.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_TOPICS.EN;
        default:
          return "";
      }
    case AlertTexts.NO_TITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_TITLE.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_TITLE.EN;
        default:
          return "";
      }
    case AlertTexts.DELETE_ALERT_TITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.DELETE_ALERT_TITLE.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.DELETE_ALERT_TITLE.EN;
        default:
          return "";
      }
    case AlertTexts.DELETE_ALERT_SUBTITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.DELETE_ALERT_SUBTITLE.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.DELETE_ALERT_SUBTITLE.EN;
        default:
          return "";
      }
    case AlertTexts.NO_USER_SIGNED_IN:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ALERT_TEXT_DATA.NO_USER_SIGNED_IN.DE;
        case SupportedLanguages.EN:
          return ALERT_TEXT_DATA.NO_USER_SIGNED_IN.EN;
        default:
          return "";
      }
    default:
      return "";
  }
};

export const displayButtonTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    back: getButtonText(ButtonTexts.BACK, selectedLanguage),
    save: getButtonText(ButtonTexts.SAVE, selectedLanguage),
    cancel: getButtonText(ButtonTexts.CANCEL, selectedLanguage),
    delete: getButtonText(ButtonTexts.DELETE, selectedLanguage),
    done: getButtonText(ButtonTexts.DONE, selectedLanguage),
    logIn: getButtonText(ButtonTexts.LOG_IN, selectedLanguage),
    logOut: getButtonText(ButtonTexts.LOG_OUT, selectedLanguage),
  };
};

const getButtonText = (buttonText: ButtonTexts, selectedLanguage: SupportedLanguages) => {
  switch (buttonText) {
    case ButtonTexts.BACK:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.BACK.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.BACK.EN;
        default:
          return "";
      }
    case ButtonTexts.DELETE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.DELETE.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.DELETE.EN;
        default:
          return "";
      }
    case ButtonTexts.SAVE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.SAVE.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.SAVE.EN;
        default:
          return "";
      }
    case ButtonTexts.CANCEL:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.CANCEL.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.CANCEL.EN;
        default:
          return "";
      }
    case ButtonTexts.DONE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.DONE.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.DONE.EN;
        default:
          return "";
      }
    case ButtonTexts.LOG_IN:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.LOG_IN.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.LOG_IN.EN;
        default:
          return "";
      }
    case ButtonTexts.LOG_OUT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return BUTTON_TEXT_DATA.LOG_OUT.DE;
        case SupportedLanguages.EN:
          return BUTTON_TEXT_DATA.LOG_OUT.EN;
        default:
          return "";
      }
    default:
      return "";
  }
};

export const displayActionTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    delete: getActionText(ActionTexts.DELETE, selectedLanguage),
    edit: getActionText(ActionTexts.EDIT, selectedLanguage),
    cancel: getActionText(ActionTexts.CANCEL, selectedLanguage),
    quiz: getActionText(ActionTexts.QUIZ, selectedLanguage),
    note: getActionText(ActionTexts.NOTE, selectedLanguage),
    flashcards: getActionText(ActionTexts.FLASHCARDS, selectedLanguage),
    improveText: getActionText(ActionTexts.IMPROVE_TEXT, selectedLanguage),
    generateFlashcards: getActionText(ActionTexts.GENERATE_FLASHCARDS, selectedLanguage),
    generatePodcast: getActionText(ActionTexts.GENERATE_PODCAST, selectedLanguage),
  };
};

const getActionText = (actionText: ActionTexts, selectedLanguage: SupportedLanguages) => {
  switch (actionText) {
    case ActionTexts.DELETE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.DELETE.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.DELETE.EN;
        default:
          return "";
      }
    case ActionTexts.EDIT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.EDIT.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.EDIT.EN;
        default:
          return "";
      }
    case ActionTexts.QUIZ:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.QUIZ.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.QUIZ.EN;
        default:
          return "";
      }
    case ActionTexts.NOTE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.NOTE.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.NOTE.EN;
        default:
          return "";
      }
    case ActionTexts.FLASHCARDS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.FLASHCARDS.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.FLASHCARDS.EN;
        default:
          return "";
      }
    case ActionTexts.CANCEL:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.CANCEL.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.CANCEL.EN;
        default:
          return "";
      }
    case ActionTexts.IMPROVE_TEXT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.IMPROVE_TEXT.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.IMPROVE_TEXT.EN;
        default:
          return "";
      }
    case ActionTexts.GENERATE_FLASHCARDS:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.GENERATE_FLASHCARDS.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.GENERATE_FLASHCARDS.EN;
        default:
          return "";
      }
    case ActionTexts.GENERATE_PODCAST:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return ACTION_TEXT_DATA.GENERATE_PODCAST.DE;
        case SupportedLanguages.EN:
          return ACTION_TEXT_DATA.GENERATE_PODCAST.EN;
        default:
          return "";
      }
    default:
      return "";
  }
};

export const displayLabelTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    title: getLabelText(LabelTexts.TITLE, selectedLanguage),
    description: getLabelText(LabelTexts.DESCRIPTION, selectedLanguage),
    schoolSubject: getLabelText(LabelTexts.SCHOOL_SUBJECT, selectedLanguage),
    dueDate: getLabelText(LabelTexts.DUE_DATE, selectedLanguage),
    select: getLabelText(LabelTexts.SELECT, selectedLanguage),
  };
};

const getLabelText = (labelText: LabelTexts, selectedLanguage: SupportedLanguages) => {
  switch (labelText) {
    case LabelTexts.TITLE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return LABEL_TEXT_DATA.TITLE.DE;
        case SupportedLanguages.EN:
          return LABEL_TEXT_DATA.TITLE.EN;
        default:
          return "";
      }
    case LabelTexts.DESCRIPTION:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return LABEL_TEXT_DATA.DESCRIPTION.DE;
        case SupportedLanguages.EN:
          return LABEL_TEXT_DATA.DESCRIPTION.EN;
        default:
          return "";
      }
    case LabelTexts.SCHOOL_SUBJECT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return LABEL_TEXT_DATA.SCHOOL_SUBJECT.DE;
        case SupportedLanguages.EN:
          return LABEL_TEXT_DATA.SCHOOL_SUBJECT.EN;
        default:
          return "";
      }
    case LabelTexts.DUE_DATE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return LABEL_TEXT_DATA.DUE_DATE.DE;
        case SupportedLanguages.EN:
          return LABEL_TEXT_DATA.DUE_DATE.EN;
        default:
          return "";
      }
    case LabelTexts.SELECT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return LABEL_TEXT_DATA.SELECT.DE;
        case SupportedLanguages.EN:
          return LABEL_TEXT_DATA.SELECT.EN;
        default:
          return "";
      }

    default:
      return "";
  }
};

export const displayDataTypeTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    note: getDataTypeText(DataTypes.NOTE, selectedLanguage),
    homework: getDataTypeText(DataTypes.HOMEWORK, selectedLanguage),
    flashcardGroup: getDataTypeText(DataTypes.FLASHCARD_GROUP, selectedLanguage),
    exam: getDataTypeText(DataTypes.EXAM, selectedLanguage),
    schoolSubject: getDataTypeText(DataTypes.SCHOOL_SUBJECT, selectedLanguage),
    topic: getDataTypeText(DataTypes.TOPIC, selectedLanguage),
    flashcardSet: getDataTypeText(DataTypes.FLASHCARD_SET, selectedLanguage),
    flashcard: getDataTypeText(DataTypes.FLASHCARD, selectedLanguage),
    subTopic: getDataTypeText(DataTypes.SUBTOPIC, selectedLanguage),
    podcast: getDataTypeText(DataTypes.PODCAST, selectedLanguage),
  };
}

const getDataTypeText = (dataType: DataTypes, selectedLanguage: SupportedLanguages) => {
  switch (dataType) {
    case DataTypes.NOTE:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.NOTE.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.NOTE.EN;
        default:
          return "";
      }
    case DataTypes.HOMEWORK:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.HOMEWORK.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.HOMEWORK.EN;
        default:
          return "";
      }
    case DataTypes.FLASHCARD_GROUP:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.FLASHCARD_GROUP.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.FLASHCARD_GROUP.EN;
        default:
          return "";
      }
    case DataTypes.EXAM:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.EXAM.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.EXAM.EN;
        default:
          return "";
      }
    case DataTypes.SCHOOL_SUBJECT:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.SCHOOL_SUBJECT.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.SCHOOL_SUBJECT.EN;
        default:
          return "";
      }
    case DataTypes.TOPIC:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.TOPIC.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.TOPIC.EN;
        default:
          return "";
      }
    case DataTypes.FLASHCARD_SET:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.FLASHCARD_SET.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.FLASHCARD_SET.EN;
        default:
          return "";
      }
    case DataTypes.FLASHCARD:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.FLASHCARD.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.FLASHCARD.EN;
        default:
          return "";
      }
    case DataTypes.SUBTOPIC:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.SUBTOPIC.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.SUBTOPIC.EN;
        default:
          return "";
      }
    case DataTypes.PODCAST:
      switch (selectedLanguage) {
        case SupportedLanguages.DE:
          return DATA_TYPE_TEXT_DATA.PODCAST.DE;
        case SupportedLanguages.EN:
          return DATA_TYPE_TEXT_DATA.PODCAST.EN;
        default:
          return "";
      }
    default:
      return "";
  }

}
  