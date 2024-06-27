import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { AdditionalTags, Stories, SupabaseColumns, SupabaseTables } from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedGroupSubtopic } from "../../hooks/useSelectedGroupSubtopic";

const DeleteGroupSubtopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_GROUP_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupSubtopicId, selectedGroupSubtopicEntity } = useSelectedGroupSubtopic();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const deleteGroupSubtopic = async () => {
    navigateBack();
    selectedGroupSubtopicEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupSubtopicEntity) {
        lsc.engine.removeEntity(selectedGroupSubtopicEntity);

        const { error: GroupSubtopicError } = await supabaseClient
          .from("group_subtopics")
          .delete()
          .eq(SupabaseColumns.ID, selectedGroupSubtopicId);

        if (GroupSubtopicError) {
          console.error("Error deleting group subtopic", GroupSubtopicError);
        }

        const { error: blockError } = await supabaseClient
          .from(SupabaseTables.BLOCKS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedGroupSubtopicId);

        if (blockError) {
          console.error("Error deleting blocks", blockError);
        }

        const { error: flashcardsError } = await supabaseClient
          .from("group_flashcards")
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedGroupSubtopicId);

        if (flashcardsError) {
          console.error("Error deleting flashcards", flashcardsError);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteGroupSubtopic} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteGroupSubtopicAlert;
