import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { Stories } from "../../../base/enums";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";

import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import Blockeditor from "../components/Blockeditor";
import { Sidebar, View } from "../../../components";
import { BrowserRouter } from "react-router-dom";
import { Settings } from "../../settings";
import InitializeBlockeditorSystem from "../systems/InitializeBlockeditorSystem";

const ObservingBlockeditorStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <BrowserRouter>
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_FLASHCARD_QUIZ_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeBlockeditorSystem blockeditorId="1" />
          <InitializeSchoolSubjectsSystem />

          <View viewType="baseView">
            <Blockeditor title="Blockeditor" id="1" />
          </View>
          <Sidebar />
          <Settings />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingBlockeditorStory;
