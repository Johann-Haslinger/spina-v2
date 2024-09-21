import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitleFacet } from '../../../app/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import Collection from '../../../pages/Collection';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import LoadTopicsSystem from '../systems/LoadTopicsSystem';
import { LocalDataMode } from '@leanscope/api-client';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingSchoolSubjectStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
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
              new TitleFacet({ title: 'Mathematik' }),
              new IdentifierFacet({ guid: '0' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[DataType.SCHOOL_SUBJECT, Tags.SELECTED]}
          />
          <InitializeStoriesSystem initialStory={Story.OBSERVING_SCHOOL_SUBJECT_STORY} />
          <ViewManagerSystem />
          <InitializeAppSystem mockupData />

          <InitializeSchoolSubjectsSystem />
          <LoadTopicsSystem />

          <Collection />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingSchoolSubjectStory;
