import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { AdditionalTag } from '../../base/enums';

const InitializeLoadingIndicatorSystem = () => {
  const lsc = useContext(LeanScopeClientContext);

  useEffect(() => {
    const isAlreadyExisting = lsc.engine.entities.some((e) => e.hasTag(AdditionalTag.LOADING_INDICATOR));
    if (isAlreadyExisting) return;

    const loadingIndicatorEntity = new Entity();
    lsc.engine.addEntity(loadingIndicatorEntity);
    loadingIndicatorEntity.add(new IdentifierFacet({ guid: 'loading-indicator' }));
    loadingIndicatorEntity.addTag(Tags.CURRENT);
    loadingIndicatorEntity.addTag(AdditionalTag.LOADING_INDICATOR);
  }, []);

  return null;
};

export default InitializeLoadingIndicatorSystem;
