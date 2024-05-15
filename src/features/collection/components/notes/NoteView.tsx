import { Fragment, useContext } from "react";
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from "../../../../components";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { DateAddedFacet, TitleFacet, TitleProps } from "../../../../app/a";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierProps, TextFacet, TextProps } from "@leanscope/ecs-models";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import LoadNoteTextSystem from "../../systems/LoadNoteTextSystem";
import supabaseClient from "../../../../lib/supabase";
import {
  IoAlbumsOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoEllipsisHorizontalCircleOutline,
  IoHeadsetOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import DeleteNoteAlert from "./DeleteNoteAlert";
import GenerateFlashcardsSheet from "../generation/GenerateFlashcardsSheet";
import GenerateImprovedTextSheet from "../generation/GenerateImprovedTextSheet";
import { isChildOfQuery, dataTypeQuery } from "../../../../utils/queries";
import PodcastRow from "../podcasts/PodcastRow";
import GeneratePodcastSheet from "../generation/GeneratePodcastSheet";
import LoadNotePodcastsSystem from "../../systems/LoadNotePodcastsSystem";
import { useBookmarked } from "../../../study/hooks/useBookmarked";

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, text, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETING_NOTE_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Stories.GENERATING_IMPROVED_TEXT_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Stories.GENERATING_FLASHCARDS_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Stories.GENERATING_PODCAST_STORY);

  const handleTextBlur = async (value: string) => {
    entity.add(new TextFacet({ text: value }));
    const { error } = await supabaseClient.from("notes").update({ text: value }).eq("id", guid);

    if (error) {
      console.error("Error updating note text", error);
    }
  };

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient.from("notes").update({ title: value }).eq("id", guid);

    if (error) {
      console.error("Error updating note title", error);
    }
  };

  return (
    <Fragment>
      <LoadNoteTextSystem />
      <LoadNotePodcastsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                  {displayActionTexts(selectedLanguage).generatePodcast}
                </ActionRow>
                <ActionRow icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                  {displayActionTexts(selectedLanguage).generateFlashcards}
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
                <ActionRow first icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
                  {isBookmarked
                    ? displayActionTexts(selectedLanguage).unbookmark
                    : displayActionTexts(selectedLanguage).bookmark}
                </ActionRow>
                <ActionRow first last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title onBlur={handleTitleBlur} editable>
          {title}
        </Title>
        <Spacer size={2} />
        <EntityPropsMapper
          query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
        <Spacer />

        <TextEditor onBlur={handleTextBlur} value={text} />
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GenerateImprovedTextSheet />
      <GeneratePodcastSheet />
    </Fragment>
  );
};

export default NoteView;
