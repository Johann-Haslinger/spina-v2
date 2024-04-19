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
  const [isLightMode] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.LIGHT_MODE
  );
  const [isDarkMode] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.DARK_MODE
  );

  const toggleViewMode = () => {
    if (isLightMode) {
      appStateEntity?.remove(AdditionalTags.LIGHT_MODE);
      appStateEntity?.add(AdditionalTags.DARK_MODE);
    } else {
      appStateEntity?.remove(AdditionalTags.DARK_MODE);
      appStateEntity?.add(AdditionalTags.LIGHT_MODE);
    }
  };

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      appStateEntity?.remove(AdditionalTags.SIDEBAR_IS_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.SIDEBAR_IS_VISIBLE);
      console.log(appStateEntity);
    }
  };

  return {
    isSidebarVisible,
    toggleSidebar,
    appStateEntity,
    isLightMode,
    isDarkMode,
    toggleViewMode,
  };
};
