import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React from "react";
import { StoryGuid } from "../../../base/enums";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import AppInitSystem from "../../../systems/AppInitSystem";
import { Sidebar } from "../../../components";
import { BrowserRouter } from "react-router-dom";
import { Settings } from "../../settings";

const ObservingSidebarStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <StoriesInitSystem
            initialStory={StoryGuid.OBSERVING_COLLECTION_STORY}
          />
          <ViewManagerSystem />
          <AppInitSystem />

          <SchoolSubjectsInitSystem mockupData />
          <Collection />
          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingSidebarStory;
