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
  OBSERVING_BLOCKEDITOR_STORY = "observingBlockeditorStory",
  OBSERVING_LERNING_GROUPS_STORY = "observingLerningGroupsStory",
  OBSERVING_LERNING_GROUP_STORY = "observingLerningGroupStory",
  OBSERVING_GROUP_TOPIC_STORY = "observingGroupTopicStory",
  OBSERVING_BLURTING_STORY = "observingBlurtingStory",
  OBSERVING_FLASHCARD_TEST_STORY = "observingFlashcardTestStory",

  ADDING_FLASHCARD_SET_STORY = "addFlashcardSetStory",
  ADDING_TOPIC_STORY = "addTopicStory",
  ADDING_HOMEWORK_STORY = "addHomeworkStory",
  ADDING_FLASHCARD_GROUP_STORY = "addFlashcardGroupStory",
  ADDING_RESOURCE_TO_TOPIC_STORY = "addResourceToTopicStory",
  ADDING_FLASHCARDS_STORY = "addFlashcardsStory",
  ADDING_EXAM_STORY = "addExamStory",
  ADDING_LERNING_GROUP_STORY = "addLerningGroupStory",
  ADDING_GROUP_TOPIC_STORY = "addingGroupTopicStory",
  ADDING_GROUP_SUBTOPIC_STORY = "addGroupSubtopicStory",
  ADDING_GROUP_NOTE_STORY = "addGroupNoteStory",
  ADDING_GROUP_HOMEWORK_STORY = "addGroupHomeworkStory",
  ADDING_GROUP_FLASHCARD_SET_STORY = "addGroupFlashcardSetStory",
  ADDING_RESOURCE_TO_LEARNING_GROUP_STORY = "addResourceToLearningGroupStory",

  EDITING_FLASHCARD_STORY = "editFlashcardStory",
  EDITING_FLASHCARD_SET_STORY = "editFlashcardSetStory",
  EDITING_HOMEWORK_STORY = "editHomeworkStory",
  EDITING_TOPIC_STORY = "editTopicStory",
  EDITING_SUBTOPIC_STORY = "editSubtopicStory",
  EDITING_EXAM_STORY = "editExamStory",
  EDITING_LEARNING_GROUP_STORY = "editLerningGroupStory",
  EDETING_GROUP_TOPIC_STORY = "editGroupTopicStory",
  EDETING_GROUP_SUBTOPIC_STORY = "editGroupSubtopicStory",
  EDETING_GROUP_NOTE_STORY = "editGroupNoteStory",
  EDETING_GROUP_HOMEWORK_STORY = "editGroupHomeworkStory",
  EDETING_GROUP_FLASHCARD_SET_STORY = "editGroupFlashcardSetStory",

  DELETING_FLASHCARD_SET_STORY = "deleteFlashcardSetStory",
  DELETING_HOMEWORK_STORY = "deleteHomeworkStory",
  DELETING_TOPIC_STORY = "deleteTopicStory",
  DELETING_NOTE_STORY = "deleteNoteStory",
  DELETING_SUBTOPIC_STORY = "deleteSubtopicStory",
  DELETING_EXAM_STORY = "deleteExamStory",
  DELETING_BLOCKS_STORY = "deleteBlocksStory",
  DELETING_LERNING_GROUP_STORY = "deleteLerningGroupStory",
  DELETING_GROUP_TOPIC_STORY = "deleteGroupTopicStory",
  DELETING_GROUP_SUBTOPIC_STORY = "deleteGroupSubtopicStory",
  DELETING_GROUP_NOTE_STORY = "deleteGroupNoteStory",
  DELETING_GROUP_HOMEWORK_STORY = "deleteGroupHomeworkStory",
  DELETING_GROUP_FLASHCARD_SET_STORY = "deleteGroupFlashcardSetStory",

  GENERATING_IMPROVED_TEXT_STORY = "generateImprovedFlashcardsStory",
  GENERATING_FLASHCARDS_STORY = "generateFlashcardsStory",
  GENERATING_PODCAST_STORY = "generatePodcastStory",
  GENERATING_TEXT_FROM_FLASHCARDS_STORY = "generateTextFromFlashcardsStory",
  GENERATING_PODCAST_FROM_FLASHCARDS_STORY = "generatePodcastFromFlashcardsStory",
  GENERATING_LEARN_VIDEO_STORY = "generateLearnVideoStory",
  GENERATING_RESOURCES_FROM_IMAGE = "generateResourceFromImage",
  GENERATING_EXERCISE_STORY = "generateExerciseStory",

  CLONING_RESOURCE_FROM_GROUP_STORY = "cloneResourceFromGroupStory",

  SUCCESS_STORY = "successStory",
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
  CONTENT_EDITABLE,
  FOCUSED,
  OPEN,
  PROMPT,
  PROCESSING,
  THREAD,
  CONVERSATION_VISIBLE,
  RELATED_THREAD_RESOURCE,
  SAPIENTOR_CONVERSATION,
  QUIK_CHAT_VISIBLE,
  CHAT_SHEET_VISIBLE,
  GENERATE_FROM_IMAGE_PROMPT,
  GROUP_BLOCKEDITOR,
  RECENTLY_ADDED,
  PROFILE_VISIBLE
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
  BLOCK = "block",
  LEARNING_GROUP = "learningGroup",
  GROUP_SCHOOL_SUBJECT = "groupSchoolSubject",
  GROUP_TOPIC = "groupTopic",
  GROUP_SUBTOPIC = "groupSubtopic",
  GROUP_NOTE = "groupNote",
  GROUP_HOMEWORK = "groupHomework",
  GROUP_FLASHCARD_SET = "groupFlashcardSet",
  GROUP_FLASHCARD = "groupFlashcard",
  GROUP_BLOCK = "groupBlock",
  EXERCISE = "exercise",
  EXERCISE_PART = "exercisePart",
}

