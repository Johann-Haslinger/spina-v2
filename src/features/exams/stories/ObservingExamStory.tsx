import { LeanScopeClientApp, LeanScopeClient } from "@leanscope/api-client/node";
import React from "react";
import { DataTypes, Stories } from "../../../base/enums";
import Exams from "../../../pages/Exams";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import { EntityCreator } from "@leanscope/ecs-engine";
import { DueDateFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";

const ObservingExamStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <EntityCreator
        facets={[
          new TitleFacet({ title: "Exam" }),
          new IdentifierFacet({ guid: "10" }),
          new DueDateFacet({ dueDate: new Date().toISOString() }),
      
        ]}
        tags={[
          DataTypes.EXAM,
          Tags.SELECTED
        ]}
         />
        <ViewManagerSystem />
        <InitializeStoriesSystem initialStory={Stories.OBSERVING_EXAMS_STORY} />
        <InitializeSchoolSubjectsSystem />
        <InitializeAppSystem mockupData />

        <Exams />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingExamStory;
