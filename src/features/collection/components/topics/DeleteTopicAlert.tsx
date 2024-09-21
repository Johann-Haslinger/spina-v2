import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

const DeleteTopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicId, selectedTopicEntity } = useSelectedTopic();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteTopic = async () => {
    navigateBack();
    selectedTopicEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedTopicEntity) {
        lsc.engine.removeEntity(selectedTopicEntity);

        const { error } = await supabaseClient
          .from(SupabaseTable.TOPICS)
          .delete()
          .eq(SupabaseColumn.ID, selectedTopicId);

        if (error) {
          console.error('Error deleting Topic', error);
        }

        const { error: error6 } = await supabaseClient
          .from(SupabaseTable.HOMEWORKS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedTopicId);

        if (error6) {
          console.error('Error deleting Homeworks', error6);
        }

        const { error: error7 } = await supabaseClient
          .from(SupabaseTable.EXAMS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedTopicId);

        if (error7) {
          console.error('Error deleting Exams', error7);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteTopic} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteTopicAlert;
