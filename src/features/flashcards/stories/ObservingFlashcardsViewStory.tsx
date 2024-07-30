import {
  LeanScopeClient,
  LeanScopeClientApp,
} from "@leanscope/api-client/node";
import React from "react";
import { Stories } from "../../../base/enums";
import Flashcards from "../../../pages/Flashcards";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";

const ObservingFlashcardsViewStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <InitializeStoriesSystem
          initialStory={Stories.OBSERVING_COLLECTION_STORY}
        />
        <InitializeSchoolSubjectsSystem />
        <InitializeAppSystem mockupData />

        <Flashcards />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingFlashcardsViewStory;
