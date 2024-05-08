import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import Collection from "../../../pages/Collection";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Stories } from "../../../base/enums";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";

const ObservingPodcastCollection = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <InitializeStoriesSystem initialStory={Stories.OBSERVING_PODCASTS_COLLECTION} />
        <InitializeAppSystem mockupData />

        <ViewManagerSystem />
        <InitializeSchoolSubjectsSystem />
        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingPodcastCollection;
