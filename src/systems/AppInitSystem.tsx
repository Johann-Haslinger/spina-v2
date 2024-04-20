import React, { useContext, useEffect } from "react";
import { Entity, EntityCreator, useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags, SupportedLanguages } from "../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { SelectedLanguageFacet as SelectedLanguageFacet } from "../app/AdditionalFacets";

const AppInitSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  useEffect(() => {
    const appStateEntity = lsc.engine.entities?.filter((e) => e.hasTag(AdditionalTags.APP_STATE_ENTITY))[0];

    if (!appStateEntity) {
  
      const appStateEntity = new Entity();
      lsc.engine.addEntity(appStateEntity);
      appStateEntity.add(
        new SelectedLanguageFacet({ selectedLanguage: SupportedLanguages.EN })
      );
      appStateEntity.add(AdditionalTags.APP_STATE_ENTITY);
      appStateEntity.add(AdditionalTags.LIGHT_THEME);
    }
  }, []);

  return <></>;
};

export default AppInitSystem;
