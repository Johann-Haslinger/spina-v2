import React from "react";
import {
  BackButton,
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
import { AdditionalTags } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import LoadNoteTextSystem from "../../systems/LoadNoteTextSystem";
import supabase from "../../../../lib/supabase";

const NoteView = (props: TitleProps & IdentifierProps & EntityProps & TextProps) => {
  const { title, entity, text, guid } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  const handleTextBlur = async (value: string) => {
    const { error } = await supabase
      .from("notes")
      .update({ text: value })
      .eq("id", guid);

    if (error) {
      console.error("Error updating note text", error);
    }
  };

  return (
    <>
      <LoadNoteTextSystem mockupData />

      <View visibe={isVisible}>
        <NavigationBar></NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle}
        </BackButton>
        <Title>{title}</Title>
        <Spacer  />
        <TextEditor onBlur={handleTextBlur} value={text} />
      </View>
    </>
  );
};

export default NoteView;
