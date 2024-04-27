import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import  { useContext } from 'react'
import { Stories, AdditionalTags } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../utils/selectDisplayText';
import { useSelectedHomework } from '../../hooks/useSelectedHomework';
import supabase from '../../../../lib/supabase';

const DeleteHomeworkAlert = () => {
    const lsc = useContext(LeanScopeClientContext);
    const isVisible = useIsStoryCurrent(Stories.DELETE_HOMEWORK_STORY);
    const { selectedLanguage } = useSelectedLanguage();
    const { selectedHomeworkId, selectedHomeworkEntity } =
      useSelectedHomework();
  
    const navigateBack = () =>
      lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);
  
    const deleteHomework = async () => {
      navigateBack();
      selectedHomeworkEntity?.add(AdditionalTags.NAVIGATE_BACK);
      setTimeout(async () => {
        if (selectedHomeworkEntity) {
          lsc.engine.removeEntity(selectedHomeworkEntity);
  
          const { error } = await supabase
            .from("homeworks")
            .delete()
            .eq("id", selectedHomeworkId);
  
          if (error) {
            console.error("Error deleting homework", error);
          }
        }
      }, 300);
    };
  
    return (
      <Alert
        navigateBack={navigateBack}
        visible={isVisible}
        title="Delete Homework"
        subTitle="Are you sure you want to delete this homework?"
      >
        <AlertButton onClick={navigateBack} role="primary">
          {displayActionTexts(selectedLanguage).cancel}
        </AlertButton>
        <AlertButton onClick={deleteHomework} role="destructive">
          {displayActionTexts(selectedLanguage).delete}
        </AlertButton>
      </Alert>
    );
}

export default DeleteHomeworkAlert