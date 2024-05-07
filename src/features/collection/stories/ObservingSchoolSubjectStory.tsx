import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React from "react";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { EntityCreator } from "@leanscope/ecs-engine";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";
import { DataTypes, Stories } from "../../../base/enums";
import { IdentifierFacet, OrderFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";
import Collection from "../../../pages/Collection";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";

const ObservingSchoolSubjectStory = () => {
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
        <InitializeStoriesSystem
          initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY}
        />
        <ViewManagerSystem />
        <InitializeAppSystem mockupData />

        <InitializeSchoolSubjectsSystem />
        <LoadTopicsSystem />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingSchoolSubjectStory;
