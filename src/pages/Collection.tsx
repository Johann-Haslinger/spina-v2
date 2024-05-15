import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes } from "../base/enums";
import { PodcastCollectionView, SchoolSubjectCell, SchoolSubjectView, PodcastCollectionCard, BookmarkCollectionCard, BookmarkCollectionView } from "../features/collection";
import { TitleFacet } from "../app/a";
import { OrderFacet, Tags } from "@leanscope/ecs-models";
import { CollectionGrid, NavigationBar, Spacer, Title, View } from "../components";
import { displayHeaderTexts } from "../utils/displayText";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { Fragment } from "react/jsx-runtime";

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
    </Fragment>
  );
};

export default Collection;
