export enum Story {
  ANY = 'any',
  OBSERVING_COLLECTION_STORY = 'observingCollectionStory',
  OBSERVING_SCHOOL_SUBJECT_STORY = 'observingSchoolSubjectStory',
  OBSERVING_TOPIC_STORY = 'observingTopicStory',
  OBSERVING_FLASHCARD_GROUPS_STORY = 'observingFlashcardGroupsStory',
  OBSERVING_FLASHCARD_SET_STORY = 'observingFlashcardSetStory',
  OBSERVING_HOMEWORKS_STORY = 'observingHomeworksStory',
  OBSERVING_NOTE_STORY = 'observingNoteStory',
  OBSERVING_FLASHCARD_QUIZ_STORY = 'observingFlashcardQuizStory',
  OBSERVING_SUBTOPIC_STORY = 'observingSubtopicStory',
  OBSERVING_PODCASTS_COLLECTION = 'observingPodcastsCollection',
  OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY = 'observingBookmarkedFlashcardGroupQuizStory',
  OBSERVING_EXAMS_STORY = 'observingExamsStory',
  OBSERVING_PODCAST_STORY = 'observingPodcastStory',
  OBSERVING_BOOKMARKS_STORY = 'observingBookmarksStory',
  OBSERVING_BOOKMARKED_FLASHCARDS_STORY = 'observingBookmarkedFlashcards',
  OBSERVING_BLOCKEDITOR_STORY = 'observingBlockeditorStory',
  OBSERVING_LERNING_GROUPS_STORY = 'observingLerningGroupsStory',
  OBSERVING_LERNING_GROUP_STORY = 'observingLerningGroupStory',
  OBSERVING_GROUP_TOPIC_STORY = 'observingGroupTopicStory',
  OBSERVING_BLURTING_STORY = 'observingBlurtingStory',
  OBSERVING_FLASHCARD_TEST_STORY = 'observingFlashcardTestStory',
  OBSERVING_SPACED_REPETITION_QUIZ = 'observingSpacedRepetitionQuiz',
  OBSERVING_OVERVIEW = 'observingOverview',
  OBSERVING_TOPIC_ARCHIVE_STORY = 'observingTopicArchiveStory',
  OBSERVING_HOMEWORKS_ARCHIVE_STORY = 'observingHomeworksArchiveStory',
  OBSERVING_SETTINGS_OVERVIEW_STORY = 'observingSettingsStory',
  OBSERVING_PROFILE_SETTINGS_STORY = 'observingProfileSettingsStory',
  OBSERVING_GENERAL_SETTINGS_STORY = 'observingGeneralSettingsStory',
  OBSERVING_SCHOOL_SUBJECT_SETTINGS_STORY = 'observingSchoolSubjectSettingsStory',
  OBSERVING_DATA_SETTINGS_STORY = 'observingDataSettingsStory',
  OBSERVING_HELP_AREA_STORY = 'observingHelpAreaStory',
  OBSERVING_CONTACT_FORM_STORY = 'observingContactFormStory',
  OBSERVING_REPORT_PROBLEM_STORY = 'observingReportProblemStory',
  OBSERVING_ADD_TO_HOME_SCREEN_STORY = 'observingAddToHomeScreenStory',
  OBSERVING_NOTIFICATION_STORY = 'observingNotificationStory',
  OBSERVING_TUTORIAL_STORY = 'observingTutorialStory',

