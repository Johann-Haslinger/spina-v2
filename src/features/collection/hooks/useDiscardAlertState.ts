import { useState } from 'react';
import { AdditionalTag } from '../../../common/types/enums';
import { useAppState } from './useAppState';

export const useDiscardAlertState = () => {
  const [isDiscardAlertVisible, setIsDiscardAlertVisible] = useState(false);
  const { appStateEntity } = useAppState();

  const openDiscardAlert = () => {
    appStateEntity?.addTag(AdditionalTag.MULTIPLE_SCREEN_OVERLAYS);
    setIsDiscardAlertVisible(true);
  };
  const closeDiscardAlert = () => {
    appStateEntity?.removeTag(AdditionalTag.MULTIPLE_SCREEN_OVERLAYS);
    setIsDiscardAlertVisible(false);
  };

  return { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert };
};
