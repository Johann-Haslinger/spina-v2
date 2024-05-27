import { useContext } from "react";
import { Alert, AlertButton } from "../../../../components";
import { AdditionalTags, Stories, SupabaseTables } from "../../../../base/enums";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";
import supabaseClient from "../../../../lib/supabase";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../../utils/displayText";

const DeleteFlashcardSetAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETING_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedFlashcardSetId, selectedFlashcardSetEntity } = useSelectedFlashcardSet();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteFlashcardSet = async () => {
    navigateBack();
    selectedFlashcardSetEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedFlashcardSetEntity) {
        lsc.engine.removeEntity(selectedFlashcardSetEntity);

        const { error } = await supabaseClient.from(SupabaseTables.FLASHCARD_SETS).delete().eq("id", selectedFlashcardSetId);

        if (error) {
          console.error("Error deleting flashcard set", error);
        }

        const { error: flashcardsError } = await supabaseClient
          .from(SupabaseTables.FLASHCARDS)
          .delete()
          .eq("parent_id", selectedFlashcardSetId);

        if (flashcardsError) {
          console.error("Error deleting flashcards", flashcardsError);
        }
      }
    }, 300);
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteFlashcardSet} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

export default DeleteFlashcardSetAlert;
