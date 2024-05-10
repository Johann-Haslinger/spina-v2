import { SupportedLanguages } from "../base/enums";
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
    collection: HEADER_TEXT_DATA.collection[selectedLanguage],
    homeworks: HEADER_TEXT_DATA.homeworks[selectedLanguage],
    study: HEADER_TEXT_DATA.study[selectedLanguage],
    exams: HEADER_TEXT_DATA.exams[selectedLanguage],
    groups: HEADER_TEXT_DATA.groups[selectedLanguage],
    overview: HEADER_TEXT_DATA.overview[selectedLanguage],
    settings: HEADER_TEXT_DATA.settings[selectedLanguage],
    whatToDo: HEADER_TEXT_DATA.what_to_do[selectedLanguage],
    podcastCollection: HEADER_TEXT_DATA.podcast_collection[selectedLanguage],
    bookmarkCollection: HEADER_TEXT_DATA.bookmark_collection[selectedLanguage],
    podcasts: HEADER_TEXT_DATA.podcasts[selectedLanguage],
    flashcards: HEADER_TEXT_DATA.flashcards[selectedLanguage],
  };
};
export const displayAlertTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    noContentAddedTitle: ALERT_TEXT_DATA.no_content_added_title[selectedLanguage],
    noContentAddedSubtitle: ALERT_TEXT_DATA.no_content_added_subtitle[selectedLanguage],
    noDescription: ALERT_TEXT_DATA.no_description[selectedLanguage],
    noTopics: ALERT_TEXT_DATA.no_topics[selectedLanguage],
    noTitle: ALERT_TEXT_DATA.no_title[selectedLanguage],
    deleteAlertTitle: ALERT_TEXT_DATA.DELETING_alert_title[selectedLanguage],
    deleteAlertSubtitle: ALERT_TEXT_DATA.DELETING_alert_subtitle[selectedLanguage],
    noUserSignedIn: ALERT_TEXT_DATA.no_user_signed_in[selectedLanguage],
  };
};

export const displayButtonTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    back: BUTTON_TEXT_DATA.back[selectedLanguage],
    save: BUTTON_TEXT_DATA.save[selectedLanguage],
    cancel: BUTTON_TEXT_DATA.cancel[selectedLanguage],
    delete: BUTTON_TEXT_DATA.delete[selectedLanguage],
    done: BUTTON_TEXT_DATA.done[selectedLanguage],
    logIn: BUTTON_TEXT_DATA.log_in[selectedLanguage],
    logOut: BUTTON_TEXT_DATA.log_out[selectedLanguage],
    false: BUTTON_TEXT_DATA.false[selectedLanguage],
    true: BUTTON_TEXT_DATA.true[selectedLanguage],
  };
};

export const displayActionTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    delete: ACTION_TEXT_DATA.delete[selectedLanguage],
    edit: ACTION_TEXT_DATA.edit[selectedLanguage],
    cancel: ACTION_TEXT_DATA.cancel[selectedLanguage],
    quiz: ACTION_TEXT_DATA.quiz[selectedLanguage],
    note: ACTION_TEXT_DATA.note[selectedLanguage],
    flashcards: ACTION_TEXT_DATA.flashcards[selectedLanguage],
    improveText: ACTION_TEXT_DATA.improve_text[selectedLanguage],
    generateFlashcards: ACTION_TEXT_DATA.generate_flashcards[selectedLanguage],
    generatePodcast: ACTION_TEXT_DATA.generate_podcast[selectedLanguage],
    generateText: ACTION_TEXT_DATA.generate_text[selectedLanguage],
    unbookmark: ACTION_TEXT_DATA.unbookmark[selectedLanguage],
    bookmark: ACTION_TEXT_DATA.bookmark[selectedLanguage],
    generateLearnVideo: ACTION_TEXT_DATA.generate_learn_video[selectedLanguage],
  };
};

export const displayLabelTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    title: LABEL_TEXT_DATA.title[selectedLanguage],
    description: LABEL_TEXT_DATA.description[selectedLanguage],
    schoolSubject: LABEL_TEXT_DATA.school_subject[selectedLanguage],
    dueDate: LABEL_TEXT_DATA.due_date[selectedLanguage],
    select: LABEL_TEXT_DATA.select[selectedLanguage],
    remainingCards: LABEL_TEXT_DATA.remaining_cards[selectedLanguage],
    queriedCards: LABEL_TEXT_DATA.queried_cards[selectedLanguage],
    theme: LABEL_TEXT_DATA.theme[selectedLanguage],
    language: LABEL_TEXT_DATA.language[selectedLanguage],
  };
};

export const displayDataTypeTexts = (selectedLanguage: SupportedLanguages) => {
  return {
    note: DATA_TYPE_TEXT_DATA.note[selectedLanguage],
    homework: DATA_TYPE_TEXT_DATA.homework[selectedLanguage],
    flashcardGroup: DATA_TYPE_TEXT_DATA.flashcard_group[selectedLanguage],
    exam: DATA_TYPE_TEXT_DATA.exam[selectedLanguage],
    schoolSubject: DATA_TYPE_TEXT_DATA.school_subject[selectedLanguage],
    topic: DATA_TYPE_TEXT_DATA.topic[selectedLanguage],
    flashcardSet: DATA_TYPE_TEXT_DATA.flashcard_set[selectedLanguage],
    flashcard: DATA_TYPE_TEXT_DATA.flashcard[selectedLanguage],
    subTopic: DATA_TYPE_TEXT_DATA.subtopic[selectedLanguage],
    podcast: DATA_TYPE_TEXT_DATA.podcast[selectedLanguage],
  };
};
