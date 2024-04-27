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
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { IdentifierProps, TextProps } from "@leanscope/ecs-models";
import { AdditionalTags, Stories } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import LoadNoteTextSystem from "../../systems/LoadNoteTextSystem";
import supabaseClient from "../../../../lib/supabase";
import {
  IoEllipsisHorizontalCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { displayActionTexts } from "../../../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import DeleteNoteAlert from "./DeleteNoteAlert";

const NoteView = (
  props: TitleProps & IdentifierProps & EntityProps & TextProps
) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, text, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openDeleteAlert = () =>
    lsc.stories.transitTo(Stories.DELETE_NOTE_STORY);

  const handleTextBlur = async (value: string) => {
    const { error } = await supabaseClient
      .from("notes")
      .update({ text: value })
      .eq("id", guid);

    if (error) {
      console.error("Error updating note text", error);
    }
  };

  return (
    <>
      <LoadNoteTextSystem />

      <View visibe={isVisible}>
        <NavigationBar
          backButtonLabel={selectedTopicTitle}
          navigateBack={navigateBack}
        >
          <NavBarButton
            content={
              <>
                <ActionRow
                  isFirst
                  isLast
                  destructive
                  onClick={openDeleteAlert}
                  icon={<IoTrashOutline />}
                >
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        
        <Title>{title}</Title>
        <Spacer />
        <TextEditor onBlur={handleTextBlur} value={text} />
      </View>

      <DeleteNoteAlert />
    </>
  );
};

export default NoteView;
