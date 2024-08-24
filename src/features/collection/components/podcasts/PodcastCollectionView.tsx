import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import { DateAddedFacet, TitleFacet } from '../../../../app/additionalFacets';
import { DataType, Story } from '../../../../base/enums';
import {
  BackButton,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../../utils/displayText';
import { dataTypeQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
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
