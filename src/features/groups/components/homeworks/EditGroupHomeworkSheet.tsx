import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { DueDateFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { Story, SupabaseColumn } from '../../../../common/types/enums';
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
import { useSelectedGroupHomework } from '../../hooks/useSelectedGroupHomework';

const EditGroupHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_GROUP_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedGroupHomeworkTitle,
    selectedGroupHomeworkEntity,
    selectedGroupHomeworkId,
    selectedGroupHomeworkDueDate,
  } = useSelectedGroupHomework();
  const [newTitle, setNewTitle] = useState(selectedGroupHomeworkTitle);
  const [newDueDate, setNewDueDate] = useState(selectedGroupHomeworkTitle);

  useEffect(() => {
    setNewTitle(selectedGroupHomeworkTitle);
    setNewDueDate(selectedGroupHomeworkDueDate || '');
  }, [selectedGroupHomeworkTitle, selectedGroupHomeworkDueDate]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_GROUP_TOPIC_STORY);

  const updateGroupHomework = async () => {
    if (newTitle && newDueDate) {
      navigateBack();
      selectedGroupHomeworkEntity?.add(new TitleFacet({ title: newTitle }));
      selectedGroupHomeworkEntity?.add(new DueDateFacet({ dueDate: newDueDate }));

      const { error } = await supabaseClient
        .from('group_homeworks')
        .update({
          title: newTitle,
          dueDate: newDueDate,
        })
        .eq(SupabaseColumn.ID, selectedGroupHomeworkId);

      if (error) {
        console.error('Error updating group homework', error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedGroupHomeworkTitle || newDueDate !== selectedGroupHomeworkDueDate) && (
          <PrimaryButton onClick={updateGroupHomework}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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

export default EditGroupHomeworkSheet;
