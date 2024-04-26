import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React from "react";
import { Stories } from "../../../base/enums";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import Study from "../../../pages/Study";

const ObservingStudyAreaStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <StoriesInitSystem
          initialStory={Stories.OBSERVING_COLLECTION_STORY}
        />
        <SchoolSubjectsInitSystem mockupData />
        <Study />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingStudyAreaStory;
