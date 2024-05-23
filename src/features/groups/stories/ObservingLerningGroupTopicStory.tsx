import { LeanScopeClient, LeanScopeClientApp } from '@leanscope/api-client/node'
import React from 'react'
import { DataTypes, Stories } from '../../../base/enums'
import { Groups } from '../../../pages/Index'
import InitializeAppSystem from '../../../systems/InitializeAppSystem'
import InitializeSchoolSubjectsSystem from '../../../systems/InitializeSchoolSubjectsSystem'
import InitializeStoriesSystem from '../../../systems/InitializeStoriesSystem'
import ViewManagerSystem from '../../../systems/ViewManagerSystem'
import { Sidebar } from '../../../components'
import { Settings } from '../../settings'
import { BrowserRouter } from 'react-router-dom'
import { EntityCreator } from '@leanscope/ecs-engine'
import { TitleFacet } from '../../../app/additionalFacets'
import { ColorFacet, DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet, Tags } from '@leanscope/ecs-models'
import { COLOR_ITEMS } from '../../../base/constants'

const ObservingLerningGroupTopicStory = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <LeanScopeClientApp leanScopeClient={new LeanScopeClient()}>
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Lern Gruppe" }),
              new ColorFacet({ colorName: COLOR_ITEMS[5].color }),
              new IdentifierFacet({ guid: "0" }),
              new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." })
            ]}
            tags={[
              Tags.SELECTED,
              DataTypes.LEARNING_GROUP
            ]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Latein" }),
              new IdentifierFacet({ guid: "01" }),

              new ParentFacet({ parentId: "0" }),
              new OrderFacet({ orderIndex: 1 })
            ]}
            tags={[
              Tags.SELECTED,
              DataTypes.GROUP_SCHOOL_SUBJECT
            ]}
          />
          <EntityCreator
            facets={[
              new TitleFacet({ title: "Thema" }),
              new IdentifierFacet({ guid: "011" }),
              new DescriptionFacet({ description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }),
              new ParentFacet({ parentId: "01" }),
              new OrderFacet({ orderIndex: 1 })
            ]}
            tags={[
              Tags.SELECTED,
              DataTypes.GROUP_TOPIC
            ]}
          />

          <ViewManagerSystem />
          <InitializeStoriesSystem initialStory={Stories.OBSERVING_LERNING_GROUP_STORY} />
          <InitializeSchoolSubjectsSystem />
          <InitializeAppSystem mockupData />

          <Groups />

          <Sidebar />
          <Settings />

        </LeanScopeClientApp></BrowserRouter>
    </React.StrictMode>
  )
}

export default ObservingLerningGroupTopicStory