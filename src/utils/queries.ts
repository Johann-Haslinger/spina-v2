import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DataType } from '../base/enums';

export const dataTypeQuery = (e: Entity, dataType: DataType): boolean => e.hasTag(dataType);

export const isChildOfQuery = (e: Entity, parentEntity?: Entity): boolean =>
  e.get(ParentFacet)?.props.parentId === parentEntity?.get(IdentifierFacet)?.props.guid;
