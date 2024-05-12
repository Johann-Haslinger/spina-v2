import { Entity, useEntities } from "@leanscope/ecs-engine";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";

export const useBlockEntities = (blockeditorEntity?: Entity) => {
    const blockeditorId = blockeditorEntity?.get(IdentifierFacet)?.props.guid;
    const [blockEntities] = useEntities((e) => e.has(DataTypes.BLOCK)&& e.get(ParentFacet)?.props.parentId == blockeditorId);

    return {blockEntities};
}