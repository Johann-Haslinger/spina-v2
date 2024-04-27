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
import { TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes, Stories } from "../../../base/enums";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";
import AppInitSystem from "../../../systems/AppInitSystem";

const ObservingTopicStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <EntityCreator
          facets={[
            new TitleFacet({ title: "Sinus" }),
            new DescriptionFacet({ description: "Sinusfunktionen" }),
            new IdentifierFacet({ guid: "0" }),
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
        <StoriesInitSystem
          initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY}
        />
        <AppInitSystem mockupData />
        <ViewManagerSystem />

        <SchoolSubjectsInitSystem />
        <LoadTopicsSystem />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingTopicStory;
