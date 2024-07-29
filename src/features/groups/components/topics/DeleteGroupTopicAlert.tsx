import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import {
  AdditionalTags,
  Stories,
  SupabaseColumns,
} from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedGroupTopic } from "../../hooks/useSelectedGroupTopic";

const DeleteGroupTopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_GROUP_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicId, selectedGroupTopicEntity } =
    useSelectedGroupTopic();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const deleteGroupTopic = async () => {
    navigateBack();
    selectedGroupTopicEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupTopicEntity) {
        lsc.engine.removeEntity(selectedGroupTopicEntity);

        const { error } = await supabaseClient
          .from("learning_group_topics")
          .delete()
          .eq(SupabaseColumns.ID, selectedGroupTopicId);

        if (error) {
          console.error("Error deleting learning group topic", error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteGroupTopic} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteGroupTopicAlert;
