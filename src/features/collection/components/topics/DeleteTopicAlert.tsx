import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTags, Story, SupabaseColumns, SupabaseTables } from '../../../../base/enums';
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
    selectedTopicEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedTopicEntity) {
        lsc.engine.removeEntity(selectedTopicEntity);

        const { error } = await supabaseClient
          .from(SupabaseTables.TOPICS)
          .delete()
          .eq(SupabaseColumns.ID, selectedTopicId);

        if (error) {
          console.error('Error deleting Topic', error);
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
