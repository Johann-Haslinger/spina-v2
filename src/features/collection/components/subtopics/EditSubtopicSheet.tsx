import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { TitleFacet } from '../../../../app/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import {
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
import { useSelectedSubtopic } from '../../hooks/useSelectedSubtopic';

const EditSubtopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedSubtopicTitle, selectedSubtopicEntity, selectedSubtopicId } = useSelectedSubtopic();
  const [newTitle, setNewTitle] = useState(selectedSubtopicTitle);

  useEffect(() => {
    setNewTitle(selectedSubtopicTitle);
  }, [selectedSubtopicTitle]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_SET_STORY);

  const updateSubtopic = async () => {
    if (newTitle) {
      navigateBack();
      selectedSubtopicEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from(SupabaseTable.SUBTOPICS)
        .update({
          title: newTitle,
        })
        .eq(SupabaseColumn.ID, selectedSubtopicId);

      if (error) {
        console.error('Error updating subtopic', error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).back}</SecondaryButton>
        {newTitle !== selectedSubtopicTitle && (
          <PrimaryButton onClick={updateSubtopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditSubtopicSheet;
