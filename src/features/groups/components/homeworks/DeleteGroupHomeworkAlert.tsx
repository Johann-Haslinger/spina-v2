import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { AdditionalTag, Story, SupabaseColumn } from '../../../../common/types/enums';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { useSelectedGroupHomework } from '../../hooks/useSelectedGroupHomework';

const DeleteGroupHomeworkAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_GROUP_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupHomeworkId, selectedGroupHomeworkEntity } = useSelectedGroupHomework();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_GROUP_TOPIC_STORY);

  const deleteGroupHomework = async () => {
    navigateBack();
    selectedGroupHomeworkEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupHomeworkEntity) {
        lsc.engine.removeEntity(selectedGroupHomeworkEntity);

        const { error } = await supabaseClient
          .from('group_homeworks')
          .delete()
          .eq(SupabaseColumn.ID, selectedGroupHomeworkId);

        if (error) {
          console.error('Error deleting group homework', error);
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
