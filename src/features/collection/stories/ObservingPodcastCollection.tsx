import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Stories } from "../../../base/enums";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import AppInitSystem from "../../../systems/AppInitSystem";

const ObservingPodcastCollection = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
      <StoriesInitSystem initialStory={Stories.OBSERVING_PODCASTS_COLLECTION} />
        <AppInitSystem mockupData />
     
        <ViewManagerSystem />
        <SchoolSubjectsInitSystem />
        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingPodcastCollection;
