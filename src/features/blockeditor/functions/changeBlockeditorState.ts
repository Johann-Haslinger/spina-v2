import { Entity } from "@leanscope/ecs-engine";
import { BlockeditorStateFacet } from "../../../app/additionalFacets";

export const changeBlockeditorState = (blockeditorEntity?: Entity) => {
  return {
    view: blockeditorEntity?.add(new BlockeditorStateFacet({ blockeditorState: "view" })),
    create: blockeditorEntity?.add(new BlockeditorStateFacet({ blockeditorState: "create" })),
    edit: blockeditorEntity?.add(new BlockeditorStateFacet({ blockeditorState: "edit" })),
    delete: blockeditorEntity?.add(new BlockeditorStateFacet({ blockeditorState: "delete" })),
    write: blockeditorEntity?.add(new BlockeditorStateFacet({ blockeditorState: "write" })),
  };
};
