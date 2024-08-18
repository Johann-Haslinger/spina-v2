import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Stories } from '../../../base/enums';
import { Sidebar } from '../../../components';
import TabBar from '../../../components/navigation/TabBar';
import Collection from '../../../pages/Collection';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { Settings } from '../../settings';

const ObservingCollectionStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
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
