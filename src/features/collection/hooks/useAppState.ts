import { useEntity } from "@leanscope/ecs-engine";
import { AdditionalTags, Stories } from "../../../base/enums";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

export const useAppState = () => {
  const lsc = useContext(LeanScopeClientContext)
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
  const [isProfileVisible] = useEntityHasTags(
    appStateEntity,
    AdditionalTags.PROFILE_VISIBLE
  );

  const toggleSettings = () => {
    if (isSettingVisible) {
      appStateEntity?.remove(AdditionalTags.SETTING_VISIBLE);
      lsc.stories.transitTo(Stories.OBSERVING_COLLECTION_STORY)
    } else {
      lsc.stories.transitTo(Stories.OBSERVING_SETTINGS_STORY)
      appStateEntity?.add(AdditionalTags.SETTING_VISIBLE);
    }
  }

  const toggleProfile = () => {
    if (isProfileVisible) {
      appStateEntity?.remove(AdditionalTags.PROFILE_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.PROFILE_VISIBLE);
    }
  }



 

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      appStateEntity?.remove(AdditionalTags.SIDEBAR_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTags.SIDEBAR_VISIBLE);
    }
  };

  return {
    isSidebarVisible,
    toggleSidebar,
    appStateEntity,
    toggleSettings,
    isSettingVisible,
    toggleProfile,
    isProfileVisible
  };
};
