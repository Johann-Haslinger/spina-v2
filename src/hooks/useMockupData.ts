import { useEntity } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { AdditionalTags } from "../base/enums";

export const useMockupData = () => {
  const [appStateEntity] = useEntity((e) =>
    e.has(AdditionalTags.APP_STATE_ENTITY),
  );
  const [isUsingMockupData] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.MOCKUP_DATA,
  );
  const [isUsingSupabaseData] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.ONLINE,
  );

  return { isUsingMockupData, isUsingSupabaseData };
};
