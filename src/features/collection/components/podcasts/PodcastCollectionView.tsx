import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { DateAddedFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { DataType, Story } from '../../../../common/types/enums';
import { displayHeaderTexts } from '../../../../common/utilities/displayText';
import { dataTypeQuery } from '../../../../common/utilities/queries';
import { sortEntitiesByDateAdded } from '../../../../common/utilities/sortEntitiesByTime';
import {
  BackButton,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from '../../../../components';
import LoadPodcastsSystem from '../../systems/LoadPodcastsSystem';
import DeletePodcastAlert from './DeletePodcastAlert';
import PodcastRow from './PodcastRow';

const PodcastCollectionView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_PODCASTS_COLLECTION);
  const { selectedLanguage } = useSelectedLanguage();
  const [podcastEntities] = useEntities((e) => dataTypeQuery(e, DataType.PODCAST));

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  return (
    <Fragment>
      <LoadPodcastsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).collection}</BackButton>
        <Title>{displayHeaderTexts(selectedLanguage).podcastCollection}</Title>
        <Spacer />
        {podcastEntities.length === 0 && <NoContentAddedHint />}

        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataType.PODCAST)}
          get={[[TitleFacet, DateAddedFacet], []]}
          sort={sortEntitiesByDateAdded}
          onMatch={PodcastRow}
        />
      </View>

      <DeletePodcastAlert />
    </Fragment>
  );
};

export default PodcastCollectionView;
