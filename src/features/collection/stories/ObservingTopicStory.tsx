import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { DescriptionFacet, IdentifierFacet, ImageFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { dummyTopicImage } from '../../../common/types/dummyTopicImage';
import { DataType, Story } from '../../../common/types/enums';
import { Sidebar } from '../../../components';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Collection from '../../../pages/Collection';
import { SettingsOverviewSheet as Settings } from '../../settings';
import LoadTopicsSystem from '../systems/LoadTopicsSystem';

const ObservingTopicStory = () => {
  return (
    <React.StrictMode>
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
        <BrowserRouter>
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus' }),
              new DescriptionFacet({
                description:
                  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
              }),
              new IdentifierFacet({ guid: '100' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '1' }),
              new ImageFacet({ imageSrc: dummyTopicImage }),
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

export default ObservingTopicStory;