export enum SupportedLanguages {
  DE = "de",
  EN = "en",
}

export enum SupportedThemes {
  LIGHT = "light",
  DARK = "dark",
}

export enum MessageRoles {
  SAPIENTOR = "sapientor",
  USER = "user",
}

export enum Blocktypes {
  TEXT = "text",
  DIVIDER = "divider",
  IMAGE = "image",
  PAGE = "page",
  LIST = "list",
  TODO = "todo",
  TABLE = "table",
  CODE = "code",
}

export enum Texttypes {
  TITLE = "title",
  SUBTITLE = "subTitle",
  HEADING = "heading",
  BOLD = "bold",
  NORMAL = "normal",
  CAPTION = "caption",
  UNDERLINE = "underline",
  ITALIC = "italic",
}

export enum ListStyles {
  BULLET = "bullet",
  NUMBER = "number",
  UNORDERED = "unordered",
}

export enum SupportedModels {
  SAPIENTOR_ASSISTENT,
  TURBO,
}

export enum SupabaseTables {
  USERS = "users",
  SCHOOL_SUBJECTS = "school_subjects",
  TOPICS = "topics",
  SUBTOPICS = "subtopics",
  FLASHCARDS = "flashcards",
  FLASHCARD_SETS = "flashcard_sets",
  HOMEWORKS = "homeworks",
  EXAMS = "exams",
  NOTES = "notes",
  PODCASTS = "podcasts",
  BLOCKS = "blocks",
  LEARNING_GROUPS = "learning_groups",
  GROUP_SCHOOL_SUBJECTS = "group_school_subjects",
  GROUP_TOPICS = "group_topics",
  GROUP_SUBTOPICS = "group_subtopics",
  GROUP_NOTES = "group_notes",
  GROUP_FLASHCARD_SETS = "group_flashcard_sets",
  GROUP_FLASHCARDS = "group_flashcards",
  GROUP_BLOCKS = "group_blocks",
  TEXTS = "texts",
  EXERCISES = "exercises",
  EXERCISE_PARTS = "exercise_parts",
  PROFILES = "profiles",
}

export enum SupabaseColumns {
  ID = "id",
  USER_ID = "user_id",
  TITLE = "title",
  DESCRIPTION = "description",
  PARENT_ID = "parent_id",
  DUE_DATE = "due_date",
}
