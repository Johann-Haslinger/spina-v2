import { Entity } from '@leanscope/ecs-engine';
import { BlockeditorStateFacet } from '../../../common/types/additionalFacets';
import { BlockeditorState } from '../../../common/types/types';

export const changeBlockeditorState = (blockeditorEntity?: Entity, newBlockeditorState?: BlockeditorState) => {
  if (blockeditorEntity && newBlockeditorState) {
    blockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: newBlockeditorState }));
  }
};
