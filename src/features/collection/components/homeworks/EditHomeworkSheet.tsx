import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { DueDateFacet, TitleFacet } from '../../../../app/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
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
} from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { useSelectedHomework } from '../../hooks/useSelectedHomework';
import { addNotificationEntity } from '../../../../common/utilities';

const EditHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedHomeworkTitle, selectedHomeworkEntity, selectedHomeworkId, selectedHomeworkDueDate } =
    useSelectedHomework();
  const [newTitle, setNewTitle] = useState(selectedHomeworkTitle);
  const [newDueDate, setNewDueDate] = useState(selectedHomeworkTitle);

  useEffect(() => {
    setNewTitle(selectedHomeworkTitle);
    setNewDueDate(selectedHomeworkDueDate);
  }, [selectedHomeworkTitle, selectedHomeworkDueDate]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_HOMEWORKS_STORY);

  const updateHomework = async () => {
    if (newTitle && newDueDate) {
      navigateBack();
      selectedHomeworkEntity?.add(new TitleFacet({ title: newTitle }));
      selectedHomeworkEntity?.add(new DueDateFacet({ dueDate: newDueDate }));

      const { error } = await supabaseClient
        .from(SupabaseTable.HOMEWORKS)
        .update({
          title: newTitle,
          due_date: newDueDate,
        })
        .eq(SupabaseColumn.ID, selectedHomeworkId);

      if (error) {
        console.error('Error updating homework set', error);
        addNotificationEntity(lsc, {
          title: 'Fehler beim Aktualisieren der Hausaufgabe',
          message: error.message + ' ' + error.details + ' ' + error.hint,
          type: 'error',
        });
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedHomeworkTitle || newDueDate !== selectedHomeworkDueDate) && (
          <PrimaryButton onClick={updateHomework}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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

export default EditHomeworkSheet;
