import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import {
  DateInput,
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from '../../../components';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../lib/supabase';
import { displayButtonTexts, displayLabelTexts } from '../../../utils/displayText';
import { useSelectedExam } from '../hooks/useSelectedExam';
import { addNotificationEntity } from '../../../common/utilities';

const EditExamSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedExamTitle, selectedExamEntity, selectedExamId, selectedExamDueDate } = useSelectedExam();
  const [newTitle, setNewTitle] = useState(selectedExamTitle);
  const [newDueDate, setNewDueDate] = useState(selectedExamTitle);

  useEffect(() => {
    setNewTitle(selectedExamTitle);
    setNewDueDate(selectedExamDueDate);
  }, [selectedExamTitle, selectedExamDueDate]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_EXAMS_STORY);

  const updateExam = async () => {
    if (newTitle && newDueDate) {
      navigateBack();

      const { error } = await supabaseClient
        .from(SupabaseTable.EXAMS)
        .update({
          title: newTitle,
          due_date: newDueDate,
        })
        .eq(SupabaseColumn.ID, selectedExamId);

      if (error) {
        console.error('Error updating exam set', error);
        addNotificationEntity(lsc, {
          title: 'Fehler beim Aktualisieren der Prüfung',
          message: error.message,
          type: 'error',
        });
        return;
      }

      selectedExamEntity?.add(new TitleFacet({ title: newTitle }));
      selectedExamEntity?.add(new DueDateFacet({ dueDate: newDueDate }));
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedExamTitle || newDueDate !== selectedExamDueDate) && (
          <PrimaryButton onClick={updateExam}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last>
          <FlexBox>
            <div>{displayLabelTexts(selectedLanguage).dueDate}</div>
            <DateInput type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
          </FlexBox>
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditExamSheet;
