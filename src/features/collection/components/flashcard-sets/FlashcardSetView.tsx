import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, IdentifierProps, Tags } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import {
  IoAdd,
  IoAlbumsOutline,
  IoArrowUpCircleOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoPlayOutline,
  IoSparklesOutline,
  IoTrashOutline
} from "react-icons/io5";
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
  TitleProps,
} from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import FlashcardQuizView from "../../../study/components/FlashcardQuizView";
import { useBookmarked } from "../../../study/hooks/useBookmarked";
import { useEntityHasChildren } from "../../hooks/useEntityHasChildren";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadFlashcardSetPodcastsSystem from "../../systems/LoadFlashcardSetPodcastsSystem";
import LoadFlashcardsSystem from "../../systems/LoadFlashcardsSystem";
import GeneratePodcastSheet from "../generation/GeneratePodcastSheet";
import GenerateTextFromFlashcardsSheet from "../generation/GenerateTextFromFlashcardsSheet";
import PodcastRow from "../podcasts/PodcastRow";
import AddFlashcardsSheet from "./AddFlashcardsSheet";
import DeleteFlashcardSetAlert from "./DeleteFlashcardSetAlert";
import EditFlashcardSetSheet from "./EditFlashcardSetSheet";
import EditFlashcardSheet from "./EditFlashcardSheet";
import FlashcardCell from "./FlashcardCell";

const FlashcardSetView = (props: TitleProps & EntityProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const { hasChildren } = useEntityHasChildren(entity);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditFlashcardSetSheet = () => lsc.stories.transitTo(Stories.EDITING_FLASHCARD_SET_STORY);
  const openDeleteFlashcardSetAlert = () => lsc.stories.transitTo(Stories.DELETING_FLASHCARD_SET_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Stories.ADDING_FLASHCARDS_STORY);
  const openFlashcardQuizView = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Stories.GENERATING_PODCAST_STORY);
  const openGenerateTextSheet = () => lsc.stories.transitTo(Stories.GENERATING_TEXT_FROM_FLASHCARDS_STORY);
  const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);

  return (
    <Fragment>
      <LoadFlashcardsSystem />
      <LoadFlashcardSetPodcastsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow onClick={openGenerateTextSheet} last icon={<IoSparklesOutline />}>
                  {displayActionTexts(selectedLanguage).generateText}
                </ActionRow>
              </Fragment>
            }
          >
            <IoColorWandOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first last icon={<IoAlbumsOutline />} onClick={() => openFlashcardQuizView()}>
                  {displayActionTexts(selectedLanguage).quiz}
                </ActionRow>
              </Fragment>
            }
          >
            <IoPlayOutline />
          </NavBarButton>
          <NavBarButton onClick={openAddFlashcardsSheet}>
            <IoAdd />
          </NavBarButton>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoCreateOutline />} onClick={openEditFlashcardSetSheet}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                  {isBookmarked
                    ? displayActionTexts(selectedLanguage).unbookmark
                    : displayActionTexts(selectedLanguage).bookmark}
                </ActionRow>
                <ActionRow icon={<IoArrowUpCircleOutline />} onClick={openAddResourceToLerningGroupSheet} >
                  {displayActionTexts(selectedLanguage).addToLearningGroup}
                </ActionRow>
                <ActionRow destructive last icon={<IoTrashOutline />} onClick={openDeleteFlashcardSetAlert}>
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
        <Spacer size={2} />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
        <Spacer />
        {!hasChildren && <NoContentAddedHint />}
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => e.hasTag(DataTypes.FLASHCARD) && isChildOfQuery(e, entity)}
            get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && e.hasTag(Tags.SELECTED)}
        get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet, IdentifierFacet], []]}
        onMatch={EditFlashcardSheet}
      />

      <EditFlashcardSetSheet />
      <DeleteFlashcardSetAlert />
      <AddFlashcardsSheet />
      <FlashcardQuizView />
      <GenerateTextFromFlashcardsSheet />
      <GeneratePodcastSheet />
    </Fragment>
  );
};

export default FlashcardSetView;
