import { ILeanScopeClient } from "@leanscope/api-client/interfaces";
import { Entity } from "@leanscope/ecs-engine";

export const addBlock = (lsc: ILeanScopeClient, newBlockEntity: Entity) => {
  console.log("Adding block to LeanScope", newBlockEntity);
  lsc.engine.addEntity(newBlockEntity);

  // TODO: Add the new block to supabase
};