  ADDING_FLASHCARD_SET_STORY = 'addFlashcardSetStory',
  ADDING_TOPIC_STORY = 'addTopicStory',
  ADDING_HOMEWORK_STORY = 'addHomeworkStory',
  ADDING_FLASHCARD_GROUP_STORY = 'addFlashcardGroupStory',
  ADDING_RESOURCE_TO_TOPIC_STORY = 'addResourceToTopicStory',
  ADDING_FLASHCARDS_STORY = 'addFlashcardsStory',
  ADDING_EXAM_STORY = 'addExamStory',
  ADDING_LERNING_GROUP_STORY = 'addLerningGroupStory',
  ADDING_GROUP_TOPIC_STORY = 'addingGroupTopicStory',
  ADDING_GROUP_SUBTOPIC_STORY = 'addGroupSubtopicStory',
  ADDING_GROUP_NOTE_STORY = 'addGroupNoteStory',
  ADDING_GROUP_HOMEWORK_STORY = 'addGroupHomeworkStory',
  ADDING_GROUP_FLASHCARD_SET_STORY = 'addGroupFlashcardSetStory',
  ADDING_RESOURCE_TO_LEARNING_GROUP_STORY = 'addResourceToLearningGroupStory',
  ADDING_CHAPTER_STORY = 'addChapterStory',
  AddING_GRADE_STORY = 'addGradeStory',

  EDITING_FLASHCARD_STORY = 'editFlashcardStory',
  EDITING_FLASHCARD_SET_STORY = 'editFlashcardSetStory',
  EDITING_HOMEWORK_STORY = 'editHomeworkStory',
  EDITING_TOPIC_STORY = 'editTopicStory',
  EDITING_SUBTOPIC_STORY = 'editSubtopicStory',
  EDITING_EXAM_STORY = 'editExamStory',
  EDITING_LEARNING_GROUP_STORY = 'editLerningGroupStory',
  EDITING_GROUP_TOPIC_STORY = 'editGroupTopicStory',
  EDITING_GROUP_SUBTOPIC_STORY = 'editGroupSubtopicStory',
  EDITING_GROUP_NOTE_STORY = 'editGroupNoteStory',
  EDITING_GROUP_HOMEWORK_STORY = 'editGroupHomeworkStory',
  EDITING_GROUP_FLASHCARD_SET_STORY = 'editGroupFlashcardSetStory',
  EDITING_TEXT_STYLE_STORY = 'editTextStyleStory',

  DELETING_FLASHCARD_SET_STORY = 'deleteFlashcardSetStory',
  DELETING_HOMEWORK_STORY = 'deleteHomeworkStory',
  DELETING_TOPIC_STORY = 'deleteTopicStory',
  DELETING_NOTE_STORY = 'deleteNoteStory',
  DELETING_SUBTOPIC_STORY = 'deleteSubtopicStory',
  DELETING_EXAM_STORY = 'deleteExamStory',
  DELETING_BLOCKS_STORY = 'deleteBlocksStory',
  DELETING_LERNING_GROUP_STORY = 'deleteLerningGroupStory',
  DELETING_GROUP_TOPIC_STORY = 'deleteGroupTopicStory',
  DELETING_GROUP_SUBTOPIC_STORY = 'deleteGroupSubtopicStory',
  DELETING_GROUP_NOTE_STORY = 'deleteGroupNoteStory',
  DELETING_GROUP_HOMEWORK_STORY = 'deleteGroupHomeworkStory',
  DELETING_GROUP_FLASHCARD_SET_STORY = 'deleteGroupFlashcardSetStory',
  DELETING_ACCOUNT_STORY = 'deleteAccountStory',
  DELETING_GRADE_STORY = 'deleteGradeStory',

  GENERATING_IMPROVED_TEXT_STORY = 'generateImprovedFlashcardsStory',
  GENERATING_FLASHCARDS_STORY = 'generateFlashcardsStory',
  GENERATING_PODCAST_STORY = 'generatePodcastStory',
  GENERATING_TEXT_FROM_FLASHCARDS_STORY = 'generateTextFromFlashcardsStory',
  GENERATING_PODCAST_FROM_FLASHCARDS_STORY = 'generatePodcastFromFlashcardsStory',
  GENERATING_LEARN_VIDEO_STORY = 'generateLearnVideoStory',
  GENERATING_RESOURCES_FROM_IMAGE = 'generateResourceFromImage',
  GENERATING_EXERCISE_STORY = 'generateExerciseStory',

