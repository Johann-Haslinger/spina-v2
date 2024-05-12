import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Stories } from "../../../base/enums";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";

import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import Blockeditor from "../components/Blockeditor";
import { View } from "../../../components";

const ObservingBlockeditorStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <InitializeStoriesSystem initialStory={Stories.OBSERVING_FLASHCARD_QUIZ_STORY} />

        <InitializeAppSystem mockupData />
        <ViewManagerSystem />

        <InitializeSchoolSubjectsSystem />

        <View viewType="baseView">
          <Blockeditor title="Blockeditor" id="1" />
        </View>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingBlockeditorStory;
