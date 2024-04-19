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
    AdditionalTags.SIDEBAR_VISIBLE
  );
  const [isSettingVisible] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.SETTING_VISIBLE
  );

  const toggleSettings = () => {
    if (isSettingVisible) {
      appStateEntity?.remove(AdditionalTags.SETTING_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.SETTING_VISIBLE);
    }
  }

 

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      appStateEntity?.remove(AdditionalTags.SIDEBAR_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.SIDEBAR_VISIBLE);
      console.log(appStateEntity);
    }
  };

  return {
    isSidebarVisible,
    toggleSidebar,
    appStateEntity,
    toggleSettings,
    isSettingVisible
  };
};
