import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { useSelectedGroupFlashcardSet } from '../../hooks/useSelectedGroupFlashcardSet';

const DeleteGroupFlashcardSetAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_GROUP_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupFlashcardSetId, selectedGroupFlashcardSetEntity } = useSelectedGroupFlashcardSet();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteGroupFlashcardSet = async () => {
    navigateBack();
    selectedGroupFlashcardSetEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupFlashcardSetEntity) {
        lsc.engine.removeEntity(selectedGroupFlashcardSetEntity);

        const { error } = await supabaseClient
          .from('group_flashcard_sets')
          .delete()
          .eq(SupabaseColumn.ID, selectedGroupFlashcardSetId);

        if (error) {
          console.error('Error deleting flashcard set', error);
        }

        const { error: flashcardsError } = await supabaseClient
          .from('group_flashcards')
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedGroupFlashcardSetId);

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
      <AlertButton onClick={deleteGroupFlashcardSet} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteGroupFlashcardSetAlert;
