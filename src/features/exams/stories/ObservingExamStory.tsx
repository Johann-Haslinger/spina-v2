import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import Exams from '../../../pages/Exams';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { LocalDataMode } from '@leanscope/api-client';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingExamStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp
        leanScopeClient={
          new LeanScopeClient(
            {
              supabaseUrl: VITE_SUPABASE_URL,
              supabaseKey: VITE_SUPABASE_KEY,
              serverUrl: 'http://localhost:3000',
              localDataMode: 'ONLINE-READ-ONLY' as LocalDataMode,
            },
            customFacetBuildersMap,
          )
        }
      >
        <EntityCreator
          facets={[
            new TitleFacet({ title: 'Exam' }),
            new IdentifierFacet({ guid: '10' }),
            new DueDateFacet({ dueDate: new Date().toISOString() }),
          ]}
          tags={[DataType.EXAM, Tags.SELECTED]}
        />
        <ViewManagerSystem />
        <InitializeStoriesSystem initialStory={Story.OBSERVING_EXAMS_STORY} />
        <InitializeSchoolSubjectsSystem />
        <InitializeAppSystem mockupData />

        <Exams />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingExamStory;
