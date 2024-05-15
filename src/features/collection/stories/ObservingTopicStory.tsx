import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import { EntityCreator } from "@leanscope/ecs-engine";
import {
  DescriptionFacet,
  IdentifierFacet,
  OrderFacet,
  ParentFacet,
  Tags,
} from "@leanscope/ecs-models";
import React from "react";
import { TitleFacet } from "../../../app/a";
import { DataTypes, Stories } from "../../../base/enums";
import Collection from "../../../pages/Collection";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import { Sidebar } from "../../../components";
import { BrowserRouter } from "react-router-dom";
import { Settings } from "../../settings";

const ObservingTopicStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <BrowserRouter>
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Sinus" }),
              new DescriptionFacet({ description: "Sinusfunktionen" }),
              new IdentifierFacet({ guid: "100" }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: "1" }),
            ]}
            tags={[DataTypes.TOPIC, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Mathematik" }),
              new IdentifierFacet({ guid: "1" }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[DataTypes.SCHOOL_SUBJECT, Tags.SELECTED]}
          />
          <InitializeStoriesSystem
            initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY}
          />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeSchoolSubjectsSystem />
          <LoadTopicsSystem />

          <Collection />
          <Sidebar />
          <Settings />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingTopicStory;
