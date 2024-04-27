import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Stories } from "../../../base/enums";
import { Sidebar } from "../../../components";
import AppInitSystem from "../../../systems/AppInitSystem";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import Homeworks from "../../../pages/Homeworks";
import { Settings } from "../../settings";

const ObservingHomeworksStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        
          <StoriesInitSystem
            initialStory={Stories.OBSERVING_COLLECTION_STORY}
          />
          <ViewManagerSystem />
          <AppInitSystem />

          <SchoolSubjectsInitSystem  />
          <Homeworks mockup />
          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingHomeworksStory;
