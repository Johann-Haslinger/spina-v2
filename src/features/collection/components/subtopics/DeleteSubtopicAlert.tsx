import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { useSelectedSubtopic } from '../../hooks/useSelectedSubtopic';

const DeleteSubtopicAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedSubtopicId, selectedSubtopicEntity } = useSelectedSubtopic();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteSubtopic = async () => {
    navigateBack();
    selectedSubtopicEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedSubtopicEntity) {
        lsc.engine.removeEntity(selectedSubtopicEntity);

        const { error: subtopicError } = await supabaseClient
          .from(SupabaseTable.SUBTOPICS)
          .delete()
          .eq(SupabaseColumn.ID, selectedSubtopicId);

        if (subtopicError) {
          console.error('Error deleting Subtopic', subtopicError);
        }

        const { error: knowledgeError } = await supabaseClient
          .from('knowledges')
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedSubtopicId);

        if (knowledgeError) {
          console.error('Error deleting knowledge', knowledgeError);
        }

        const { error: flashcardsError } = await supabaseClient
          .from(SupabaseTable.FLASHCARDS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedSubtopicId);

        if (flashcardsError) {
          console.error('Error deleting flashcards', flashcardsError);
        }

        const { error: blocksError } = await supabaseClient
          .from(SupabaseTable.BLOCKS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedSubtopicId);

        if (blocksError) {
          console.error('Error deleting blocks', blocksError);
        }

        const { error: podcastsError } = await supabaseClient
          .from(SupabaseTable.PODCASTS)
          .delete()
          .eq(SupabaseColumn.PARENT_ID, selectedSubtopicId);

        if (podcastsError) {
          console.error('Error deleting podcasts', podcastsError);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteSubtopic} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteSubtopicAlert;
