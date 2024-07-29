import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import {
  AdditionalTags,
  Stories,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import { Alert, AlertButton } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayActionTexts } from "../../../utils/displayText";
import { useSelectedLearningGroup } from "../hooks/useSelectedLearningGroup";

const DeleteLearningGroupAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_LERNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedLearningGroupId, selectedLearningGroupEntity } =
    useSelectedLearningGroup();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteLearningGroup = async () => {
    navigateBack();
    selectedLearningGroupEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedLearningGroupEntity) {
        lsc.engine.removeEntity(selectedLearningGroupEntity);

        const { error } = await supabaseClient
          .from(SupabaseTables.LEARNING_GROUPS)
          .delete()
          .eq(SupabaseColumns.ID, selectedLearningGroupId);

        if (error) {
          console.error("Error deleting learning group", error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteLearningGroup} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteLearningGroupAlert;
