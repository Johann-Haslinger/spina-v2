import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { v4 } from 'uuid';
import { AdditionalTag, SupportedModel } from '../../../base/enums';

export const useCurrentSapientorConversation = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [currentConversationEntity] = useEntity((e) => e.hasTag(AdditionalTag.SAPIENTOR_CONVERSATION));
  const [isQuickChatVisible] = useEntityHasTags(currentConversationEntity, AdditionalTag.QUIK_CHAT_VISIBLE);
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
        newConversationEntity?.add(AdditionalTag.QUIK_CHAT_VISIBLE);
        newConversationEntity.add(SupportedModel.TURBO);
      } else {
        currentConversationEntity.add(AdditionalTag.QUIK_CHAT_VISIBLE);
      }
    } else {
      currentConversationEntity?.remove(AdditionalTag.QUIK_CHAT_VISIBLE);
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
