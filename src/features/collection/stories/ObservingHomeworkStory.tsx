import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { DueDateFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { DataType, Story } from '../../../common/types/enums';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Collection from '../../../pages/Collection';

const ObservingHomeworkStory = () => {
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
        <BrowserRouter>
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Mathematik' }),
              new IdentifierFacet({ guid: '1' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[DataType.SCHOOL_SUBJECT, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus Exercise' }),
              new IdentifierFacet({ guid: '100' }),
              new OrderFacet({ orderIndex: 1 }),
              new DueDateFacet({ dueDate: new Date().toISOString() }),
              new ParentFacet({ parentId: '10' }),
            ]}
            tags={[DataType.HOMEWORK, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus' }),
              new DescriptionFacet({ description: 'Sinusfunktionen' }),
              new IdentifierFacet({ guid: '10' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '1' }),
            ]}
            tags={[DataType.TOPIC, Tags.SELECTED]}
          />

          <InitializeStoriesSystem initialStory={Story.OBSERVING_SCHOOL_SUBJECT_STORY} />
          <InitializeAppSystem mockupData />

          <ViewManagerSystem />

          <InitializeSchoolSubjectsSystem />

          <Collection />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingHomeworkStory;
