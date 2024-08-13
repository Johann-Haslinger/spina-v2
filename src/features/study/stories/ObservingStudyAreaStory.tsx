import { LeanScopeClientApp, LeanScopeClient } from '@leanscope/api-client/node';
import React from 'react';
import { Stories } from '../../../base/enums';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import Study from '../../../pages/Study';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';

const ObservingStudyAreaStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <InitializeStoriesSystem initialStory={Stories.OBSERVING_COLLECTION_STORY} />
        <InitializeSchoolSubjectsSystem />

        <InitializeAppSystem mockupData />
        <Study />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingStudyAreaStory;
