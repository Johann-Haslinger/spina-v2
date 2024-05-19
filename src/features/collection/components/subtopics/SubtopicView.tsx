import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, IdentifierProps, Tags, TextProps } from "@leanscope/ecs-models";
import { Fragment, useContext, useState } from "react";
import {
  IoAdd,
  IoAlbumsOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoCreateOutline,
  IoHeadsetOutline,
  IoTrashOutline,
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
  CollectionGrid,
  SegmentedControl,
  SegmentedControlCell,
  Spacer,
  View,
} from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import Blockeditor from "../../../blockeditor/components/Blockeditor";
import FlashcardQuizView from "../../../study/components/FlashcardQuizView";
import { useBookmarked } from "../../../study/hooks/useBookmarked";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadSubtopicResourcesSystem from "../../systems/LoadSubtopicResourcesSystem";
import AddFlashcardsSheet from "../flashcard-sets/AddFlashcardsSheet";
import EditFlashcardSheet from "../flashcard-sets/EditFlashcardSheet";
import FlashcardCell from "../flashcard-sets/FlashcardCell";
import GenerateImprovedTextSheet from "../generation/GenerateImprovedTextSheet";
import GeneratePodcastSheet from "../generation/GeneratePodcastSheet";
import LernvideoRow from "../lern-videos/LernvideoRow";
import LernvideoView from "../lern-videos/LernvideoView";
import PodcastRow from "../podcasts/PodcastRow";
import DeleteSubtopicAlert from "./DeleteSubtopicAlert";
import EditSubtopicSheet from "./EditSubtopicSheet";
import InitializeBlockeditorSystem from "../../../blockeditor/systems/InitializeBlockeditorSystem";

enum SubtopicViewStates {
  NOTE,
  FLASHCARDS,
}

const SubtopicView = (props: TitleProps & EntityProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const [subtopicViewState, setSubtopicViewState] = useState(SubtopicViewStates.NOTE);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETING_SUBTOPIC_STORY);
  const openEditSheet = () => lsc.stories.transitTo(Stories.EDITING_SUBTOPIC_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Stories.ADDING_FLASHCARDS_STORY);
  const openFlashcardQuizView = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Stories.GENERATING_PODCAST_STORY);
  // const openGenerateLernVideoSheet = () => lsc.stories.transitTo(Stories.GENERATING_LEARN_VIDEO_STORY);

  return (
    <Fragment>
      <LoadSubtopicResourcesSystem />
      <InitializeBlockeditorSystem blockeditorId={guid} />

      <View visible={isVisible}>
        <Blockeditor
          id={guid}
          title={title}
          backbuttonLabel={selectedTopicTitle}
          navigateBack={navigateBack}
          customActionRows={
            <Fragment>
              <ActionRow icon={<IoCreateOutline />} onClick={openEditSheet} first>
                {displayActionTexts(selectedLanguage).edit}
              </ActionRow>
              <ActionRow icon={<IoAdd />} onClick={openAddFlashcardsSheet}>
                {displayActionTexts(selectedLanguage).addFlashcards}
              </ActionRow>
              <ActionRow icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                {isBookmarked
                  ? displayActionTexts(selectedLanguage).unbookmark
                  : displayActionTexts(selectedLanguage).bookmark}
              </ActionRow>

              <ActionRow last destructive icon={<IoTrashOutline />} onClick={openDeleteAlert}>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </Fragment>
          }
          customGenerateActionRows={
            <Fragment>
              {/* <ActionRow icon={<IoVideocamOutline />} onClick={openGenerateLernVideoSheet}>
                  {displayActionTexts(selectedLanguage).generateLearnVideo}
                </ActionRow> */}
              <ActionRow last first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                {displayActionTexts(selectedLanguage).generatePodcast}
              </ActionRow>
            </Fragment>
          }
          customEditOptions={
            <ActionRow first last icon={<IoAlbumsOutline />} onClick={() => openFlashcardQuizView()}>
              {displayActionTexts(selectedLanguage).quiz}
            </ActionRow>
          }
          customHeaderArea={
            <div>
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
                query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
                get={[[TitleFacet, DateAddedFacet], []]}
                onMatch={PodcastRow}
              />
              <EntityPropsMapper
                query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.LERNVIDEO)}
                get={[[TitleFacet, DateAddedFacet], []]}
                onMatch={LernvideoRow}
              />
            </div>
          }
          customContent={
            subtopicViewState == SubtopicViewStates.FLASHCARDS && (
              <CollectionGrid columnSize="large">
                <EntityPropsMapper
                  query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && isChildOfQuery(e, entity)}
                  get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
                  onMatch={FlashcardCell}
                />
              </CollectionGrid>
            )
          }
        />
      </View>

      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataTypes.FLASHCARD)}
        get={[[AnswerFacet, QuestionFacet, IdentifierFacet, MasteryLevelFacet], []]}
        onMatch={EditFlashcardSheet}
      />
      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataTypes.LERNVIDEO)}
        get={[[TitleFacet, DateAddedFacet, IdentifierFacet], []]}
        onMatch={LernvideoView}
      />

      <EditSubtopicSheet />
      <DeleteSubtopicAlert />
      <AddFlashcardsSheet />
      <FlashcardQuizView />
      <GeneratePodcastSheet />
      <GenerateImprovedTextSheet />
    </Fragment>
  );
};

export default SubtopicView;
