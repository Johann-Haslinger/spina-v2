import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import React, { useContext, useEffect, useState } from 'react'
import { TitleFacet } from '../../../../app/AdditionalFacets';
import { Stories } from '../../../../base/enums';
import { Sheet, FlexBox, CancelButton, SaveButton, Spacer, Section, SectionRow, TextInput } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayButtonTexts } from '../../../../utils/selectDisplayText';
import { useSelectedSubtopic } from '../../hooks/useSelectedSubtopic';

const EditSubtopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDIT_SUBTOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedSubtopicTitle,
    selectedSubtopicEntity,
    selectedSubtopicId,
  } = useSelectedSubtopic();
  const [newTitle, setNewTitle] = useState(selectedSubtopicTitle);

  useEffect(() => {
    setNewTitle(selectedSubtopicTitle);
  }, [selectedSubtopicTitle]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const updateSubtopic = async () => {
    if (newTitle) {
      navigateBack();
      selectedSubtopicEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from("subTopics")
        .update({
          title: newTitle,
        })
        .eq("id", selectedSubtopicId);

      if (error) {
        console.error("Error updating subtopic", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).back}
        </CancelButton>
        {newTitle !== selectedSubtopicTitle && (
          <SaveButton onClick={updateSubtopic}>
            {displayButtonTexts(selectedLanguage).save}
          </SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
}

export default EditSubtopicSheet