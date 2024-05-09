import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext } from "react";
import { Stories, AdditionalTags } from "../../../base/enums";
import { Alert, AlertButton } from "../../../components";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayActionTexts } from "../../../utils/displayText";
import { useSelectedExam } from "../hooks/useSelectedExam";


const DeleteExamAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedExamId, selectedExamEntity } = useSelectedExam();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_EXAMS_STORY);

  const deleteExam = async () => {
    navigateBack();
    selectedExamEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedExamEntity) {
        lsc.engine.removeEntity(selectedExamEntity);

        const { error } = await supabaseClient.from("exam").delete().eq("id", selectedExamId);

        if (error) {
          console.error("Error deleting exam", error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteExam} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteExamAlert;
