import { useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { AdditionalTag } from '../base/enums';

export const useCurrentDataSource = () => {
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTag.APP_STATE_ENTITY));
  const [isUsingMockupData] = useEntityHasTags(appStateEntity, AdditionalTag.MOCKUP_DATA);
  const [isUsingSupabaseData] = useEntityHasTags(appStateEntity, AdditionalTag.ONLINE);

  return { isUsingMockupData, isUsingSupabaseData };
};
