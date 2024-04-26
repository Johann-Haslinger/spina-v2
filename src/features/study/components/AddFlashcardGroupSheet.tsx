import React, { useContext, useState } from "react";
import { FlexBox, Sheet } from "../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { StoryGuid } from "../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjects";

const AddFlashcardGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(StoryGuid.ADD_FLASHCARD_GROUP_STORY);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const [newFlashcardGroup, setNewFlashcardGroup] = useState({
    title: "",
    parentId: "",
    dateAdded: new Date().toISOString(),
  });

  const navigateBack = () =>
    lsc.stories.transitTo(StoryGuid.OBSERVING_FLASHCARD_GROUPS_STORY);

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
