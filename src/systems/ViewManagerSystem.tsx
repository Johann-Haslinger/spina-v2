import { useEntities, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { Fragment, useEffect, useState } from 'react';
import { AdditionalTag, DataType, Story } from '../base/enums';

import { SucessSheet } from '../components';
import { useAppState } from '../features/collection/hooks/useAppState';
import { useSelectedPodcast } from '../features/collection/hooks/useSelectedPodcast';
import { useSelectedSchoolSubjectColor } from '../features/collection/hooks/useSelectedSchoolSubjectColor';
import { useSelectedTheme } from '../features/collection/hooks/useSelectedTheme';
import { useCurrentSapientorConversation } from '../features/sapientor/hooks/useCurrentConversation';
import { useIsAnyStoryCurrent } from '../hooks/useIsAnyStoryCurrent';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { dataTypeQuery } from '../utils/queries';

const ViewManagerSystem = () => {
  const isSheetViewVisible = useIsAnyStoryCurrent([
    Story.OBSERVING_SETTINGS_OVERVIEW_STORY,
    Story.OBSERVING_PODCAST_STORY,
    Story.OBSERVING_SETTINGS_OVERVIEW_STORY,
    Story.OBSERVING_PROFILE_SETTINGS_STORY,
    Story.OBSERVING_GENERAL_SETTINGS_STORY,
    Story.OBSERVING_SCHOOL_SUBJECT_SETTINGS_STORY,
    Story.OBSERVING_DATA_SETTINGS_STORY,
    Story.OBSERVING_HELP_AREA_STORY,
    Story.OBSERVING_CONTACT_FORM_STORY,

    Story.ADDING_HOMEWORK_STORY,
    Story.ADDING_TOPIC_STORY,
    Story.ADDING_RESOURCE_TO_TOPIC_STORY,
    Story.ADDING_FLASHCARD_GROUP_STORY,
    Story.ADDING_FLASHCARD_SET_STORY,
    Story.ADDING_FLASHCARDS_STORY,
    Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY,
    Story.ADDING_EXAM_STORY,

    Story.EDITING_FLASHCARD_STORY,
    Story.EDITING_FLASHCARD_SET_STORY,
    Story.EDITING_HOMEWORK_STORY,
    Story.EDITING_TOPIC_STORY,
    Story.EDITING_SUBTOPIC_STORY,
    Story.EDITING_GROUP_FLASHCARD_SET_STORY,
    Story.EDITING_GROUP_HOMEWORK_STORY,
    Story.EDITING_GROUP_TOPIC_STORY,
    Story.EDITING_GROUP_SUBTOPIC_STORY,
    Story.EDITING_GROUP_NOTE_STORY,
    Story.EDITING_EXAM_STORY,
    Story.EDITING_LEARNING_GROUP_STORY,

    Story.DELETING_FLASHCARD_SET_STORY,
    Story.DELETING_HOMEWORK_STORY,
    Story.DELETING_NOTE_STORY,
    Story.DELETING_TOPIC_STORY,
    Story.DELETING_SUBTOPIC_STORY,
    Story.DELETING_GROUP_FLASHCARD_SET_STORY,
    Story.DELETING_GROUP_HOMEWORK_STORY,
    Story.DELETING_GROUP_TOPIC_STORY,
    Story.DELETING_GROUP_SUBTOPIC_STORY,
    Story.DELETING_GROUP_NOTE_STORY,
    Story.DELETING_BLOCKS_STORY,
    Story.DELETING_EXAM_STORY,
    Story.DELETING_ACCOUNT_STORY,

    Story.GENERATING_FLASHCARDS_STORY,
    Story.GENERATING_PODCAST_STORY,
    Story.GENERATING_IMPROVED_TEXT_STORY,
    Story.GENERATING_TEXT_FROM_FLASHCARDS_STORY,
    Story.GENERATING_PODCAST_FROM_FLASHCARDS_STORY,
    Story.GENERATING_LEARN_VIDEO_STORY,
    Story.GENERATING_RESOURCES_FROM_IMAGE,
    Story.GENERATING_EXERCISE_STORY,

    Story.CLONING_RESOURCE_FROM_GROUP_STORY,
    Story.SUCCESS_STORY,
    Story.READING_ARTICLE,
    Story.SELECTING_IMAGE_FOR_TOPIC_STORY,
  ]);
  const isQuizViewVisible = useIsAnyStoryCurrent([
    Story.OBSERVING_FLASHCARD_QUIZ_STORY,
    Story.OBSERVING_SPACED_REPETITION_QUIZ,
  ]);
  const { isDarkModeActive: isDarkMode } = useSelectedTheme();
  const [closingVews] = useEntities((e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTag.NAVIGATE_BACK));
  const [themeColor, setThemeColor] = useState('#F5F5F5');
  const { backgroundColor } = useSelectedSchoolSubjectColor();
  const { isChatSheetVisible } = useCurrentSapientorConversation();
  const { isSidebarVisible } = useAppState();
  const { isMobile } = useWindowDimensions();
  const { selectedPodcastEntity } = useSelectedPodcast();
  const [selectedFlashcardEntity] = useEntity((e) => dataTypeQuery(e, DataType.FLASHCARD) && e.hasTag(Tags.SELECTED));

  useEffect(() => {
    if (isSheetViewVisible || selectedPodcastEntity || selectedFlashcardEntity) {
      if (!isDarkMode) {
        setThemeColor('rgb(214,214,214)');
      }
    } else {
      if (!isDarkMode) {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isSheetViewVisible, selectedPodcastEntity, selectedFlashcardEntity]);

  useEffect(() => {
    if (isSidebarVisible && isMobile) {
      if (isDarkMode) {
        setThemeColor('#1a1a1a');
      } else {
        setThemeColor('#ffffff');
      }
    } else if (isMobile) {
      if (isDarkMode) {
        setThemeColor('#000000');
      } else {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    if (isChatSheetVisible) {
      if (!isDarkMode) {
        setThemeColor('rgb(214,214,214)');
      }
    } else {
      if (!isDarkMode) {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isChatSheetVisible]);

  useEffect(() => {
    if (isQuizViewVisible && !isDarkMode) {
      setThemeColor(backgroundColor);
    } else {
      if (isDarkMode) {
        setThemeColor('#000000');
      } else {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isQuizViewVisible]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      setThemeColor('#000000');
    } else {
      document.body.classList.remove('dark');
      setThemeColor('#F5F5F5');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setTimeout(() => {
      closingVews.forEach((view) => {
        view.removeTag(Tags.SELECTED);
        view.removeTag(AdditionalTag.NAVIGATE_BACK);
      });
    }, 300);
  }, [closingVews.length]);

  useEffect(() => {
    if (isSheetViewVisible) {
      if (!isDarkMode) {
        setThemeColor('rgb(214,214,214)');
      }
    } else {
      if (!isDarkMode) {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isSheetViewVisible]);

  return (
    <Fragment>
      <meta name="theme-color" content={themeColor} />
      <SucessSheet />
    </Fragment>
  );
};

export default ViewManagerSystem;
