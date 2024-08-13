import { ParentFacet } from '@leanscope/ecs-models';

import { useCurrentBlockeditor } from './useCurrentBlockeditor';
import { getStringFromBlockEntities } from '../functions/getStringFromBlockEntities';
import { useEntities } from '@leanscope/ecs-engine';
import { DataTypes } from '../../../base/enums';

export const useVisibleBlocks = () => {
  const [blockEntities] = useEntities((e) => e.has(DataTypes.BLOCK));
  const { blockeditorId } = useCurrentBlockeditor();

  const visibleBlockEntities = blockEntities.filter(
    (blockEntity) => blockEntity.get(ParentFacet)?.props.parentId === blockeditorId,
  );
  const visibleText = getStringFromBlockEntities(visibleBlockEntities);

  return { visibleBlockEntities, visibleText };
};
