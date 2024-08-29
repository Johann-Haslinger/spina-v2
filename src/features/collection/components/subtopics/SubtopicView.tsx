import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, Tags } from '@leanscope/ecs-models';
import { useContext, useState } from 'react';
import {
  IoAddCircleOutline,
  IoAlbumsOutline,
  IoArrowUpCircleOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoChatboxEllipsesOutline,
  IoColorWandOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoPlayOutline,
  IoReaderOutline,
  IoSchoolOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
  TitleProps,
} from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  SegmentedControl,
  SegmentedControlCell,
  Spacer,
  TextEditor,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import FlashcardQuizView from '../../../study/components/FlashcardQuizView';
import { useBookmarked } from '../../../study/hooks/useBookmarked';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadSubtopicResourcesSystem from '../../systems/LoadSubtopicResourcesSystem';
import GenerateExerciseSheet from '../exercises/GenerateExerciseSheet';
import AddFlashcardsSheet from '../flashcard-sets/AddFlashcardsSheet';
import EditFlashcardSheet from '../flashcard-sets/EditFlashcardSheet';
import FlashcardCell from '../flashcard-sets/FlashcardCell';
import GenerateImprovedTextSheet from '../generation/GenerateImprovedTextSheet';
import GeneratePodcastSheet from '../generation/GeneratePodcastSheet';
import LernvideoRow from '../lern-videos/LernvideoRow';
import LernvideoView from '../lern-videos/LernvideoView';
import PodcastRow from '../podcasts/PodcastRow';
import BlurtingView from './BlurtingView';
import DeleteSubtopicAlert from './DeleteSubtopicAlert';
import EditSubtopicSheet from './EditSubtopicSheet';
import FlashcardTestView from './FlashcardTestView';

enum SubtopicViewStates {
  NOTE,
  FLASHCARDS,
}

const SubtopicView = (props: TitleProps & EntityProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const [subtopicViewState, setSubtopicViewState] = useState(SubtopicViewStates.NOTE);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);
  const { text, updateText } = useText(entity);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_SUBTOPIC_STORY);
  const openEditSheet = () => lsc.stories.transitTo(Story.EDITING_SUBTOPIC_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Story.ADDING_FLASHCARDS_STORY);
  const openFlashcardQuizView = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_QUIZ_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Story.GENERATING_PODCAST_STORY);
  const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const openFlashcardTestView = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_TEST_STORY);
  const openBlurtingView = () => lsc.stories.transitTo(Story.OBSERVING_BLURTING_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);
  const openGenerateExerciseSheet = () => lsc.stories.transitTo(Story.GENERATING_EXERCISE_STORY);

  return (
    <Fragment>
      <LoadSubtopicResourcesSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow icon={<IoSparklesOutline />} first onClick={openImproveTextSheet}>
                  {displayActionTexts(selectedLanguage).improveText}
                </ActionRow>
                <ActionRow icon={<IoReaderOutline />} first onClick={openGenerateExerciseSheet}>
                  {displayActionTexts(selectedLanguage).generateExercise}
                </ActionRow>
                <ActionRow first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow last icon={<IoChatboxEllipsesOutline />}>
                  {displayActionTexts(selectedLanguage).startLernSession}
                </ActionRow>
              </Fragment>
            }
          >
            <IoColorWandOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoAlbumsOutline />} onClick={() => openFlashcardQuizView()}>
                  {displayActionTexts(selectedLanguage).quiz}
                </ActionRow>
                <ActionRow icon={<IoSchoolOutline />} onClick={() => openFlashcardTestView()}>
                  {displayActionTexts(selectedLanguage).flashcardTest}
                </ActionRow>
                <ActionRow last icon={<IoReaderOutline />} onClick={() => openBlurtingView()}>
                  {displayActionTexts(selectedLanguage).blurting}
                </ActionRow>
              </Fragment>
            }
          >
            <IoPlayOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow icon={<IoCreateOutline />} onClick={openEditSheet} first>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow icon={<IoAddCircleOutline />} onClick={openAddFlashcardsSheet}>
                  {displayActionTexts(selectedLanguage).addFlashcards}
                </ActionRow>
                <ActionRow icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                  {isBookmarked
                    ? displayActionTexts(selectedLanguage).unbookmark
                    : displayActionTexts(selectedLanguage).bookmark}
                </ActionRow>
                <ActionRow icon={<IoArrowUpCircleOutline />} onClick={openAddResourceToLerningGroupSheet}>
                  {displayActionTexts(selectedLanguage).addToLearningGroup}
                </ActionRow>
                <ActionRow last destructive icon={<IoTrashOutline />} onClick={openDeleteAlert}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title>{title}</Title>

        <SegmentedControl>
          <SegmentedControlCell
            active={subtopicViewState == SubtopicViewStates.NOTE}
            onClick={() => setSubtopicViewState(SubtopicViewStates.NOTE)}
            first
          >
            {displayActionTexts(selectedLanguage).note}
          </SegmentedControlCell>
          <SegmentedControlCell
            active={subtopicViewState == SubtopicViewStates.FLASHCARDS}
            onClick={() => setSubtopicViewState(SubtopicViewStates.FLASHCARDS)}
            leftNeighbourActive={subtopicViewState == SubtopicViewStates.NOTE}
          >
            {displayActionTexts(selectedLanguage).flashcards}
          </SegmentedControlCell>
        </SegmentedControl>

        <Spacer />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataType.LERNVIDEO)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={LernvideoRow}
        />
        <Spacer />
        {subtopicViewState == SubtopicViewStates.NOTE ? (
          <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
        ) : (
          <CollectionGrid columnSize="large">
            <EntityPropsMapper
              query={(e) => dataTypeQuery(e, DataType.FLASHCARD) && isChildOfQuery(e, entity)}
              get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
              onMatch={FlashcardCell}
            />
          </CollectionGrid>
        )}
      </View>

      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataType.FLASHCARD)}
        get={[[AnswerFacet, QuestionFacet, IdentifierFacet, MasteryLevelFacet], []]}
        onMatch={EditFlashcardSheet}
      />
      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataType.LERNVIDEO)}
        get={[[TitleFacet, DateAddedFacet, IdentifierFacet], []]}
        onMatch={LernvideoView}
      />

      <EditSubtopicSheet />
      <DeleteSubtopicAlert />
      <AddFlashcardsSheet />
      <FlashcardQuizView />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />
      <BlurtingView />
      <FlashcardTestView />
      <GenerateExerciseSheet />
    </Fragment>
  );
};

export default SubtopicView;
