import { useEntities, useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { useEffect, useState } from 'react';
import { AdditionalTag, DataType, Story } from '../types/enums';

import { SucessSheet } from '../../components';
import { useAppState } from '../../features/collection/hooks/useAppState';
import { useSelectedPodcast } from '../../features/collection/hooks/useSelectedPodcast';
import { useSelectedSchoolSubjectColor } from '../../features/collection/hooks/useSelectedSchoolSubjectColor';
import { useSelectedTheme } from '../../features/collection/hooks/useSelectedTheme';
import { useCurrentSapientorConversation } from '../../features/sapientor/hooks/useCurrentConversation';
import { useIsAnyStoryCurrent } from '../hooks/useIsAnyStoryCurrent';
import { useSession } from '../hooks/useSession';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { dataTypeQuery } from '../utilities/queries';

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
  const { isDarkModeActive, customTheme } = useSelectedTheme();
  const [closingViews] = useEntities((e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTag.NAVIGATE_BACK));
  const [themeColor, setThemeColor] = useState('#F5F5F5');
  const { backgroundColor, backgroundColorDark } = useSelectedSchoolSubjectColor();
  const { isChatSheetVisible } = useCurrentSapientorConversation();
  const { isSidebarVisible, appStateEntity } = useAppState();
  const { isMobile } = useWindowDimensions();
  const { selectedPodcastEntity } = useSelectedPodcast();
  const [selectedFlashcardEntity] = useEntity((e) => dataTypeQuery(e, DataType.FLASHCARD) && e.hasTag(Tags.SELECTED));
  const { isLoggedIn } = useSession();
  const [hasMultipleScreenOverlays] = useEntityHasTags(appStateEntity, AdditionalTag.MULTIPLE_SCREEN_OVERLAYS);

  useEffect(() => {
    if (hasMultipleScreenOverlays) {
      if (!isDarkModeActive) {
        setThemeColor('rgb(186,186,186)');
      }
    } else {
      if (!isDarkModeActive) {
        setThemeColor('rgb(214,214,214)');
      }
    }
  }, [hasMultipleScreenOverlays, isDarkModeActive]);

  useEffect(() => {
    if (customTheme) {
      setThemeColor(customTheme);
    } else if (isQuizViewVisible && backgroundColorDark) {
      setThemeColor(isDarkModeActive ? backgroundColorDark : backgroundColor);
    } else {
      if (isDarkModeActive) {
        setThemeColor('#000000');
      } else {
        setThemeColor('#F5F5F5');
      }
    }
  }, [customTheme]);

  useEffect(() => {
    if (isSheetViewVisible || selectedPodcastEntity || selectedFlashcardEntity || isLoggedIn === false) {
      if (!isDarkModeActive) {
        setThemeColor('rgb(214,214,214)');
      } else {
        setThemeColor('#000000');
      }
    } else {
      if (!isDarkModeActive) {
        setThemeColor('#F5F5F5');
      } else {
        setThemeColor('#000000');
      }
    }
  }, [isSheetViewVisible, selectedPodcastEntity, selectedFlashcardEntity, isLoggedIn, isDarkModeActive]);

  useEffect(() => {
    if (isSidebarVisible && isMobile) {
      if (isDarkModeActive) {
        setThemeColor('#1a1a1a');
      } else {
        setThemeColor('#F5F5F5');
      }
    } else if (isMobile) {
      if (isDarkModeActive) {
        setThemeColor('#000000');
      } else {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isSidebarVisible, isDarkModeActive]);

  useEffect(() => {
    if (isChatSheetVisible) {
      if (!isDarkModeActive) {
        setThemeColor('rgb(214,214,214)');
      }
    } else {
      if (!isDarkModeActive) {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isChatSheetVisible, isDarkModeActive]);

  useEffect(() => {
    if (isQuizViewVisible && backgroundColorDark) {
      setThemeColor(isDarkModeActive ? backgroundColorDark : backgroundColor);
    } else {
      if (isDarkModeActive) {
        setThemeColor('#000000');
      } else {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isQuizViewVisible, isDarkModeActive]);

  useEffect(() => {
    if (isDarkModeActive) {
      document.body.classList.add('dark');
      setThemeColor('#000000');
    } else {
      document.body.classList.remove('dark');
      setThemeColor('#F5F5F5');
    }
  }, [isDarkModeActive]);

  useEffect(() => {
    setTimeout(() => {
      closingViews.forEach((view) => {
        view.removeTag(Tags.SELECTED);
        view.removeTag(AdditionalTag.NAVIGATE_BACK);
      });
    }, 300);
  }, [closingViews.length]);

  useEffect(() => {
    if (isSheetViewVisible) {
      if (!isDarkModeActive) {
        setThemeColor('rgb(214,214,214)');
      }
    } else {
      if (!isDarkModeActive) {
        setThemeColor('#F5F5F5');
      }
    }
  }, [isSheetViewVisible, isDarkModeActive]);

  return (
    <div>
      <meta name="theme-color" content={themeColor} />
      <SucessSheet />
    </div>
  );
};

export default ViewManagerSystem;
