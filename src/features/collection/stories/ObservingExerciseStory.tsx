import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnswerFacet, QuestionFacet, TitleFacet } from '../../../base/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { Sidebar } from '../../../components';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Collection from '../../../pages/Collection';
import { SettingsOverviewSheet as Settings } from '../../settings';
import LoadTopicsSystem from '../systems/LoadTopicsSystem';

const ObservingExerciseStory = () => {
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
          <EntityCreator
            facets={[
              new AnswerFacet({ answer: 'Sinus Exercise' }),
              new QuestionFacet({
                question: 'Erkäre den Unterschied zwischen Exogenen und Endogenen Kräften',
              }),
              new IdentifierFacet({ guid: '1000' }),
              new OrderFacet({ orderIndex: 0 }),
              new ParentFacet({ parentId: '100' }),
            ]}
            tags={[DataType.EXERCISE_PART]}
          />
          <EntityCreator
            facets={[
              new AnswerFacet({ answer: 'Sinus Exercise' }),
              new QuestionFacet({
                question: 'Nenne Beispiele für endogene und exogene Kräfte',
              }),
              new IdentifierFacet({ guid: '1001' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '100' }),
            ]}
            tags={[DataType.EXERCISE_PART]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus Exercise' }),
              new IdentifierFacet({ guid: '100' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '10' }),
            ]}
            tags={[DataType.EXERCISE, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus' }),
              new DescriptionFacet({ description: 'Sinusfunktionen' }),
              new IdentifierFacet({ guid: '10' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '1' }),
            ]}
            tags={[DataType.TOPIC, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Mathematik' }),
              new IdentifierFacet({ guid: '1' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[DataType.SCHOOL_SUBJECT, Tags.SELECTED]}
          />
          <InitializeStoriesSystem initialStory={Story.OBSERVING_SCHOOL_SUBJECT_STORY} />
          <InitializeAppSystem mockupData />
          <ViewManagerSystem />

          <InitializeSchoolSubjectsSystem />
          <LoadTopicsSystem />

          <Collection />
          <Sidebar />
          <Settings />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingExerciseStory;
