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

        const { error: error2 } = await supabaseClient
          .from(SupabaseTables.CHAPTERS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

        if (error2) {
          console.error('Error deleting Chapters', error2);
        }

        const { error: error3 } = await supabaseClient
          .from(SupabaseTables.NOTES)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

        if (error3) {
          console.error('Error deleting Notes', error3);
        }

        const { error: error4 } = await supabaseClient
          .from(SupabaseTables.SUBTOPICS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

        if (error4) {
          console.error('Error deleting Subtopics', error4);
        }

        const { error: error5 } = await supabaseClient
          .from(SupabaseTables.FLASHCARD_SETS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

        if (error5) {
          console.error('Error deleting Flashcard Sets', error5);
        }

        const { error: error6 } = await supabaseClient
          .from(SupabaseTables.HOMEWORKS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

        if (error6) {
          console.error('Error deleting Homeworks', error6);
        }

        const { error: error7 } = await supabaseClient
          .from(SupabaseTables.EXAMS)
          .delete()
          .eq(SupabaseColumns.PARENT_ID, selectedTopicId);

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
