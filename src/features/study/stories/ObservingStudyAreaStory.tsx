import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node';
import React from 'react';
import { Story } from '../../../base/enums';
import Study from '../../../pages/Study';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';

const ObservingStudyAreaStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <InitializeStoriesSystem initialStory={Story.OBSERVING_COLLECTION_STORY} />
        <InitializeSchoolSubjectsSystem />

        <InitializeAppSystem mockupData />
        <Study />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingStudyAreaStory;
