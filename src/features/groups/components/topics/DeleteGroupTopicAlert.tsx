import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';

const DeleteGroupTopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_GROUP_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicId, selectedGroupTopicEntity } = useSelectedGroupTopic();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_GROUP_TOPIC_STORY);

  const deleteGroupTopic = async () => {
    navigateBack();
    selectedGroupTopicEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupTopicEntity) {
        lsc.engine.removeEntity(selectedGroupTopicEntity);

        const { error } = await supabaseClient
          .from('learning_group_topics')
          .delete()
          .eq(SupabaseColumn.ID, selectedGroupTopicId);

        if (error) {
          console.error('Error deleting learning group topic', error);
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
