import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { StoryGuid } from "../../../base/enums";
import { Sidebar } from "../../../components";
import AppInitSystem from "../../../systems/AppInitSystem";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Settings } from "../../settings";
import Homeworks from "../../../pages/Homeworks";

const ObservingHomeworksStory = () => {
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
          <Homeworks mockup />
          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingHomeworksStory;
