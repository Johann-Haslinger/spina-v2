import React from "react";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, StoryGuid } from "../base/enums";
import { SchoolSubjectCell, SchoolSubjectView } from "../features/collection";
import { TitleFacet } from "../app/AdditionalFacets";
import { OrderFacet, Tags } from "@leanscope/ecs-models";
import {
  CollectionGrid,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../components";
import { displayHeaderTexts } from "../utils/selectDisplayText";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";

const Collection = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <>
      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Title size="large">
          {displayHeaderTexts(selectedLanguage).collectionHeaderText}
        </Title>
        <Spacer />
        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)}
            get={[[TitleFacet, OrderFacet], []]}
            onMatch={SchoolSubjectCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT) && e.hasTag(Tags.SELECTED)
        }
        get={[[TitleFacet], []]}
        onMatch={SchoolSubjectView}
      />
      
    </>
  );
};

export default Collection;
