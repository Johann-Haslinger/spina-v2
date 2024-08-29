import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { DescriptionFacet, ImageFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd, IoArchiveOutline } from 'react-icons/io5';
import { TitleFacet, TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../base/enums';
import { BackButton, CollectionGrid, NavBarButton, NavigationBar, Spacer, Title, View } from '../../../../components';
import NoContentAddedHint from '../../../../components/content/NoContentAddedHint';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../../utils/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import { useSchoolSubjectTopicEntities } from '../../hooks/useSchoolSubjectTopicEntities';
import LoadTopicsSystem from '../../systems/LoadTopicsSystem';
import TopicCell from '../topics/TopicCell';
import TopicView from '../topics/TopicView';
import AddTopicSheet from './AddTopicSheet';
import TopicArchive from './TopicArchive';

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { hasTopics } = useSchoolSubjectTopicEntities(props.entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openAddTopicSheet = () => lsc.stories.transitTo(Story.ADDING_TOPIC_STORY);
  const openTopicArchive = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_ARCHIVE_STORY);

  return (
    <div>
      <LoadTopicsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton onClick={openTopicArchive}>
            <IoArchiveOutline />
          </NavBarButton>
          <NavBarButton onClick={openAddTopicSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).collection}</BackButton>
        <Title>{title}</Title>
        <Spacer size={6} />
        {!hasTopics && <NoContentAddedHint />}

        <CollectionGrid gapSize="large" columnSize="large">
          <EntityPropsMapper
            query={(e) =>
              dataTypeQuery(e, DataType.TOPIC) && isChildOfQuery(e, entity) && !e.hasTag(AdditionalTag.ARCHIVED)
            }
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet, DescriptionFacet, ImageFacet], []]}
            onMatch={TopicCell}
          />
        </CollectionGrid>
        <Spacer size={20} />
      </View>

      <TopicArchive />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.TOPIC) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet, DescriptionFacet, ImageFacet], []]}
        onMatch={TopicView}
      />

      <AddTopicSheet />
    </div>
  );
};

export default SchoolSubjectView;
