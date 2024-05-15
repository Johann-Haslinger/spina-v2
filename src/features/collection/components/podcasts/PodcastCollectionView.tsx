import {
  BackButton,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { DataTypes, Stories } from "../../../../base/enums";
import { Fragment, useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/displayText";
import { EntityPropsMapper, useEntities } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../../utils/queries";
import { DateAddedFacet, TitleFacet } from "../../../../app/a";
import PodcastRow from "./PodcastRow";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import { IoAdd } from "react-icons/io5";
import LoadPodcastsSystem from "../../systems/LoadPodcastsSystem";
import DeletePodcastAlert from "./DeletePodcastAlert";
import { useIsStoryCurrent } from "@leanscope/storyboarding";

const PodcastCollectionView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_PODCASTS_COLLECTION);
  const { selectedLanguage } = useSelectedLanguage();
  const [podcastEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.PODCAST));

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_COLLECTION_STORY);

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
          query={(e) => dataTypeQuery(e, DataTypes.PODCAST)}
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
