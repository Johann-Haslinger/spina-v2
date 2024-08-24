import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { v4 } from 'uuid';
import { AdditionalTags, SupportedModels } from '../../../base/enums';

export const useCurrentSapientorConversation = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [currentConversationEntity] = useEntity((e) => e.hasTag(AdditionalTags.SAPIENTOR_CONVERSATION));
  const [isQuickChatVisible] = useEntityHasTags(currentConversationEntity, AdditionalTags.QUIK_CHAT_VISIBLE);
  const [isChatSheetVisible] = useEntityHasTags(currentConversationEntity, AdditionalTags.CHAT_SHEET_VISIBLE);
  const [useSapientorAssistentModel] = useEntityHasTags(currentConversationEntity, SupportedModels.SAPIENTOR_ASSISTENT);

  const deleteCurrentConversation = () => {
    currentConversationEntity && lsc.engine.removeEntity(currentConversationEntity);
  };

  const setQuickChatVisible = (isVisible: boolean) => {
    if (isVisible) {
      if (!currentConversationEntity) {
        const newConversationEntity = new Entity();
        lsc.engine.addEntity(newConversationEntity);
        newConversationEntity.add(new IdentifierFacet({ guid: v4() }));
        newConversationEntity.add(AdditionalTags.SAPIENTOR_CONVERSATION);
        newConversationEntity?.add(AdditionalTags.QUIK_CHAT_VISIBLE);
        newConversationEntity.add(SupportedModels.TURBO);
      } else {
        currentConversationEntity.add(AdditionalTags.QUIK_CHAT_VISIBLE);
      }
    } else {
      currentConversationEntity?.remove(AdditionalTags.QUIK_CHAT_VISIBLE);
    }
  };

  const setChatSheetVisible = (isVisible: boolean) => {
    if (isVisible) {
      if (!currentConversationEntity) {
        const newConversationEntity = new Entity();
        lsc.engine.addEntity(newConversationEntity);
        newConversationEntity.add(new IdentifierFacet({ guid: v4() }));
        newConversationEntity.add(AdditionalTags.SAPIENTOR_CONVERSATION);
        newConversationEntity?.add(AdditionalTags.CHAT_SHEET_VISIBLE);
        newConversationEntity.add(SupportedModels.TURBO);
      } else {
        currentConversationEntity.add(AdditionalTags.CHAT_SHEET_VISIBLE);
      }
    } else {
      currentConversationEntity?.remove(AdditionalTags.CHAT_SHEET_VISIBLE);
    }
  };

  const changeModel = (model: SupportedModels) => {
    if (model === SupportedModels.SAPIENTOR_ASSISTENT) {
      currentConversationEntity?.add(SupportedModels.SAPIENTOR_ASSISTENT);
      currentConversationEntity?.remove(SupportedModels.TURBO);
    } else {
      currentConversationEntity?.remove(SupportedModels.SAPIENTOR_ASSISTENT);
      currentConversationEntity?.add(SupportedModels.TURBO);
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
