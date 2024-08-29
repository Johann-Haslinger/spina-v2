import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { useContext } from 'react';
import { AdditionalTag, Story } from '../../../base/enums';

export const useAppState = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [appStateEntity] = useEntity((e) => e.has(AdditionalTag.APP_STATE_ENTITY));
  const [isSidebarVisible] = useEntityHasTags(appStateEntity, AdditionalTag.SIDEBAR_VISIBLE);
  const [isSettingVisible] = useEntityHasTags(appStateEntity, AdditionalTag.SETTING_VISIBLE);
  const [isProfileVisible] = useEntityHasTags(appStateEntity, AdditionalTag.PROFILE_VISIBLE);

  const toggleSettings = () => {
    if (isSettingVisible) {
      appStateEntity?.remove(AdditionalTag.SETTING_VISIBLE);
      lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);
    } else {
      lsc.stories.transitTo(Story.OBSERVING_SETTINGS_STORY);
      appStateEntity?.add(AdditionalTag.SETTING_VISIBLE);
    }
  };

  const toggleProfile = () => {
    if (isProfileVisible) {
      appStateEntity?.remove(AdditionalTag.PROFILE_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTag.PROFILE_VISIBLE);
    }
  };

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      appStateEntity?.remove(AdditionalTag.SIDEBAR_VISIBLE);
    } else {
      appStateEntity?.add(AdditionalTag.SIDEBAR_VISIBLE);
    }
  };

  return {
    isSidebarVisible,
    toggleSidebar,
    appStateEntity,
    toggleSettings,
    isSettingVisible,
    toggleProfile,
    isProfileVisible,
  };
};
