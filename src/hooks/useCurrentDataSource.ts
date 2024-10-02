import { useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { AdditionalTag } from '../base/enums';
import { useSession } from './useSession';

export const useCurrentDataSource = () => {
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTag.APP_STATE_ENTITY));
  const [isUsingMockupData] = useEntityHasTags(appStateEntity, AdditionalTag.MOCKUP_DATA);
  const [isUsingSupabaseData] = useEntityHasTags(appStateEntity, AdditionalTag.ONLINE);
  const { isLoggedIn } = useSession();

  return { isUsingMockupData, isUsingSupabaseData: isLoggedIn && isUsingSupabaseData };
};
