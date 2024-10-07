import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { useSelectedHomework } from '../../hooks/useSelectedHomework';

const DeleteHomeworkAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedHomeworkId, selectedHomeworkEntity } = useSelectedHomework();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteHomework = async () => {
    navigateBack();
    selectedHomeworkEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedHomeworkEntity) {
        lsc.engine.removeEntity(selectedHomeworkEntity);

        const { error } = await supabaseClient
          .from(SupabaseTable.HOMEWORKS)
          .delete()
          .eq(SupabaseColumn.ID, selectedHomeworkId);

        if (error) {
          console.error('Error deleting homework', error);
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
