import  { useContext } from "react";
import { FlexBox, Sheet } from "../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Stories } from "../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const AddFlashcardGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_FLASHCARD_GROUP_STORY);


  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_GROUPS_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <button onClick={navigateBack}>
          Cancel
        </button>
      </FlexBox>
    </Sheet>
  );
};

export default AddFlashcardGroupSheet;
