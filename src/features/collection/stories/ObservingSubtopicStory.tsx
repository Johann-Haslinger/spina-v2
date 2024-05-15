import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import Collection from "../../../pages/Collection";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { DataTypes, Stories } from "../../../base/enums";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import { EntityCreator } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { DateAddedFacet, TitleFacet } from "../../../app/a";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";
import { Sidebar } from "../../../components";
import { BrowserRouter } from "react-router-dom";
import { Settings } from "../../settings";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";

const ObservingSubtopicStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <BrowserRouter>
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Sinus Exercise Podcast" }),
              new DateAddedFacet({ dateAdded: new Date().toISOString() }),
              new IdentifierFacet({ guid: "101" }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: "100" }),
            ]}
            tags={[DataTypes.PODCAST]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Sinus Exercise" }),
              new IdentifierFacet({ guid: "100" }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: "10" }),
            ]}
            tags={[DataTypes.SUBTOPIC, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Sinus" }),
              new DescriptionFacet({ description: "Sinusfunktionen" }),
              new IdentifierFacet({ guid: "10" }),
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
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY} />
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

export default ObservingSubtopicStory;
