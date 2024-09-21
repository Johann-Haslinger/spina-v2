import { useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { useEffect, useState } from 'react';

export const useLoadingIndicator = () => {
  const [loadingIndicatorEntity] = useEntity((e) => e.get(IdentifierFacet)?.props.guid === 'loading-indicator');
  const [visible] = useEntityHasTags(loadingIndicatorEntity, Tags.CURRENT);
  const [isLoadingIndicatorVisible, setIsLoadingIndicatorVisible] = useState(true);

  useEffect(() => {
    if (loadingIndicatorEntity && (visible == false || visible == true)) {
      setIsLoadingIndicatorVisible(loadingIndicatorEntity.has(Tags.CURRENT) ? true : false);
    }
  }, [visible, loadingIndicatorEntity]);

  return {
    isLoadingIndicatorVisible,
    loadingIndicatorEntity,
  };
};
