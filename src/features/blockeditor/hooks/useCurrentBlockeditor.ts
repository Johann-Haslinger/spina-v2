import { useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { BlockeditorStateFacet } from '../../../app/additionalFacets';
import { AdditionalTags } from '../../../base/enums';

export const useCurrentBlockeditor = () => {
  const [currentBlockeditorEntity] = useEntities((e) => e.has(BlockeditorStateFacet))[0];

  const blockeditorId = currentBlockeditorEntity?.get(IdentifierFacet)?.props.guid || '';
  const blockeditorState = currentBlockeditorEntity?.get(BlockeditorStateFacet)?.props.blockeditorState || 'edit';
  const isGroupBlockeditor = currentBlockeditorEntity?.has(AdditionalTags.GROUP_BLOCKEDITOR) || false;

  return {
    blockeditorState,
    blockeditorEntity: currentBlockeditorEntity,
    blockeditorId,
    isGroupBlockeditor,
  };
};
