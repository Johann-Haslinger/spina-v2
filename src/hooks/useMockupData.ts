import { useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../base/enums";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";

export const useMockupData = () => {
  const [appStateEntity] = useEntity((e) =>
    e.has(AdditionalTags.APP_STATE_ENTITY)
  );
  const [useMockupData] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.MOCKUP_DATA
  );


  return { mockupData: useMockupData };
};
