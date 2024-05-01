import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import React, { useContext, useEffect, useState } from "react";
import { TitleFacet, DueDateFacet } from "../../../../app/AdditionalFacets";
import { Stories } from "../../../../base/enums";
import {
  Sheet,
  FlexBox,
  CancelButton,
  SaveButton,
  Spacer,
  Section,
  SectionRow,
  TextInput,
  TextAreaInput,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { DescriptionFacet } from "@leanscope/ecs-models";

const EditTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDIT_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedTopicTitle,
    selectedTopicDescription,
    selectedTopicEntity,
    selectedTopicId,
  } = useSelectedTopic();
  const [newTitle, setNewTitle] = useState(selectedTopicTitle);
  const [newDescription, setNewDescription] = useState(
    selectedTopicDescription
  );

  useEffect(() => {
    setNewTitle(selectedTopicTitle);
    setNewDescription(selectedTopicDescription);
  }, [selectedTopicTitle, selectedTopicDescription]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const updateTopic = async () => {
    if (newTitle && newDescription) {
      navigateBack();
      selectedTopicEntity?.add(new TitleFacet({ title: newTitle }));
      selectedTopicEntity?.add(
        new DescriptionFacet({ description: newDescription })
      );

      const { error } = await supabaseClient
        .from("topics")
        .update({
          topicName: newTitle,
          topicDescription: newDescription,
        })
        .eq("id", selectedTopicId);

      if (error) {
        console.error("Error updating topic set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>
        {(newTitle !== selectedTopicTitle ||
          newDescription !== selectedTopicDescription) && (
          <SaveButton onClick={updateTopic}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditTopicSheet;
