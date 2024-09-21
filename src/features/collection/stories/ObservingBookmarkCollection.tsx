import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Story } from '../../../base/enums';
import { Sidebar } from '../../../components';
import Collection from '../../../pages/Collection';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { LocalDataMode } from '@leanscope/api-client';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingBookmarkCollection = () => {
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
                localDataMode: 'ONLINE' as LocalDataMode,
              },
              customFacetBuildersMap,
            )
          }
        >
          <InitializeStoriesSystem initialStory={Story.OBSERVING_BOOKMARKS_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeSchoolSubjectsSystem />
          <Collection />
          <Sidebar />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingBookmarkCollection;
