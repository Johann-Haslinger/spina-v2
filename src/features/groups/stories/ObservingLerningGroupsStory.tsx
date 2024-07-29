import {
  LeanScopeClient,
  LeanScopeClientApp,
} from "@leanscope/api-client/node";
import React from "react";
import { Stories } from "../../../base/enums";
import { Groups } from "../../../pages/Index";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Sidebar } from "../../../components";
import { Settings } from "../../settings";
import { BrowserRouter } from "react-router-dom";

const ObservingLerningGroupsStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <ViewManagerSystem />
          <InitializeStoriesSystem
            initialStory={Stories.OBSERVING_LERNING_GROUPS_STORY}
          />
          <InitializeSchoolSubjectsSystem />
          <InitializeAppSystem mockupData />

          <Groups />

          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingLerningGroupsStory;
