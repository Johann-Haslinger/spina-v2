import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { DiscardUnsavedChangesAlert } from '../../../../common/components/others';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { DueDateFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
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
import supabaseClient from '../../../../lib/supabase';
import { useDiscardAlertState } from '../../hooks/useDiscardAlertState';
import { useSelectedHomework } from '../../hooks/useSelectedHomework';

const EditHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedHomeworkTitle, selectedHomeworkEntity, selectedHomeworkId, selectedHomeworkDueDate } =
    useSelectedHomework();
  const [newTitle, setNewTitle] = useState(selectedHomeworkTitle);
  const [newDueDate, setNewDueDate] = useState(selectedHomeworkTitle);
  const { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert } = useDiscardAlertState();
  const hasUnsavedChanges = newTitle !== selectedHomeworkTitle || newDueDate !== selectedHomeworkDueDate;

  useEffect(() => {
    setNewTitle(selectedHomeworkTitle);
    setNewDueDate(selectedHomeworkDueDate || '');
  }, [selectedHomeworkTitle, selectedHomeworkDueDate]);

  const navigateBack = () => {
    closeDiscardAlert();
    lsc.stories.transitTo(Story.OBSERVING_HOMEWORKS_STORY);
  };

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

  const handleBackClick = () => (hasUnsavedChanges ? openDiscardAlert() : navigateBack());

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={handleBackClick}>
        <FlexBox>
          <SecondaryButton onClick={handleBackClick}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
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

      <DiscardUnsavedChangesAlert
        isVisible={isDiscardAlertVisible}
        close={() => navigateBack()}
        cancel={closeDiscardAlert}
      />
    </div>
  );
};

export default EditHomeworkSheet;
