import { useEntities, useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery, isChildOfQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
  Tags,
} from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { useContext, useEffect } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

export const useSelectedTopic = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [selectedTopicEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.TOPIC) && e.hasTag(Tags.SELECTED)
  );
  const selectedTopicId = selectedTopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedTopicTitle = selectedTopicEntity?.get(TitleFacet)?.props.title;
  const selectedTopicDescription =
    selectedTopicEntity?.get(DescriptionFacet)?.props.description;
  

  
  return {
    selectedTopicEntity,
    selectedTopicTitle,
    selectedTopicId,
    selectedTopicDescription,
  
  };
};
