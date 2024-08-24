import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTags, Story, SupabaseColumns } from '../../../../base/enums';
import { Alert, AlertButton } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { useSelectedGroupNote } from '../../hooks/useSelectedGroupNote';

const DeleteGroupNoteAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_GROUP_NOTE_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupNoteId, selectedGroupNoteEntity } = useSelectedGroupNote();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  const deleteGroupNote = async () => {
    navigateBack();
    selectedGroupNoteEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedGroupNoteEntity) {
        lsc.engine.removeEntity(selectedGroupNoteEntity);

        const { error } = await supabaseClient.from('group_notes').delete().eq(SupabaseColumns.ID, selectedGroupNoteId);

        if (error) {
          console.error('Error deleting group note', error);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteGroupNote} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteGroupNoteAlert;
