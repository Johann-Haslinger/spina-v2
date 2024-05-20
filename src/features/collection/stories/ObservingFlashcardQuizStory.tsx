import { LeanScopeClient, LeanScopeClientApp } from "@leanscope/api-client/node";
import { EntityCreator } from "@leanscope/ecs-engine";
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import React from "react";
import { TitleFacet } from "../../../app/additionalFacets";
import { DataTypes, Stories } from "../../../base/enums";
import Collection from "../../../pages/Collection";
import InitializeAppSystem from "../../../systems/InitializeAppSystem";
import InitializeSchoolSubjectsSystem from "../../../systems/InitializeSchoolSubjectsSystem";
import InitializeStoriesSystem from "../../../systems/InitializeStoriesSystem";
import ViewManagerSystem from "../../../systems/ViewManagerSystem";
import LoadTopicsSystem from "../systems/LoadTopicsSystem";

const ObservingFlashcardQuizStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <InitializeStoriesSystem initialStory={Stories.OBSERVING_FLASHCARD_QUIZ_STORY} />

        <EntityCreator
          facets={[
            new TitleFacet({ title: "Sinus Exercise" }),
            new IdentifierFacet({ guid: "100" }),
            new OrderFacet({ orderIndex: 1 }),
            new ParentFacet({ parentId: "10" }),
          ]}
          tags={[DataTypes.FLASHCARD_SET, Tags.SELECTED]}
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

        <InitializeAppSystem mockupData />
        <ViewManagerSystem />

        <InitializeSchoolSubjectsSystem />
        <LoadTopicsSystem />

        <Collection />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingFlashcardQuizStory;
