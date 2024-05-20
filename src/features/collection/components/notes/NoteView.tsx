import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierProps, TextProps } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import { IoAlbumsOutline, IoBookmark, IoBookmarkOutline, IoHeadsetOutline, IoTrashOutline } from "react-icons/io5";
import { DateAddedFacet, TitleFacet, TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { ActionRow, View } from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import Blockeditor from "../../../blockeditor/components/Blockeditor";
import InitializeBlockeditorSystem from "../../../blockeditor/systems/InitializeBlockeditorSystem";
import { useBookmarked } from "../../../study/hooks/useBookmarked";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadNotePodcastsSystem from "../../systems/LoadNotePodcastsSystem";
import LoadNoteTextSystem from "../../systems/LoadNoteTextSystem";
import GenerateFlashcardsSheet from "../generation/GenerateFlashcardsSheet";
import GeneratePodcastSheet from "../generation/GeneratePodcastSheet";
import PodcastRow from "../podcasts/PodcastRow";
import DeleteNoteAlert from "./DeleteNoteAlert";

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETING_NOTE_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Stories.GENERATING_FLASHCARDS_STORY);
  const openGeneratePodcastSheet = () => lsc.stories.transitTo(Stories.GENERATING_PODCAST_STORY);

  const handleTitleBlur = async (value: string) => {
    entity.add(new TitleFacet({ title: value }));
    const { error } = await supabaseClient.from("notes").update({ title: value }).eq("id", guid);

    if (error) {
      console.error("Error updating note title", error);
    }
  };

  return (
    <Fragment>
      <InitializeBlockeditorSystem blockeditorId={guid} />
      <LoadNoteTextSystem />
      <LoadNotePodcastsSystem />

      <View visible={isVisible}>
        <Blockeditor
          id={guid}
          handleTitleBlur={handleTitleBlur}
          title={title}
          backbuttonLabel={selectedTopicTitle}
          navigateBack={navigateBack}
          customHeaderArea={
            <div>
              <EntityPropsMapper
                query={(e) => isChildOfQuery(e, entity) && dataTypeQuery(e, DataTypes.PODCAST)}
                get={[[TitleFacet, DateAddedFacet], []]}
                onMatch={PodcastRow}
              />
            </div>
          }
          customGenerateActionRows={
            <Fragment>
              <ActionRow first icon={<IoHeadsetOutline />} onClick={openGeneratePodcastSheet}>
                {displayActionTexts(selectedLanguage).generatePodcast}
              </ActionRow>
              <ActionRow last icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                {displayActionTexts(selectedLanguage).generateFlashcards}
              </ActionRow>
            </Fragment>
          }
          customActionRows={
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
        />
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GeneratePodcastSheet />
    </Fragment>
  );
};

export default NoteView;
