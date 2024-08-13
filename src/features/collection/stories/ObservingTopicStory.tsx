import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node';
import { EntityCreator } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TitleFacet } from '../../../app/additionalFacets';
import { DataTypes, Stories } from '../../../base/enums';
import { Sidebar } from '../../../components';
import Collection from '../../../pages/Collection';
import InitializeAppSystem from '../../../systems/InitializeAppSystem';
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem';
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem';
import ViewManagerSystem from '../../../systems/ViewManagerSystem';
import { Settings } from '../../settings';
import LoadTopicsSystem from '../systems/LoadTopicsSystem';
import { dummyTopicImage } from '../../../base/dummyTopicImage';

const ObservingTopicStory = () => {
  return (
    <React.StrictMode>
      <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
        <BrowserRouter>
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Sinus' }),
              new DescriptionFacet({ description: 'Sinusfunktionen' }),
              new IdentifierFacet({ guid: '100' }),
              new OrderFacet({ orderIndex: 1 }),
              new ParentFacet({ parentId: '1' }),
              new ImageFacet({ imageSrc: dummyTopicImage }),
            ]}
            tags={[DataTypes.TOPIC, Tags.SELECTED]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: 'Mathematik' }),
              new IdentifierFacet({ guid: '1' }),
              new OrderFacet({ orderIndex: 1 }),
            ]}
            tags={[DataTypes.SCHOOL_SUBJECT, Tags.SELECTED]}
          />
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_SCHOOL_SUBJECT_STORY} />
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
