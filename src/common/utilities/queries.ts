import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { LearningUnitTypeFacet } from '../../base/additionalFacets';
import { DataType, LearningUnitType } from '../../base/enums';

export const dataTypeQuery = (e: Entity, dataType: DataType): boolean => e.hasTag(dataType);

export const isChildOfQuery = (e: Entity, parentEntity?: Entity): boolean =>
  e.get(ParentFacet)?.props.parentId === parentEntity?.get(IdentifierFacet)?.props.guid;

export const learningUnitTypeQuery = (e: Entity, type: LearningUnitType): boolean =>
  e.get(LearningUnitTypeFacet)?.props.type === type;
