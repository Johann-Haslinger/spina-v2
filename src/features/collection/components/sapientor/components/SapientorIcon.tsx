import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useEntities } from "@leanscope/ecs-engine";
import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { MessageRoleFacet } from "../../../../../app/additionalFacets";
import { COLOR_ITEMS } from "../../../../../base/constants";
import { AdditionalTags } from "../../../../../base/enums";
import SapientorChatView from "./SapientorChatView";
import SapientorEye from "./SapientorEye";
import SapientorQuickChat from "./SapientorQuickChat";
import { useAppState } from "../../../hooks/useAppState";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";

const useQuickChat = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [isQuickChatVisible, setIsQuickChatVisible] = useState(false);
  const quickChatRef = useRef<HTMLDivElement>(null);
  const [promptEntities] = useEntities((e) => e.has(AdditionalTags.PROMPT));
  const [messageEntities] = useEntities((e) => e.has(MessageRoleFacet));
  const { appStateEntity } = useAppState();

  const handleClickOutside = (event: MouseEvent) => {
    if (quickChatRef.current && !quickChatRef.current.contains(event.target as Node)) {
      setIsQuickChatVisible(false);

      setTimeout(() => {
        [...promptEntities, ...messageEntities].forEach((entity) => {
          lsc.engine.removeEntity(entity);
        });
        appStateEntity?.remove(AdditionalTags.CONVERSATION_VISIBLE);
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [messageEntities, promptEntities]);

  return { quickChatRef, isQuickChatVisible, setIsQuickChatVisible };
};

const StyledIconWrapper = styled.div`
  ${tw` overflow-hidden  pt-4 z-50 m-4 md:m-6 xl:m-8  bg-tertiary dark:bg-tertiaryDark transition-all hover:scale-105 rounded-xl size-16 md:size-20`}
`;

const StyledSapientorOutline = styled.div`
  ${tw`w-full rounded-t-full h-8 md:h-10 xl:h-12`}
  background-color: ${COLOR_ITEMS[0].backgroundColor};
`;

const StyledSapientorEyeWrapper = styled.div`
  ${tw`flex px-4 pt-4 justify-between`}
`;

const StyledThinkingAnimationWrapper = styled.div`
  ${tw`z-40 relative top-2 mx-auto w-fit flex`}
`;

const SapientorIcon = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [promptEntity] = useEntities((e) => e.has(AdditionalTags.PROMPT) && e.has(AdditionalTags.PROCESSING))[0];
  const isProcessingCurrentPrompt = promptEntity?.hasTag(AdditionalTags.PROCESSING);
  const { isQuickChatVisible, setIsQuickChatVisible, quickChatRef } = useQuickChat();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const { appStateEntity } = useAppState();
  const [isConversationVisible] = useEntityHasTags(appStateEntity, AdditionalTags.CONVERSATION_VISIBLE);

  useEffect(() => {
    if (!isConversationVisible) {
      setIsChatVisible(false);
      setIsQuickChatVisible(false);

      lsc.engine.entities.filter((e) => e.has(AdditionalTags.RELATED_THREAD_RESOURCE)).forEach((entity) => {
        lsc.engine.removeEntity(entity);
      })
    }
  }, [isConversationVisible]);

  const openPromptBox = () => {
    setIsQuickChatVisible(true);
    appStateEntity?.add(AdditionalTags.CONVERSATION_VISIBLE);
  }
  const openChatView = () => {
    setIsChatVisible(true);
    setIsQuickChatVisible(false);
  };
  const closeChatView = () => {
    setIsChatVisible(false);
    appStateEntity?.add(AdditionalTags.CONVERSATION_VISIBLE);
  }

  return (
    <div ref={quickChatRef}>
      <motion.div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
        }}
      >
        <StyledIconWrapper onClick={openPromptBox}>
          <motion.div
            initial={{ y: -60 }}
            animate={{
              opacity: isProcessingCurrentPrompt ? 1 : 0,
              y: isProcessingCurrentPrompt ? 0 : -60,
            }}
          >
            <StyledThinkingAnimationWrapper>
              <motion.div
                style={{
                  backgroundColor: COLOR_ITEMS[0].color,
                  width: 13,
                  height: 13,
                  margin: 3,
                  borderRadius: "50%",
                }}
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                style={{
                  backgroundColor: COLOR_ITEMS[0].color,
                  width: 13,
                  height: 13,
                  margin: 3,
                  borderRadius: "50%",
                }}
                animate={{ y: [7, -7, 7] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                style={{
                  backgroundColor: COLOR_ITEMS[0].color,
                  width: 13,
                  height: 13,
                  margin: 3,
                  borderRadius: "50%",
                }}
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </StyledThinkingAnimationWrapper>
          </motion.div>

          <motion.div initial={{ y: 0 }} animate={{ y: isProcessingCurrentPrompt ? 60 : 0 }}>
            <StyledSapientorOutline>
              <StyledSapientorEyeWrapper>
                <SapientorEye />
                <SapientorEye />
              </StyledSapientorEyeWrapper>
            </StyledSapientorOutline>
          </motion.div>
        </StyledIconWrapper>
      </motion.div>

      <SapientorQuickChat openChatView={openChatView} isVisible={isQuickChatVisible} />
      <SapientorChatView navigateBack={closeChatView} isVisible={isChatVisible} />
    </div>
  );
};

export default SapientorIcon;
