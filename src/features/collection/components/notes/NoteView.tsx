import React, { useContext } from "react";
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
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { IdentifierProps, TextFacet, TextProps } from "@leanscope/ecs-models";
import { AdditionalTags, Stories } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import LoadNoteTextSystem from "../../systems/LoadNoteTextSystem";
import supabaseClient from "../../../../lib/supabase";
import {
  IoAlbumsOutline,
  IoColorWandOutline,
  IoEllipsisHorizontalCircleOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import DeleteNoteAlert from "./DeleteNoteAlert";
import GenerateFlashcardsSheet from "../generation/GenerateFlashcardsSheet";
import GenerateImprovedTextSheet from "../generation/GenerateImprovedTextSheet";

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, text, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () => lsc.stories.transitTo(Stories.DELETE_NOTE_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Stories.GENERATE_IMPROVED_TEXT_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Stories.GENERATE_FLASHCARDS_STORY);

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
    <>
      <LoadNoteTextSystem />

      <View visibe={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <>
                <ActionRow first icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                  {displayActionTexts(selectedLanguage).generateFlashcards}
                </ActionRow>
                <ActionRow onClick={openImproveTextSheet} last icon={<IoSparklesOutline />}>
                  {displayActionTexts(selectedLanguage).improveText}
                </ActionRow>
              </>
            }
          >
            <IoColorWandOutline />
          </NavBarButton>
          <NavBarButton
            content={
              <>
                <ActionRow first last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
        <Title onBlur={handleTitleBlur} editable>
          {title}
        </Title>
        <Spacer />
        <TextEditor onBlur={handleTextBlur} value={text} />
      </View>

      <DeleteNoteAlert />
      <GenerateFlashcardsSheet />
      <GenerateImprovedTextSheet />
    </>
  );
};

export default NoteView;
