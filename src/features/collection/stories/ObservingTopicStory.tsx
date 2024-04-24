import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, OrderFacet, Tags } from "@leanscope/ecs-models";
import React from "react";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { DataTypes, StoryGuid } from "../../../base/enums";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";
import StoriesInitSystem from "../../../systems/StoriesInitSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";

const ObservingTopicStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <EntityCreator
          facets={[
            new TitleFacet({ title: "Mathematik" }),
            new IdentifierFacet({ guid: "0" }),
            new OrderFacet({ orderIndex: 1 }),
          ]}
          tags={[DataTypes.SCHOOL_SUBJECT, Tags.SELECTED]}
        />

        <ViewManagerSystem />
        <StoriesInitSystem
          initialStory={StoryGuid.OBSERVING_SCHOOL_SUBJECT_STORY}
        />
        <SchoolSubjectsInitSystem mokUpData />
        <LoadTopicsSystem mokUpData />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingTopicStory;
