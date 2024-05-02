import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import React, { useContext } from "react";
import { Stories, AdditionalTags } from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/selectDisplayText";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";

const DeleteSubtopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETE_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedSubtopicId, selectedSubtopicEntity } = useSelectedSubtopic();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteSubtopic = async () => {
    navigateBack();
    selectedSubtopicEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedSubtopicEntity) {
        lsc.engine.removeEntity(selectedSubtopicEntity);

        const { error: subtopicError } = await supabaseClient.from("subTopics").delete().eq("id", selectedSubtopicId);

        if (subtopicError) {
          console.error("Error deleting Subtopic", subtopicError);
        }

        const { error: knowledgeError } = await supabaseClient
          .from("knowledges")
          .delete()
          .eq("parentId", selectedSubtopicId);

        if (knowledgeError) {
          console.error("Error deleting knowledge", knowledgeError);
        }

        const { error: flashcardsError } = await supabaseClient
          .from("flashCards")
          .delete()
          .eq("parentId", selectedSubtopicId);

        if (flashcardsError) {
          console.error("Error deleting flashcards", flashcardsError);
        }
      }
    }, 300);
  };

  return (
    <Alert
      navigateBack={navigateBack}
      visible={isVisible}
      title="Delete Subtopic"
      subTitle="Are you sure you want to delete this Subtopic?"
    >
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteSubtopic} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteSubtopicAlert;
