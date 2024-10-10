import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import { Alert, AlertButton } from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../lib/supabase';
import { displayActionTexts } from '../../../utils/displayText';
import { useSelectedExam } from '../hooks/useSelectedExam';
import { addNotificationEntity } from '../../../common/utilities';

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
