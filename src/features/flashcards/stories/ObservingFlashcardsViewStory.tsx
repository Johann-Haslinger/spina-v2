import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Stories } from '../../../base/enums';
import { Sidebar } from '../../../components';
import TabBar from '../../../components/navigation/TabBar';
import Flashcards from '../../../pages/Flashcards';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';

const ObservingFlashcardsViewStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <ViewManagerSystem />
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
          <InitializeSchoolSubjectsSystem />
          <InitializeAppSystem mockupData />

          <Flashcards />

          <Sidebar />
          <TabBar />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingFlashcardsViewStory;
