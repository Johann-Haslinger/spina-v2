import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import React from 'react';
import { Story } from '../../../base/enums';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';

import { BrowserRouter } from 'react-router-dom';
import { Sidebar, View } from '../../../components';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import { Settings } from '../../settings';
import Blockeditor from '../components/Blockeditor';
import InitializeBlockeditorSystem from '../systems/InitializeBlockeditorSystem';
import { LocalDataMode } from '@leanscope/api-client';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingBlockeditorStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp
        leanScopeClient={
          new LeanScopeClient({
            supabaseUrl: VITE_SUPABASE_URL,
            supabaseKey: VITE_SUPABASE_KEY,
            serverUrl: 'http://localhost:3000',
            localDataMode: 'ONLINE-READ-ONLY' as LocalDataMode,
          })
        }
      >
        <BrowserRouter>
          <InitializeStoriesSystem initialStory={Story.OBSERVING_FLASHCARD_QUIZ_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />
          <InitializeBlockeditorSystem blockeditorId="1" />
          <InitializeSchoolSubjectsSystem />

          <View viewType="baseView">
            <Blockeditor title="Blockeditor" id="1" />
          </View>
          <Sidebar />
          <Settings />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingBlockeditorStory;
