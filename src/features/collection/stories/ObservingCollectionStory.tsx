import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Stories } from "../../../base/enums";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import AppInitSystem from "../../../systems/AppInitSystem";
import { Sidebar } from "../../../components";
import { BrowserRouter } from "react-router-dom";

const ObservingCollectionStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <StoriesInitSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
          <AppInitSystem mockupData />
          <ViewManagerSystem />
          <SchoolSubjectsInitSystem />
          <Collection />
          <Sidebar />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingCollectionStory;
