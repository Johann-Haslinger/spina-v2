import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { Story } from '../../../common/types/enums';
import { Sidebar } from '../../../components';
import TabBar from '../../../components/navigation/TabBar';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Collection from '../../../pages/Collection';
import { SettingsOverviewSheet as Settings } from '../../settings';

const ObservingCollectionStory = () => {
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
          <InitializeStoriesSystem initialStory={Story.OBSERVING_COLLECTION_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeSchoolSubjectsSystem />
          <Collection />
          <Sidebar />
          <Settings />
          <TabBar />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingCollectionStory;
