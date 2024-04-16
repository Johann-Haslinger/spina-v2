import React from "react";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes } from "../base/enums";
import { SchoolSubjectCell, SchoolSubjectView } from "../features/collection";
import { TitleFacet } from "../app/AdditionalFacets";
import { Tags } from "@leanscope/ecs-models";
import View from "../components/presentation/View";

const Collection = () => {
  return (
    <>
      <View viewType="baseView">
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)}
          get={[[TitleFacet], []]}
          onMatch={SchoolSubjectCell}
        />
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
