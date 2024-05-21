import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { OrderFacet, Tags } from "@leanscope/ecs-models";
import { Fragment } from "react/jsx-runtime";
import { TitleFacet } from "../app/additionalFacets";
import { DataTypes } from "../base/enums";
import { CollectionGrid, NavigationBar, Spacer, Title, View } from "../components";
import {
  BookmarkCollectionCard,
  BookmarkCollectionView,
  PodcastCollectionCard,
  PodcastCollectionView,
  SchoolSubjectCell,
  SchoolSubjectView,
} from "../features/collection";
import { SapientorIcon } from "../features/collection/components/sapientor";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import { dataTypeQuery } from "../utils/queries";

const Collection = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Fragment>
      <View viewType="baseView">
        <NavigationBar />
        <Title size="large">{displayHeaderTexts(selectedLanguage).collection}</Title>
        <Spacer />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)}
            get={[[TitleFacet, OrderFacet], []]}
            onMatch={SchoolSubjectCell}
          />
          <PodcastCollectionCard />
          <BookmarkCollectionCard />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet], []]}
        onMatch={SchoolSubjectView}
      />

      <PodcastCollectionView />
      <BookmarkCollectionView />
      <SapientorIcon />

      {/* <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.TOPIC) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet, DescriptionFacet], []]}
        onMatch={TopicView}
      /> */}


    </Fragment>
  );
};

export default Collection;
