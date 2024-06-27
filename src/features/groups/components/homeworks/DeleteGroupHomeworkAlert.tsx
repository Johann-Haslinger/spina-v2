import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { AdditionalTags, Stories, SupabaseColumns } from "../../../../base/enums";
import { Alert, AlertButton } from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayActionTexts } from "../../../../utils/displayText";
import { useSelectedGroupHomework } from "../../hooks/useSelectedGroupHomework";

const DeleteGroupHomeworkAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_GROUP_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupHomeworkId, selectedGroupHomeworkEntity } = useSelectedGroupHomework();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const deleteGroupHomework = async () => {
    navigateBack();
    selectedGroupHomeworkEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupHomeworkEntity) {
        lsc.engine.removeEntity(selectedGroupHomeworkEntity);

        const { error } = await supabaseClient
          .from("group_homeworks")
          .delete()
          .eq(SupabaseColumns.ID, selectedGroupHomeworkId);

        if (error) {
          console.error("Error deleting group homework", error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteGroupHomework} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteGroupHomeworkAlert;
