import {
  LeanScopeClientApp,
  LeanScopeClient,
} from "@leanscope/api-client/node";
import React, { useEffect } from "react";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import SchoolSubjectView from "../components/schoolSubjects/SchoolSubjectView";
import { Entity, EntityCreator } from "@leanscope/ecs-engine";
import LoadTopicEntitiesSystem from "../systems/LoadTopicEntitiesSystem";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, OrderFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";
import Collection from "../../../pages/Collection";
import SchoolSubjectsInitSystem from "../../../systems/SchoolSubjectsInitSystem";

const ObservingSchoolSubjectStory = () => {

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
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
        <SchoolSubjectsInitSystem mokUpData />
        <LoadTopicEntitiesSystem mokUpData />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingSchoolSubjectStory;
