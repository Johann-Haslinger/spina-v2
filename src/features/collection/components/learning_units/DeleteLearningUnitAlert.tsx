import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseTable } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useSelectedLearningUnit } from '../../../../common/hooks/useSelectedLearningUnit';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

const DeleteLearningUnitAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_NOTE_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedLearningUnitEntity, selectedLearningUnitId } = useSelectedLearningUnit();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteNote = async () => {
    navigateBack();
    selectedLearningUnitEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedLearningUnitEntity) {
        lsc.engine.removeEntity(selectedLearningUnitEntity);

        const { error } = await supabaseClient
          .from(SupabaseTable.LEARNING_UNITS)
          .delete()
          .eq('id', selectedLearningUnitId);

        if (error) {
          console.error('Error deleting learning unit', error);
        }

        const { error: error2 } = await supabaseClient
          .from(SupabaseTable.FLASHCARDS)
          .delete()
          .eq('parent_id', selectedLearningUnitId);

        if (error2) {
          console.error('Error deleting flashcards', error2);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteNote} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteLearningUnitAlert;
