import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Stories } from "../../../base/enums";
import { Sidebar } from "../../../components";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import Homeworks from "../../../pages/Homeworks";
import { Settings } from "../../settings";

const ObservingHomeworksStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
          <ViewManagerSystem />
          <InitializeAppSystem />

          <InitializeSchoolSubjectsSystem />
          <Homeworks />
          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingHomeworksStory;
