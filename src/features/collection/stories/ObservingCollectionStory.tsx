import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React, { useEffect } from "react";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";

const ObservingCollectionStory = () => {

  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <SchoolSubjectsInitSystem mokUpData />
        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingCollectionStory;
