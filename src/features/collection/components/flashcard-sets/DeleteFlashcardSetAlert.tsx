import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { useSelectedFlashcardSet } from '../../hooks/useSelectedFlashcardSet';

const DeleteFlashcardSetAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedFlashcardSetId, selectedFlashcardSetEntity } = useSelectedFlashcardSet();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteFlashcardSet = async () => {
    navigateBack();
    selectedFlashcardSetEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedFlashcardSetEntity) {
        lsc.engine.removeEntity(selectedFlashcardSetEntity);

        const { error } = await supabaseClient
          .from(SupabaseTable.FLASHCARD_SETS)
          .delete()
          .eq(SupabaseColumn.ID, selectedFlashcardSetId);

        if (error) {
          console.error('Error deleting flashcard set', error);
        }

        const { error: flashcardsError } = await supabaseClient
          .from(SupabaseTable.FLASHCARDS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedFlashcardSetId);

        if (flashcardsError) {
          console.error('Error deleting flashcards', flashcardsError);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteFlashcardSet} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteFlashcardSetAlert;
