import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node';
import React from 'react';
import { Story } from '../../../base/enums';
import Exams from '../../../pages/Exams';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';

const ObservingExamsStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <ViewManagerSystem />
        <InitializeStoriesSystem initialStory={Story.OBSERVING_EXAMS_STORY} />
        <InitializeSchoolSubjectsSystem />
        <InitializeAppSystem mockupData />

        <Exams />
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingExamsStory;
