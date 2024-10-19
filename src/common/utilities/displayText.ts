import { SupportedLanguage } from '../types/enums';
import {
  ACTION_TEXT_DATA,
  ALERT_TEXT_DATA,
  BUTTON_TEXT_DATA,
  DATA_TYPE_TEXT_DATA,
  HEADER_TEXT_DATA,
  LABEL_TEXT_DATA,
} from '../types/textData';

export const displayHeaderTexts = (selectedLanguage: SupportedLanguage) => {
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
    flashcardTest: HEADER_TEXT_DATA.flashcard_test[selectedLanguage],
    blurting: HEADER_TEXT_DATA.blurting[selectedLanguage],
    profile: HEADER_TEXT_DATA.profile[selectedLanguage],
    homeworksArchive: HEADER_TEXT_DATA.homeworks_archive[selectedLanguage],
  };
};
export const displayAlertTexts = (selectedLanguage: SupportedLanguage) => {
  return {
    noContentAddedTitle: ALERT_TEXT_DATA.no_content_added_title[selectedLanguage],
    noContentAddedSubtitle: ALERT_TEXT_DATA.no_content_added_subtitle[selectedLanguage],
    noDescription: ALERT_TEXT_DATA.no_description[selectedLanguage],
    noTopics: ALERT_TEXT_DATA.no_topics[selectedLanguage],
    noTitle: ALERT_TEXT_DATA.no_title[selectedLanguage],
    deleteAlertTitle: ALERT_TEXT_DATA.deleting_alert_title[selectedLanguage],
    deleteAlertSubtitle: ALERT_TEXT_DATA.deleting_alert_subtitle[selectedLanguage],
    noUserSignedIn: ALERT_TEXT_DATA.no_user_signed_in[selectedLanguage],
    noLearningGroups: ALERT_TEXT_DATA.no_learning_groups[selectedLanguage],
  };
};

export const displayButtonTexts = (selectedLanguage: SupportedLanguage) => {
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
    more: BUTTON_TEXT_DATA.more[selectedLanguage],
  };
};

export const displayActionTexts = (selectedLanguage: SupportedLanguage) => {
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
    addFlashcards: ACTION_TEXT_DATA.add_flashcards[selectedLanguage],
    copy: ACTION_TEXT_DATA.copy[selectedLanguage],
    cut: ACTION_TEXT_DATA.cut[selectedLanguage],
    duplicate: ACTION_TEXT_DATA.duplicate[selectedLanguage],
    addToLearningGroup: ACTION_TEXT_DATA.add_to_learning_group[selectedLanguage],
    generateFromImage: ACTION_TEXT_DATA.generate_from_image[selectedLanguage],
    startLernSession: ACTION_TEXT_DATA.start_lern_session[selectedLanguage],
    flashcardTest: ACTION_TEXT_DATA.flashcard_test[selectedLanguage],
    blurting: ACTION_TEXT_DATA.blurting[selectedLanguage],
    generateExercise: ACTION_TEXT_DATA.generate_exercise[selectedLanguage],
    addTopic: ACTION_TEXT_DATA.add_topic[selectedLanguage],
    regenerateImage: ACTION_TEXT_DATA.regenerate_image[selectedLanguage],
    editImage: ACTION_TEXT_DATA.edit_image[selectedLanguage],
    addFile: ACTION_TEXT_DATA.add_file[selectedLanguage],
    addText: ACTION_TEXT_DATA.add_text[selectedLanguage],
    archivate: ACTION_TEXT_DATA.archivate[selectedLanguage],
    deArchivate: ACTION_TEXT_DATA.de_archivate[selectedLanguage],
    addImage: ACTION_TEXT_DATA.add_image[selectedLanguage],
  };
};

export const displayLabelTexts = (selectedLanguage: SupportedLanguage) => {
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
    style: LABEL_TEXT_DATA.style[selectedLanguage],
    layout: LABEL_TEXT_DATA.layout[selectedLanguage],
    addContent: LABEL_TEXT_DATA.add_content[selectedLanguage],
    group: LABEL_TEXT_DATA.group[selectedLanguage],
    share: LABEL_TEXT_DATA.share[selectedLanguage],
    sapientor: LABEL_TEXT_DATA.sapientor[selectedLanguage],
    delete: LABEL_TEXT_DATA.delete[selectedLanguage],
    adjustImage: LABEL_TEXT_DATA.adjust_image[selectedLanguage],
    imageSize: LABEL_TEXT_DATA.image_size[selectedLanguage],
    color: LABEL_TEXT_DATA.color[selectedLanguage],
    pendingResources: LABEL_TEXT_DATA.pending_resources[selectedLanguage],
    recentlyAdded: LABEL_TEXT_DATA.recently_added[selectedLanguage],
    kanban: LABEL_TEXT_DATA.kanban[selectedLanguage],
  };
};

export const displayDataTypeTexts = (selectedLanguage: SupportedLanguage) => {
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
    lernvideo: DATA_TYPE_TEXT_DATA.lernvideo[selectedLanguage],
    exercise: DATA_TYPE_TEXT_DATA.exercise[selectedLanguage],
  };
};
