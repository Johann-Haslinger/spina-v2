import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DataType } from '../../../common/types/enums';

export const useBlockEntities = (blockeditorEntity?: Entity) => {
  const blockeditorId = blockeditorEntity?.get(IdentifierFacet)?.props.guid;
  const [blockEntities] = useEntities((e) => e.has(DataType.BLOCK));

  const filterdBlockEntities = blockEntities.filter((e) => e.get(ParentFacet)?.props.parentId === blockeditorId);

  return { blockEntities: filterdBlockEntities };
};
