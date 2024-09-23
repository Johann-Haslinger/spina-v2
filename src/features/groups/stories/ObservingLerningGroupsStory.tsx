import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Story } from '../../../base/enums';
import { Sidebar } from '../../../components';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import { Groups } from '../../../pages/Index';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { SettingsOverview as Settings } from '../../settings';

const ObservingLerningGroupsStory = () => {
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
          <ViewManagerSystem />
          <InitializeStoriesSystem initialStory={Story.OBSERVING_LERNING_GROUPS_STORY} />
          <InitializeSchoolSubjectsSystem />
          <InitializeAppSystem mockupData />

          <Groups />

          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingLerningGroupsStory;
