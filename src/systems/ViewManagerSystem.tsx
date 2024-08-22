import { useEntities, useEntity } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { Fragment, useEffect, useState } from 'react';
import { AdditionalTags, DataTypes, Stories } from '../base/enums';

import { MEDIUM_DEVICE_WIDTH } from '../base/constants';
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
    Stories.OBSERVING_SETTINGS_STORY,
    Stories.OBSERVING_PODCAST_STORY,

    Stories.ADDING_HOMEWORK_STORY,
    Stories.ADDING_TOPIC_STORY,
    Stories.ADDING_RESOURCE_TO_TOPIC_STORY,
    Stories.ADDING_FLASHCARD_GROUP_STORY,
    Stories.ADDING_FLASHCARD_SET_STORY,
    Stories.ADDING_FLASHCARDS_STORY,
    Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY,
    Stories.ADDING_EXAM_STORY,

    Stories.EDITING_FLASHCARD_STORY,
    Stories.EDITING_FLASHCARD_SET_STORY,
    Stories.EDITING_HOMEWORK_STORY,
    Stories.EDITING_TOPIC_STORY,
    Stories.EDITING_SUBTOPIC_STORY,
    Stories.EDETING_GROUP_FLASHCARD_SET_STORY,
    Stories.EDETING_GROUP_HOMEWORK_STORY,
    Stories.EDETING_GROUP_TOPIC_STORY,
    Stories.EDETING_GROUP_SUBTOPIC_STORY,
    Stories.EDETING_GROUP_NOTE_STORY,
    Stories.EDITING_EXAM_STORY,
    Stories.EDITING_LEARNING_GROUP_STORY,

    Stories.DELETING_FLASHCARD_SET_STORY,
    Stories.DELETING_HOMEWORK_STORY,
    Stories.DELETING_NOTE_STORY,
    Stories.DELETING_TOPIC_STORY,
    Stories.DELETING_SUBTOPIC_STORY,
    Stories.DELETING_GROUP_FLASHCARD_SET_STORY,
    Stories.DELETING_GROUP_HOMEWORK_STORY,
    Stories.DELETING_GROUP_TOPIC_STORY,
    Stories.DELETING_GROUP_SUBTOPIC_STORY,
    Stories.DELETING_GROUP_NOTE_STORY,
    Stories.DELETING_BLOCKS_STORY,
    Stories.DELETING_EXAM_STORY,

    Stories.GENERATING_FLASHCARDS_STORY,
    Stories.GENERATING_PODCAST_STORY,
    Stories.GENERATING_IMPROVED_TEXT_STORY,
    Stories.GENERATING_TEXT_FROM_FLASHCARDS_STORY,
    Stories.GENERATING_PODCAST_FROM_FLASHCARDS_STORY,
    Stories.GENERATING_LEARN_VIDEO_STORY,
    Stories.GENERATING_RESOURCES_FROM_IMAGE,
    Stories.GENERATING_EXERCISE_STORY,

    Stories.CLONING_RESOURCE_FROM_GROUP_STORY,
    Stories.SUCCESS_STORY,
  ]);
  const isQuizViewVisible = useIsAnyStoryCurrent([
    Stories.OBSERVING_FLASHCARD_QUIZ_STORY,
    Stories.OBSERVING_SPACED_REPETITION_QUIZ,
  ]);
  const { isDarkModeAktiv: isDarkMode } = useSelectedTheme();
  const [closingVews] = useEntities((e) => e.hasTag(Tags.SELECTED) && e.hasTag(AdditionalTags.NAVIGATE_BACK));
  const [themeColor, setThemeColor] = useState('#F5F5F5');
  const { backgroundColor } = useSelectedSchoolSubjectColor();
  const { isChatSheetVisible } = useCurrentSapientorConversation();
  const { isSidebarVisible } = useAppState();
  const { width } = useWindowDimensions();
  const { selectedPodcastEntity } = useSelectedPodcast();
  const [selectedFlashcardEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.FLASHCARD) && e.hasTag(Tags.SELECTED));

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
    if (isSidebarVisible && width < MEDIUM_DEVICE_WIDTH) {
      if (isDarkMode) {
        setThemeColor('#1a1a1a');
      } else {
        setThemeColor('#ffffff');
      }
    } else if (width < MEDIUM_DEVICE_WIDTH) {
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
    if (isQuizViewVisible) {
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
        view.removeTag(AdditionalTags.NAVIGATE_BACK);
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
