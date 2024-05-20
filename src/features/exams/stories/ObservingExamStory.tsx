import { LeanScopeClient, LeanScopeClientApp } from "@leanscope/api-client/node";
import { EntityCreator } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import React from "react";
import { DueDateFacet, TitleFacet } from "../../../app/additionalFacets";
import { DataTypes, Stories } from "../../../base/enums";
import Exams from "../../../pages/Exams";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";

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
          tags={[DataTypes.EXAM, Tags.SELECTED]}
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
