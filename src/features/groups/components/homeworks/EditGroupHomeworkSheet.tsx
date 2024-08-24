import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { DueDateFacet, TitleFacet } from '../../../../app/additionalFacets';
import { Story, SupabaseColumns } from '../../../../base/enums';
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
import { useSelectedGroupHomework } from '../../hooks/useSelectedGroupHomework';

const EditGroupHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDETING_GROUP_HOMEWORK_STORY);
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
    setNewDueDate(selectedGroupHomeworkDueDate);
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
        .eq(SupabaseColumns.ID, selectedGroupHomeworkId);

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
