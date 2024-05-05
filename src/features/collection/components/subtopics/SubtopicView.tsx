import { Fragment, useContext, useState } from "react";
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
  TitleProps,
} from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
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
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { IdentifierFacet, IdentifierProps, Tags, TextFacet, TextProps } from "@leanscope/ecs-models";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import {
  IoAdd,
  IoAlbumsOutline,
  IoColorWandOutline,
  IoCreateOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoPlayOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { displayActionTexts } from "../../../../utils/displayText";
import EditSubtopicSheet from "./EditSubtopicSheet";
import DeleteSubtopicAlert from "./DeleteSubtopicAlert";
import LoadSubtopicResourcesSystem from "../../systems/LoadSubtopicResourcesSystem";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import FlashcardCell from "../flashcardSets/FlashcardCell";
import EditFlashcardSheet from "../flashcardSets/EditFlashcardSheet";
import supabaseClient from "../../../../lib/supabase";
import AddFlashcardsSheet from "../flashcardSets/AddFlashcardsSheet";
import FlashcardQuizView from "../../../study/components/FlashcardQuizView";
import GeneratingPodcastSheet from "../generation/GeneratingPodcastSheet";
import GenerateImprovedTextSheet from "../generation/GenerateImprovedTextSheet";
import PodcastRow from "../podcasts/PodcastRow";

enum SubtopicViewStates {
  NOTE,
  FLASHCARDS,
}

const SubtopicView = (props: TitleProps & EntityProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, text, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const [subtopicViewState, setSubtopicViewState] = useState(SubtopicViewStates.NOTE);

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETE_SUBTOPIC_STORY);
  const openEditSheet = () => lsc.stories.transitTo(Stories.EDIT_SUBTOPIC_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Stories.ADD_FLASHCARDS_STORY);
  const openFlashcardQuizView = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Stories.GENERATE_IMPROVED_TEXT_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Stories.GENERATE_PODCAST_STORY);

  const handleTextBlur = async (value: string) => {
    entity.add(new TextFacet({ text: value }));

    const { error } = await supabaseClient.from("knowledges").update({ text: value }).eq("parentId", guid);

    if (error) {
      console.error("Error updating subtopic text", error);
    }
  };

  return (
    <Fragment>
      <LoadSubtopicResourcesSystem />

      <View visibe={isVisible}>
        <NavigationBar>
          {subtopicViewState == SubtopicViewStates.FLASHCARDS && (
            <NavBarButton onClick={openAddFlashcardsSheet}>
              <IoAdd />
            </NavBarButton>
          )}
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow onClick={openImproveTextSheet} last icon={<IoSparklesOutline />}>
                  {displayActionTexts(selectedLanguage).improveText}
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
          <NavBarButton
            content={
              <Fragment>
                <ActionRow icon={<IoCreateOutline />} onClick={openEditSheet} first>
                  {displayActionTexts(selectedLanguage).edit}
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
        <Spacer size={1} />
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

        <Spacer />
        {subtopicViewState == SubtopicViewStates.NOTE ? (
          <TextEditor onBlur={handleTextBlur} value={text} />
        ) : (
          <CollectionGrid columnSize="large">
            <EntityPropsMapper
              query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && isChildOfQuery(e, entity)}
              get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
              onMatch={FlashcardCell}
            />
          </CollectionGrid>
        )}
      </View>

      <EntityPropsMapper
        query={(e) => e.hasTag(Tags.SELECTED) && dataTypeQuery(e, DataTypes.FLASHCARD)}
        get={[[AnswerFacet, QuestionFacet, IdentifierFacet, MasteryLevelFacet], []]}
        onMatch={EditFlashcardSheet}
      />
      {/* <EntityPropsMapper
        query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
        get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
        onMatch={PodcastSheet}
      /> */}

      <EditSubtopicSheet />
      <DeleteSubtopicAlert />
      <AddFlashcardsSheet />
      <FlashcardQuizView />
      <GeneratingPodcastSheet />
      <GenerateImprovedTextSheet />
    </Fragment>
  );
};

export default SubtopicView;
