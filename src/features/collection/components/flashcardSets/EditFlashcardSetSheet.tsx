import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext, useEffect, useState } from "react";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { Stories } from "../../../../base/enums";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";
import { TitleFacet } from "../../../../app/AdditionalFacets";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const EditFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedFlashcardSetTitle,
    selectedFlashcardSetEntity,
    selectedFlashcardSetId,
  } = useSelectedFlashcardSet();
  const [newTitle, setNewTitle] = useState(selectedFlashcardSetTitle);

  useEffect(() => {
    setNewTitle(selectedFlashcardSetTitle);
  }, [selectedFlashcardSetTitle]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const updateFlashcardSet = async () => {
    if (newTitle) {
      navigateBack();
      selectedFlashcardSetEntity?.add(new TitleFacet({ title: newTitle }));

      const { error } = await supabaseClient
        .from("flashcardSets")
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
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).back}
        </CancelButton>
        {newTitle !== selectedFlashcardSetTitle && (
          <SaveButton onClick={updateFlashcardSet}>
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
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditFlashcardSetSheet;