  SELECTING_IMAGE_FOR_TOPIC_STORY = 'selectingImageForTopicStory',
  SELECTING_PARENT_STORY = 'selectingParentStory',

  CLONING_RESOURCE_FROM_GROUP_STORY = 'cloneResourceFromGroupStory',

  SUCCESS_STORY = 'successStory',

  READING_ARTICLE = 'readingArticle',
}
export enum AdditionalTag {
  NOTIFICATION = 'notification',
  UPLOADED_FILE = 'uploadedFile',
  MOCKUP_DATA = 'mockupData',
  NAVIGATE_BACK = 'navigateBack',
  APP_STATE_ENTITY = 'appStateEntity',
  SIDEBAR_VISIBLE = 'sidebarVisible',
  SETTING_VISIBLE = 'settingVisible',
  LIGHT_THEME = 'lightTheme',
  DARK_THEME = 'darkTheme',
  PLAYING = 'playing',
  PAUSED = 'paused',
  BOOKMARKED = 'bookmarked',
  DELETE = 'delete',
  ONLINE = 'online',
  CONTENT_EDITABLE = 'contentEditable',
  FOCUSED = 'focused',
  OPEN = 'open',
  PROMPT = 'prompt',
  PROCESSING = 'processing',
  THREAD = 'thread',
  CONVERSATION_VISIBLE = 'conversationVisible',
  RELATED_THREAD_RESOURCE = 'relatedThreadResource',
  SAPIENTOR_CONVERSATION = 'sapientorConversation',
  IS_QUICK_CHAT_VISIBLE = 'isQuickChatVisible',
  CHAT_SHEET_VISIBLE = 'chatSheetVisible',
  GENERATE_FROM_IMAGE_PROMPT = 'generateFromImagePrompt',
  GROUP_BLOCK_EDITOR = 'groupBlockEditor',
  RECENTLY_ADDED = 'recentlyAdded',
  PROFILE_VISIBLE = 'profileVisible',
  GENERATING = 'generating',
  SKIP = 'skip',
  FORGOT = 'forgot',
  PARTIALLY_REMEMBERED = 'partiallyRemembered',
  REMEMBERED_WITH_EFFORT = 'rememberedWithEffort',
  REMEMBERED_EASILY = 'rememberedEasily',
  PENDING_RESOURCE = 'pendingResource',
  ARCHIVED = 'archived',
  CHANGED = 'changed',
  LOADING_INDICATOR = 'loadingIndicator',
  MULTIPLE_SCREEN_OVERLAYS = 'multipleScreenOverlays',
}

export enum NavigationLink {
  OVERVIEW = 'overview',
  STUDY = 'study',
  HOMEWORKS = 'homeworks',
  EXAMS = 'exams',
  COLLECTION = 'collection',
  GROUPS = 'groups',
  FLASHCARDS = 'flashcards',
}

export enum DataType {
  HOMEWORK = 'homework',
  FLASHCARD_GROUP = 'flashcardGroup',
  EXAM = 'exam',
  SCHOOL_SUBJECT = 'schoolSubject',
  TOPIC = 'topic',
  NOTE = 'note',
  FLASHCARD_SET = 'flashcardSet',
  FLASHCARD = 'flashcard',
  SUBTOPIC = 'subTopic',
  PODCAST = 'podcast',
  BLOCK = 'block',
  LEARNING_GROUP = 'learningGroup',
  GROUP_SCHOOL_SUBJECT = 'groupSchoolSubject',
  GROUP_TOPIC = 'groupTopic',
  GROUP_SUBTOPIC = 'groupSubtopic',
  GROUP_NOTE = 'groupNote',
  GROUP_HOMEWORK = 'groupHomework',
  GROUP_FLASHCARD_SET = 'groupFlashcardSet',
  GROUP_FLASHCARD = 'groupFlashcard',
  GROUP_BLOCK = 'groupBlock',
  EXERCISE = 'exercise',
  EXERCISE_PART = 'exercisePart',
  FLASHCARD_SESSION = 'flashcardSession',
  CHAPTER = 'chapter',
  LEARNING_UNIT = 'learningUnit',
  FILE = 'file',
  GRADE = 'grade',
  GRADE_TYPE = 'gradeType',
}

