import { useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags } from "../../../base/enums";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { useEffect } from "react";

export const useAppState = () => {
  const [appStateEntity] = useEntity((e) =>
    e.has(AdditionalTags.APP_STATE_ENTITY)
  );
  const [isSidebarVisible] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.SIDEBAR_IS_VISIBLE
  );

  useEffect(() => {
    console.log(isSidebarVisible);
  }, [isSidebarVisible]);

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      appStateEntity?.remove(AdditionalTags.SIDEBAR_IS_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.SIDEBAR_IS_VISIBLE);
      console.log(appStateEntity);
    }
  };

  return { isSidebarVisible, toggleSidebar, appStateEntity };
};
