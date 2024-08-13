import { LeanScopeClientApp, LeanScopeClient } from '@leanscope/api-client/node';
import React from 'react';
import Collection from '../../../pages/Collection';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { Stories } from '../../../base/enums';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import { Sidebar } from '../../../components';
import { BrowserRouter } from 'react-router-dom';
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
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingCollectionStory;
