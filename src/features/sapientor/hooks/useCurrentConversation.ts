import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntity, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { v4 } from 'uuid';
import { AdditionalTag, SupportedModel } from '../../../common/types/enums';

export const useCurrentSapientorConversation = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [currentConversationEntity] = useEntity((e) => e.hasTag(AdditionalTag.SAPIENTOR_CONVERSATION));
  const [isQuickChatVisible] = useEntityHasTags(currentConversationEntity, AdditionalTag.IS_QUICK_CHAT_VISIBLE);
  const [isChatSheetVisible] = useEntityHasTags(currentConversationEntity, AdditionalTag.CHAT_SHEET_VISIBLE);
  const [useSapientorAssistentModel] = useEntityHasTags(currentConversationEntity, SupportedModel.SAPIENTOR_ASSISTENT);

  const deleteCurrentConversation = () => {
    currentConversationEntity && lsc.engine.removeEntity(currentConversationEntity);
  };

  const setQuickChatVisible = (isVisible: boolean) => {
    if (isVisible) {
      if (!currentConversationEntity) {
        const newConversationEntity = new Entity();
        lsc.engine.addEntity(newConversationEntity);
        newConversationEntity.add(new IdentifierFacet({ guid: v4() }));
        newConversationEntity.add(AdditionalTag.SAPIENTOR_CONVERSATION);
        newConversationEntity?.add(AdditionalTag.IS_QUICK_CHAT_VISIBLE);
        newConversationEntity.add(SupportedModel.TURBO);
      } else {
        currentConversationEntity.add(AdditionalTag.IS_QUICK_CHAT_VISIBLE);
      }
    } else {
      currentConversationEntity?.remove(AdditionalTag.IS_QUICK_CHAT_VISIBLE);
    }
  };

  const setChatSheetVisible = (isVisible: boolean) => {
    if (isVisible) {
      if (!currentConversationEntity) {
        const newConversationEntity = new Entity();
        lsc.engine.addEntity(newConversationEntity);
        newConversationEntity.add(new IdentifierFacet({ guid: v4() }));
        newConversationEntity.add(AdditionalTag.SAPIENTOR_CONVERSATION);
        newConversationEntity?.add(AdditionalTag.CHAT_SHEET_VISIBLE);
        newConversationEntity.add(SupportedModel.TURBO);
      } else {
        currentConversationEntity.add(AdditionalTag.CHAT_SHEET_VISIBLE);
      }
    } else {
      currentConversationEntity?.remove(AdditionalTag.CHAT_SHEET_VISIBLE);
    }
  };

  const changeModel = (model: SupportedModel) => {
    if (model === SupportedModel.SAPIENTOR_ASSISTENT) {
      currentConversationEntity?.add(SupportedModel.SAPIENTOR_ASSISTENT);
      currentConversationEntity?.remove(SupportedModel.TURBO);
    } else {
      currentConversationEntity?.remove(SupportedModel.SAPIENTOR_ASSISTENT);
      currentConversationEntity?.add(SupportedModel.TURBO);
    }
  };

  return {
    currentConversationEntity,
    deleteCurrentConversation,
    isQuickChatVisible,
    setQuickChatVisible,
    isChatSheetVisible,
    useSapientorAssistentModel,
    setChatSheetVisible,
    changeModel,
  };
};
