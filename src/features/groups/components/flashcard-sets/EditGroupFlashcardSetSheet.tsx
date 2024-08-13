import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { TitleFacet } from '../../../../app/additionalFacets';
import { Stories, SupabaseColumns } from '../../../../base/enums';
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
import { useSelectedGroupFlashcardSet } from '../../hooks/useSelectedGroupFlashcardSet';

const EditGroupFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDETING_GROUP_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupFlashcardSetTitle, selectedGroupFlashcardSetEntity, selectedGroupFlashcardSetId } =
    useSelectedGroupFlashcardSet();
  const [newTitle, setNewTitle] = useState(selectedGroupFlashcardSetTitle);

  useEffect(() => {
    setNewTitle(selectedGroupFlashcardSetTitle);
  }, [selectedGroupFlashcardSetTitle]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const updateGroupFlashcardSet = async () => {
    if (newTitle) {
      navigateBack();
      selectedGroupFlashcardSetEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from('group_flashcard_sets')
        .update({
          title: newTitle,
        })
        .eq(SupabaseColumns.ID, selectedGroupFlashcardSetId);

      if (error) {
        console.error('Error updating flashcard set', error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).back}</SecondaryButton>
        {newTitle !== selectedGroupFlashcardSetTitle && (
          <PrimaryButton onClick={updateGroupFlashcardSet}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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

export default EditGroupFlashcardSetSheet;
