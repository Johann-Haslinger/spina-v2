import { Entity } from "@leanscope/ecs-engine";
import { BlockeditorStateFacet } from "../../../app/a";
import { BlockeditorState } from "../../../base/types";

export const changeBlockeditorState = (blockeditorEntity?: Entity, newBlockeditorState?: BlockeditorState) => {
  if (blockeditorEntity && newBlockeditorState) {
    blockeditorEntity.add(new BlockeditorStateFacet({ blockeditorState: newBlockeditorState }));
  }
};
