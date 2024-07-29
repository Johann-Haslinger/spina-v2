import { Entity } from "@leanscope/ecs-engine";
import { DataTypes } from "../base/enums";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";

export const dataTypeQuery = (e: Entity, dataType: DataTypes): boolean =>
  e.hasTag(dataType);

export const isChildOfQuery = (e: Entity, parentEntity?: Entity): boolean =>
  e.get(ParentFacet)?.props.parentId ===
  parentEntity?.get(IdentifierFacet)?.props.guid;
