import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
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
        const { error } = await supabaseClient
          .from(SupabaseTable.TOPICS)
          .delete()
          .eq(SupabaseColumn.ID, selectedTopicId);

        if (error) {
          console.error('Error deleting Topic', error);
          addNotificationEntity(lsc, {
            title: 'Fehler beim Löschen des Themas',
            message: error.message,
            type: 'error',
          });
          return;
        }

        lsc.engine.removeEntity(selectedTopicEntity);

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
