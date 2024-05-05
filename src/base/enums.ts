export enum Stories {
  OBSERVING_SETTINGS_STORY = "observingSettingsStory",
  OBSERVING_COLLECTION_STORY = "observingCollectionStory",
  OBSERVING_SCHOOL_SUBJECT_STORY = "observingSchoolSubjectStory",
  OBSERVING_TOPIC_STORY = "observingTopicStory",
  OBSERVING_FLASHCARD_GROUPS_STORY = "observingFlashcardGroupsStory",
  OBSERVING_FLASHCARD_SET_STORY = "observingFlashcardSetStory",
  OBSERVING_HOMEWORKS_STORY = "observingHomeworksStory",
  OBSERVING_NOTE_STORY = "observingNoteStory",
  OBSERVING_FLASHCARD_QUIZ_STORY = "observingFlashcardQuizStory",
  OBSERVING_SUBTOPIC_STORY = "observingSubtopicStory",
  OBSERVING_PODCASTS_COLLECTION = "observingPodcastsCollection",

  ADD_FLASHCARD_SET_STORY = "addFlashcardSetStory",
  ADD_TOPIC_STORY = "addTopicStory",
  ADD_HOMEWORK_STORY = "addHomeworkStory",
  ADD_FLASHCARD_GROUP_STORY = "addFlashcardGroupStory",
  ADD_RESOURCE_TO_TOPIC_STORY = "addResourceToTopicStory",
  ADD_FLASHCARDS_STORY = "addFlashcardsStory",

  EDIT_FLASHCARD_STORY = "editFlashcardStory",
  EDIT_FLASHCARD_SET_STORY = "editFlashcardSetStory",
  EDIT_HOMEWORK_STORY = "editHomeworkStory",
  EDIT_TOPIC_STORY = "editTopicStory",
  EDIT_SUBTOPIC_STORY = "editSubtopicStory",

  DELETE_FLASHCARD_SET_STORY = "deleteFlashcardSetStory",
  DELETE_HOMEWORK_STORY = "deleteHomeworkStory",
  DELETE_TOPIC_STORY = "deleteTopicStory",
  DELETE_NOTE_STORY = "deleteNoteStory",
  DELETE_SUBTOPIC_STORY = "deleteSubtopicStory",

  GENERATE_IMPROVED_TEXT_STORY = "generateImprovedFlashcardsStory",
  GENERATE_FLASHCARDS_STORY = "generateFlashcardsStory",
  GENERATE_PODCAST_STORY = "generatePodcastStory",

  
}

export enum AdditionalTags {
  MOCKUP_DATA = "mockupData",
  NAVIGATE_BACK = "navigateBack",
  APP_STATE_ENTITY = "appStateEntity",
  SIDEBAR_VISIBLE = "sidebarVisible",
  SETTING_VISIBLE = "settingVisible",
  LIGHT_THEME = "lightMode",
  DARK_THEME = "darkMode",
  ANSWERD_RIGHT = "answeredRight",
  ANSWERD_WRONG = "answeredWrong",
  PLAYING = "playing",
  PAUSED = "paused",
}

export enum NavigationLinks {
  OVERVIEW = "overview",
  STUDY = "study",
  HOMEWORKS = "homeworks",
  EXAMS = "exams",
  COLLECTION = "collection",
  GROUPS = "groups",
}

export enum DataTypes {
  HOMEWORK = "homework",
  FLASHCARD_GROUP = "flashcardGroup",
  EXAM = "exam",
  SCHOOL_SUBJECT = "schoolSubject",
  TOPIC = "topic",
  NOTE = "note",
  FLASHCARD_SET = "flashcardSet",
  FLASHCARD = "flashcard",
  SUBTOPIC = "subTopic",
  PODCAST = "podcast",
}

export enum SupportedLanguages {
  DE = "de",
  EN = "en",
}

export enum SupportedThemes {
  LIGHT = "light",
  DARK = "dark",
}
