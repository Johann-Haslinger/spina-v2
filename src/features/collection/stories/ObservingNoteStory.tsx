import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React, { useEffect } from "react";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { DataTypes, Stories } from "../../../base/enums";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import { EntityCreator } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";

const ObservingNoteStory = () => {

  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <EntityCreator
          facets={[
            new TitleFacet({ title: "Sinus Exercise" }),
            new IdentifierFacet({ guid: "100" }),
            new OrderFacet({ orderIndex: 1 }),
            new ParentFacet({ parentId: "10" }),
          ]}
          tags={[DataTypes.NOTE, Tags.SELECTED]}
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

        <ViewManagerSystem />
        <StoriesInitSystem
          initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY}
        />
        <SchoolSubjectsInitSystem mockupData />
        <LoadTopicsSystem mockupData />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingNoteStory;
