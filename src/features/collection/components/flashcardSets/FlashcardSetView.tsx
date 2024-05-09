import { Fragment, useContext } from "react";
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
import { AnswerFacet, MasteryLevelFacet, QuestionFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, IdentifierProps, Tags } from "@leanscope/ecs-models";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadFlashcardsSystem from "../../systems/LoadFlashcardsSystem";
import FlashcardCell from "./FlashcardCell";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import {
  IoAdd,
  IoAlbumsOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoPlayOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import EditFlashcardSetSheet from "./EditFlashcardSetSheet";
import DeleteFlashcardSetAlert from "./DeleteFlashcardSetAlert";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import EditFlashcardSheet from "./EditFlashcardSheet";
import AddFlashcardsSheet from "./AddFlashcardsSheet";
import { useEntityHasChildren } from "../../hooks/useEntityHasChildren";
import FlashcardQuizView from "../../../study/components/FlashcardQuizView";
import { useBookmarked } from "../../../study/hooks/useBookmarked";

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



  return (
    <Fragment>
      <LoadFlashcardsSystem />

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
    </Fragment>
  );
};

export default FlashcardSetView;
