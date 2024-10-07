import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator } from '@leanscope/ecs-engine';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { ColorFacet, DescriptionFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitleFacet } from '../../../base/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataType, Story } from '../../../base/enums';
import InitializeAppSystem from '../../../common/systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../common/systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../common/systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../common/systems/ViewManagerSystem';
import { Sidebar } from '../../../components';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import { Groups } from '../../../pages/Index';
import { SettingsOverviewSheet as Settings } from '../../settings';

const ObservingLerningGroupStory = () => {
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

export default ObservingLerningGroupStory;
