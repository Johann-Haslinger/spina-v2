import { LocalDataMode } from '@leanscope/api-client';
import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/browser';
import { EntityCreator, EntityPropsMapper } from '@leanscope/ecs-engine';
import { customFacetBuildersMap } from '@leanscope/ecs-generation';
import { DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DateAddedFacet, SourceFacet, TitleFacet } from '../../../app/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import { Sidebar } from '../../../components';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../../environment';
import Collection from '../../../pages/Collection';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { dataTypeQuery } from '../../../utils/queries';
import { SettingsOverview as Settings } from '../../settings';
import PodcastSheet from '../components/podcasts/PodcastSheet';
import LoadTopicsSystem from '../systems/LoadTopicsSystem';

const ObservingSubtopicStory = () => {
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
              new TitleFacet({ title: 'Sinus Exercise Podcast' }),
              new DateAddedFacet({ dateAdded: new Date().toISOString() }),
              new IdentifierFacet({ guid: '101' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '100' }),
            ]}
            tags={[DataType.PODCAST]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus Exercise' }),
              new IdentifierFacet({ guid: '100' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '10' }),
            ]}
            tags={[DataType.SUBTOPIC, Tags.SELECTED]}
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

          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.PODCAST) && e.has(Tags.SELECTED)}
            get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
            onMatch={PodcastSheet}
          />
        </BrowserRouter>
      </LeanScopeClientApp>
    </React.StrictMode>
  );
};

export default ObservingSubtopicStory;
