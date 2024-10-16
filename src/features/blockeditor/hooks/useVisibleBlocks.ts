import { ParentFacet } from '@leanscope/ecs-models';

import { useEntities } from '@leanscope/ecs-engine';
import { DataType } from '../../../common/types/enums';
import { getStringFromBlockEntities } from '../functions/getStringFromBlockEntities';
import { useCurrentBlockeditor } from './useCurrentBlockeditor';

export const useVisibleBlocks = () => {
  const [blockEntities] = useEntities((e) => e.has(DataType.BLOCK));
  const { blockeditorId } = useCurrentBlockeditor();

  const visibleBlockEntities = blockEntities.filter(
    (blockEntity) => blockEntity.get(ParentFacet)?.props.parentId === blockeditorId,
  );
  const visibleText = getStringFromBlockEntities(visibleBlockEntities);

  return { visibleBlockEntities, visibleText };
};
