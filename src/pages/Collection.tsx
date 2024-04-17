import React from "react";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes } from "../base/enums";
import { SchoolSubjectCell, SchoolSubjectView } from "../features/collection";
import { TitleFacet } from "../app/AdditionalFacets";
import { OrderFacet, Tags } from "@leanscope/ecs-models";
import {
  CollectionLayout,
  Divider,
  NavigationBar,
  Title,
  View,
} from "../components";
import useSelectedLanguage from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/selectDisplayText";

const Collection = () => {
  const selectedLanguage = useSelectedLanguage();

  return (
    <>
      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Title>
          {displayHeaderTexts(selectedLanguage).collectionHeaderText}
        </Title>
        <Divider/>
        <CollectionLayout>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)}
            get={[[TitleFacet, OrderFacet], []]}
            onMatch={SchoolSubjectCell}
          />
        </CollectionLayout>
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
