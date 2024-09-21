import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Story } from '../../../base/enums';
import { Sidebar } from '../../../components';
import TabBar from '../../../components/navigation/TabBar';
import Overview from '../../../pages/Overview';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { Settings } from '../../settings';
import { LocalDataMode } from '@leanscope/api-client';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingOverviewStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp
          leanScopeClient={
            new LeanScopeClient({
              supabaseUrl: VITE_SUPABASE_URL,
              supabaseKey: VITE_SUPABASE_KEY,
              serverUrl: 'http://localhost:3000',
              localDataMode: 'ONLINE' as LocalDataMode,
            })
          }
        >
          <InitializeStoriesSystem initialStory={Story.OBSERVING_COLLECTION_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeSchoolSubjectsSystem />
          <Overview />
          <Sidebar />
          <Settings />
          <TabBar />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingOverviewStory;
