import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { displayActionTexts } from '../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../components';
import supabaseClient from '../../../lib/supabase';
import { useSelectedLearningGroup } from '../hooks/useSelectedLearningGroup';

const DeleteLearningGroupAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_LERNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedLearningGroupId, selectedLearningGroupEntity } = useSelectedLearningGroup();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteLearningGroup = async () => {
    navigateBack();
    selectedLearningGroupEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedLearningGroupEntity) {
        lsc.engine.removeEntity(selectedLearningGroupEntity);

        const { error } = await supabaseClient
          .from(SupabaseTable.LEARNING_GROUPS)
          .delete()
          .eq(SupabaseColumn.ID, selectedLearningGroupId);

        if (error) {
          console.error('Error deleting learning group', error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteLearningGroup} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteLearningGroupAlert;
