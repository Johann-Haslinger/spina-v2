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
  OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY = "observingBookmarkedFlashcardGroupQuizStory",
  OBSERVING_EXAMS_STORY = "observingExamsStory",
  OBSERVING_PODCAST_STORY = "observingPodcastStory",
  OBSERVING_BOOKMARK_COLLECTION_STORY = "observingBookmarkCollectionStory",

  ADDING_FLASHCARD_SET_STORY = "addFlashcardSetStory",
  ADDING_TOPIC_STORY = "addTopicStory",
  ADDING_HOMEWORK_STORY = "addHomeworkStory",
  ADDING_FLASHCARD_GROUP_STORY = "addFlashcardGroupStory",
  ADDING_RESOURCE_TO_TOPIC_STORY = "addResourceToTopicStory",
  ADDING_FLASHCARDS_STORY = "addFlashcardsStory",
  ADDING_EXAM_STORY = "addExamStory",

  EDITING_FLASHCARD_STORY = "editFlashcardStory",
  EDITING_FLASHCARD_SET_STORY = "editFlashcardSetStory",
  EDITING_HOMEWORK_STORY = "editHomeworkStory",
  EDITING_TOPIC_STORY = "editTopicStory",
  EDITING_SUBTOPIC_STORY = "editSubtopicStory",
  EDITING_EXAM_STORY = "editExamStory",

  DELETING_FLASHCARD_SET_STORY = "deleteFlashcardSetStory",
  DELETING_HOMEWORK_STORY = "deleteHomeworkStory",
  DELETING_TOPIC_STORY = "deleteTopicStory",
  DELETING_NOTE_STORY = "deleteNoteStory",
  DELETING_SUBTOPIC_STORY = "deleteSubtopicStory",
  DELETING_EXAM_STORY = "deleteExamStory",
  
  GENERATING_IMPROVED_TEXT_STORY = "generateImprovedFlashcardsStory",
  GENERATING_FLASHCARDS_STORY = "generateFlashcardsStory",
  GENERATING_PODCAST_STORY = "generatePodcastStory",
  GENERATING_TEXT_FROM_FLASHCARDS_STORY = "generateTextFromFlashcardsStory",
  GENERATING_PODCAST_FROM_FLASHCARDS_STORY = "generatePodcastFromFlashcardsStory",
  GENERATING_LEARN_VIDEO_STORY = "generateLearnVideoStory",


  
}

export enum AdditionalTags {
  MOCKUP_DATA,
  NAVIGATE_BACK,
  APP_STATE_ENTITY,
  SIDEBAR_VISIBLE,
  SETTING_VISIBLE,
  LIGHT_THEME,
  DARK_THEME,
  ANSWERD_RIGHT,
  ANSWERD_WRONG,
  PLAYING,
  PAUSED,
  BOOKMARKED,
  DELETE,
  ONLINE,
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
  LERNVIDEO = "lernVideo",
}

export enum SupportedLanguages {
  DE = "de",
  EN = "en",
}

export enum SupportedThemes {
  LIGHT = "light",
  DARK = "dark",
}
