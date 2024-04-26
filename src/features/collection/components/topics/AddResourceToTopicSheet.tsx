import React, { useContext } from "react";
import { Sheet } from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const AddResourceToTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_RESOURCE_TO_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <button onClick={navigateBack}>Cancel</button>
    </Sheet>
  );
};

export default AddResourceToTopicSheet;