export enum SupportedLanguage {
  DE = 'de',
  EN = 'en',
}

export enum SupportedTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum MessageRole {
  SAPIENTOR = 'sapientor',
  USER = 'user',
}

export enum Blocktype {
  TEXT = 'text',
  DIVIDER = 'divider',
  IMAGE = 'image',
  PAGE = 'page',
  LIST = 'list',
  TODO = 'todo',
  TABLE = 'table',
  CODE = 'code',
}

export enum Texttype {
  TITLE = 'title',
  SUBTITLE = 'subTitle',
  HEADING = 'heading',
  BOLD = 'bold',
  NORMAL = 'normal',
  CAPTION = 'caption',
  UNDERLINE = 'underline',
  ITALIC = 'italic',
}

export enum ListStyle {
  BULLET = 'bullet',
  NUMBER = 'number',
  UNORDERED = 'unordered',
}

export enum SupportedModel {
  SAPIENTOR_ASSISTENT,
  TURBO,
}

export enum SupabaseTable {
  SCHOOL_SUBJECTS = 'school_subjects',
  TOPICS = 'topics',
  FLASHCARDS = 'flashcards',
  HOMEWORKS = 'homeworks',
  EXAMS = 'exams',
  PODCASTS = 'podcasts',
  BLOCKS = 'blocks',
  LEARNING_GROUPS = 'learning_groups',
  GROUP_SCHOOL_SUBJECTS = 'group_school_subjects',
  GROUP_TOPICS = 'group_topics',
  GROUP_FLASHCARDS = 'group_flashcards',
  TEXTS = 'texts',
  FLASHCARD_SESSIONS = 'flashcard_sessions',
  STREAKS = 'streaks',
  FILES = 'files',
  LEARNING_UNITS = 'learning_units',
  EXERCISE_PARTS = 'exercise_parts',
  EXERCISES = 'exercises',
  LEARNING_UNIT_FILES = 'learning_unit_files',
  GRADES = 'grades',
  GRADE_TYPES = 'grade_types',
  ParentFacet = "ParentFacet",
}

export enum SupabaseStorageBucket {
  LEARNING_UNIT_FILES = 'learning_unit_files',
  TOPIC_IMAGES = 'topic_images',
  UPLOADED_IMAGES = 'uploaded_images',
}

export enum SupabaseColumn {
  ID = 'id',
  USER_ID = 'user_id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  PARENT_ID = 'parent_id',
  DUE_DATE = 'due_date',
}

export enum SupabaseEdgeFunction {
  GENERATE_FLASHCARDS = 'generate-flashcards',
  GENERATE_LEARNING_UNIT = 'generate-learning-unit',
  GENERATE_LEARNING_UNIT_PARENT_DETAILS = 'generate-learning-unit-parent-details',
}
export enum FlashcardsNavigationState {
  OVERVIEW = 'overview',
  FLASHCARDS = 'flashcards',
  STATS = 'stats',
}

export enum LearningUnitPriority {
  PAUSED = 0,
  ACTIVE = 1,
  MAINTAINING = 2,
}

export enum ProgressStatus {
  TODO = 1,
  IN_PROGRESS = 2,
  DONE = 3,
  MISSED = 4,
}

export enum LearningUnitType {
  NOTE,
  FLASHCARD_SET,
  MIXED,
}

export enum LearningUnitViews {
  FLASHCARDS,
  NOTE,
}
