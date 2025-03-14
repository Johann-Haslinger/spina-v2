import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { addNotificationEntity } from '../../../common/utilities';
import { displayActionTexts } from '../../../common/utilities/displayText';
import { Alert, AlertButton } from '../../../components';
import supabaseClient from '../../../lib/supabase';
import { useSelectedExam } from '../hooks/useSelectedExam';

const DeleteExamAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedExamId, selectedExamEntity } = useSelectedExam();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_EXAMS_STORY);

  const deleteExam = async () => {
    navigateBack();
    selectedExamEntity?.add(AdditionalTag.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedExamEntity) {
        const { error } = await supabaseClient.from(SupabaseTable.EXAMS).delete().eq(SupabaseColumn.ID, selectedExamId);

        if (error) {
          console.error('Error deleting exam', error);
          addNotificationEntity(lsc, {
            title: 'Fehler beim Löschen der Prüfung',
            message: error.message,
            type: 'error',
          });
          return;
        }

        lsc.engine.removeEntity(selectedExamEntity);
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteExam} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteExamAlert;
