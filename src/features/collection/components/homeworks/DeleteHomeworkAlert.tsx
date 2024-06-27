import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { AdditionalTags, Stories, SupabaseColumns, SupabaseTables } from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedHomework } from "../../hooks/useSelectedHomework";

const DeleteHomeworkAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedHomeworkId, selectedHomeworkEntity } = useSelectedHomework();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteHomework = async () => {
    navigateBack();
    selectedHomeworkEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedHomeworkEntity) {
        lsc.engine.removeEntity(selectedHomeworkEntity);

        const { error } = await supabaseClient
          .from(SupabaseTables.HOMEWORKS)
          .delete()
          .eq(SupabaseColumns.ID, selectedHomeworkId);

        if (error) {
          console.error("Error deleting homework", error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteHomework} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteHomeworkAlert;
