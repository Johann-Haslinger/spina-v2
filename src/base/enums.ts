export enum Stories {
  OBSERVING_COLLECTION_STORY = "observingCollectionStory",
  OBSERVING_SCHOOL_SUBJECT_STORY = "observingSchoolSubjectStory",
  OBSERVING_HOMEWORKS_STORY = "observingHomeworksStory",
  OBSERVING_SETTINGS_STORY = "observingSettingsStory",
  OBSERVING_FLASHCARD_GROUPS_STORY = "observingFlashcardGroupsStory",
  OBSERVING_FLASHCARD_SET_STORY = "observingFlashcardSetStory",
  OBSERVING_TOPIC_STORY = "observingTopicStory",

  ADD_TOPIC_STORY = "addTopicStory",
  ADD_HOMEWORK_STORY = "addHomeworkStory",
  ADD_FLASHCARD_GROUP_STORY = "addFlashcardGroupStory",
  ADD_RESOURCE_TO_TOPIC_STORY = "addResourceToTopicStory",

  EDIT_FLASHCARD_STORY = "editFlashcardStory",
  EDIT_FLASHCARD_SET_STORY = "editFlashcardSetStory",

  DELETE_FLASHCARD_SET_STORY = "deleteFlashcardSetStory",
}

export enum AdditionalTags {
  NAVIGATE_BACK = "navigateBack",
  APP_STATE_ENTITY = "appStateEntity",
  SIDEBAR_VISIBLE = "sidebarVisible",
  SETTING_VISIBLE = "settingVisible",
  LIGHT_THEME = "lightMode",
  DARK_THEME = "darkMode",
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
}

export enum SupportedLanguages {
  DE = "de",
  EN = "en",
}

export enum SupportedThemes {
  LIGHT = "light",
  DARK = "dark",
}
