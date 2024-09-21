import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { ColorFacet, DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitleFacet } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataType, Story } from '../../../base/enums';
import { Sidebar } from '../../../components';
import { Groups } from '../../../pages/Index';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { Settings } from '../../settings';
import { LocalDataMode } from '@leanscope/api-client';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../../environment';

const ObservingLerningGroupTopicStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
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
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Lern Gruppe' }),
              new ColorFacet({ colorName: COLOR_ITEMS[5].color }),
              new IdentifierFacet({ guid: '0' }),
              new DescriptionFacet({
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              }),
            ]}
            tags={[Tags.SELECTED, DataType.LEARNING_GROUP]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Latein' }),
              new IdentifierFacet({ guid: '01' }),

              new ParentFacet({ parentId: '0' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[Tags.SELECTED, DataType.GROUP_SCHOOL_SUBJECT]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Thema' }),
              new IdentifierFacet({ guid: '011' }),
              new DescriptionFacet({
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              }),
              new ParentFacet({ parentId: '01' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[Tags.SELECTED, DataType.GROUP_TOPIC]}
          />

          <ViewManagerSystem />
          <InitializeStoriesSystem initialStory={Story.OBSERVING_LERNING_GROUP_STORY} />
          <InitializeSchoolSubjectsSystem />
          <InitializeAppSystem mockupData />

          <Groups />

          <Sidebar />
          <Settings />
        </LeanScopeClientApp>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default ObservingLerningGroupTopicStory;
