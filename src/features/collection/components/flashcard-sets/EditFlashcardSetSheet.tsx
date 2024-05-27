import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { TitleFacet } from "../../../../app/additionalFacets";
import { Stories, SupabaseTables } from "../../../../base/enums";
import {
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";

const EditFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedFlashcardSetTitle, selectedFlashcardSetEntity, selectedFlashcardSetId } = useSelectedFlashcardSet();
  const [newTitle, setNewTitle] = useState(selectedFlashcardSetTitle);

  useEffect(() => {
    setNewTitle(selectedFlashcardSetTitle);
  }, [selectedFlashcardSetTitle]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const updateFlashcardSet = async () => {
    if (newTitle) {
      navigateBack();
      selectedFlashcardSetEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from(SupabaseTables.FLASHCARD_SETS)
        .update({
          title: newTitle,
        })
        .eq("id", selectedFlashcardSetId);

      if (error) {
        console.error("Error updating flashcard set", error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).back}</SecondaryButton>
        {newTitle !== selectedFlashcardSetTitle && (
          <PrimaryButton onClick={updateFlashcardSet}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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

export default EditFlashcardSetSheet;
