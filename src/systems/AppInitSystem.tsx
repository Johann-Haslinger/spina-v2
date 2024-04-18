import React, { useContext, useEffect } from "react";
import { EntityCreator } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const AppInitSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const appStateEntity = lsc.engine.entities.find((e) =>
      e.has(AdditionalTags.APP_STATE_ENTITY)
    );
    if (!appStateEntity) {
      lsc.entities.create({
        guid: "appState",
        tags: [AdditionalTags.APP_STATE_ENTITY],
      });
    }
  }, []);

  return <></>
};

export default AppInitSystem;
