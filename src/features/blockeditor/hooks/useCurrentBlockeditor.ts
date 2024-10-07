import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { BlockeditorStateFacet } from '../../../base/additionalFacets';
import { AdditionalTag } from '../../../base/enums';

export const useCurrentBlockeditor = () => {
  const [currentBlockeditorEntity] = useEntities((e) => e.has(BlockeditorStateFacet))[0];

  const blockeditorId = currentBlockeditorEntity?.get(IdentifierFacet)?.props.guid || '';
  const blockeditorState = currentBlockeditorEntity?.get(BlockeditorStateFacet)?.props.blockeditorState || 'edit';
  const isGroupBlockeditor = currentBlockeditorEntity?.has(AdditionalTag.GROUP_BLOCK_EDITOR) || false;

  return {
    blockeditorState,
    blockeditorEntity: currentBlockeditorEntity,
    blockeditorId,
    isGroupBlockeditor,
  };
};
