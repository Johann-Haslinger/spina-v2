import { Entity } from '@leanscope/ecs-engine';
import { BlockeditorStateFacet } from '../../../base/additionalFacets';
import { BlockeditorState } from '../../../base/types';

export const changeBlockeditorState = (blockeditorEntity?: Entity, newBlockeditorState?: BlockeditorState) => {
  if (blockeditorEntity && newBlockeditorState) {
    blockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: newBlockeditorState }));
  }
};
