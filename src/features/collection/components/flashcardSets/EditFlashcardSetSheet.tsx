import { LeanScopeClientContext } from "@leanscope/api-client/node";
import  { useContext } from "react";
import { Sheet } from "../../../../components";
import { Stories } from "../../../../base/enums";
import { useIsStoryCurrent } from "@leanscope/storyboarding";

const EditFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDIT_FLASHCARD_SET_STORY);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <button onClick={navigateBack}>Back</button>
    </Sheet>
  );
};

export default EditFlashcardSetSheet;
