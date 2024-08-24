import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { DescriptionFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, Story } from '../../../../base/enums';
import {
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayButtonTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import TopicCell from '../../../collection/components/topics/TopicCell';
import { useSelectedLearningGroup } from '../../hooks/useSelectedLearningGroup';
import LoadGroupTopicsSystem from '../../systems/LoadGroupTopicsSystem';
import GroupTopicView from '../topics/GroupTopicView';
import AddGroupTopicSheet from './AddGroupTopicSheet';

const GroupSchoolSubjectView = (props: TitleProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedLearningGroupTitle } = useSelectedLearningGroup();
  const [groupTopics] = useEntities((e) => dataTypeQuery(e, DataType.GROUP_TOPIC) && isChildOfQuery(e, entity));

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);
  const openAddGroupTopicSheet = () => lsc.stories.transitTo(Story.ADDING_GROUP_TOPIC_STORY);

  return (
    <Fragment>
      <LoadGroupTopicsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton onClick={openAddGroupTopicSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {selectedLearningGroupTitle || displayButtonTexts(selectedLanguage).back}
        </BackButton>
        <Title>{title}</Title>
        <Spacer />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.GROUP_TOPIC) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet, DescriptionFacet], []]}
            onMatch={TopicCell}
          />
        </CollectionGrid>

        {groupTopics.length < 1 && <NoContentAddedHint />}
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.GROUP_TOPIC) && isChildOfQuery(e, entity) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DescriptionFacet], []]}
        onMatch={GroupTopicView}
      />

      <AddGroupTopicSheet />
    </Fragment>
  );
};

export default GroupSchoolSubjectView;
