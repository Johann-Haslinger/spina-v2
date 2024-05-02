import { useContext } from "react";
import { Alert, AlertButton } from "../../../../components";
import { AdditionalTags, Stories } from "../../../../base/enums";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";
import supabaseClient from "../../../../lib/supabase";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts } from "../../../../utils/selectDisplayText";

const DeleteFlashcardSetAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.DELETE_FLASHCARD_SET_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedFlashcardSetId, selectedFlashcardSetEntity } =
    useSelectedFlashcardSet();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  const deleteFlashcardSet = async () => {
    navigateBack();
    selectedFlashcardSetEntity?.add(AdditionalTags.NAVIGATE_BACK);
    setTimeout(async () => {
      if (selectedFlashcardSetEntity) {
        lsc.engine.removeEntity(selectedFlashcardSetEntity);

        const { error } = await supabaseClient
          .from("flashcardSets")
          .delete()
          .eq("id", selectedFlashcardSetId);

        if (error) {
          console.error("Error deleting flashcard set", error);
        }

        const { error: flashcardsError } = await supabaseClient
          .from("flashCards")
          .delete()
          .eq("parentId", selectedFlashcardSetId);

        if (flashcardsError) {
          console.error("Error deleting flashcards", flashcardsError);
        }
      }
    }, 300);
  };

  return (
    <Alert
      navigateBack={navigateBack}
      visible={isVisible}
      title="Delete Flashcard Set"
      subTitle="Are you sure you want to delete this flashcard set?"
    >
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
