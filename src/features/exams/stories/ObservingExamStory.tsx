import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { DueDateFacet, TitleFacet } from '../../../base/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Exams from '../../../pages/Exams';

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
