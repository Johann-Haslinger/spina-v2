import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTags, Story, SupabaseColumns, SupabaseTables } from '../../../../base/enums';
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
    selectedFlashcardSetEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedFlashcardSetEntity) {
        lsc.engine.removeEntity(selectedFlashcardSetEntity);

        const { error } = await supabaseClient
          .from(SupabaseTables.FLASHCARD_SETS)
          .delete()
          .eq(SupabaseColumns.ID, selectedFlashcardSetId);

        if (error) {
          console.error('Error deleting flashcard set', error);
        }

        const { error: flashcardsError } = await supabaseClient
          .from(SupabaseTables.FLASHCARDS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedFlashcardSetId);

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
