import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef } from 'react';
import tw from 'twin.macro';

import { useCurrentSapientorConversation } from '../hooks/useCurrentConversation';
import SapientorChatSheet from './SapientorChatSheet';
import SapientorEye from './SapientorEye';
import SapientorQuickChat from './SapientorQuickChat';
import { MessageRoleFacet } from '../../../app/additionalFacets';
import { COLOR_ITEMS, MEDIUM_DEVICE_WIDTH } from '../../../base/constants';
import { AdditionalTags } from '../../../base/enums';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';

const useQuickChat = () => {
  const lsc = useContext(LeanScopeClientContext);
  const quickChatRef = useRef<HTMLDivElement>(null);
  const [promptEntities] = useEntities((e) => e.has(AdditionalTags.PROMPT));
  const [messageEntities] = useEntities((e) => e.has(MessageRoleFacet));
  const {
    isChatSheetVisible,
    setQuickChatVisible,
    setChatSheetVisible,
    deleteCurrentConversation,
    isQuickChatVisible,
  } = useCurrentSapientorConversation();

  useEffect(() => {
    if (!isChatSheetVisible && !isQuickChatVisible) {
      lsc.engine.entities
        .filter((e) => e?.has(AdditionalTags.RELATED_THREAD_RESOURCE))
        .forEach((entity) => {
          lsc.engine.removeEntity(entity);
        });
    }
  }, [isQuickChatVisible, isChatSheetVisible, deleteCurrentConversation, lsc.engine]);

  const handleClickOutside = (event: MouseEvent) => {
    if (quickChatRef.current && !quickChatRef.current.contains(event.target as Node)) {
      setQuickChatVisible(false);
      setChatSheetVisible(false);

      setTimeout(() => {
        [...promptEntities, ...messageEntities].forEach((entity) => {
          lsc.engine.removeEntity(entity);
        });
      }, 300);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [messageEntities, promptEntities, setQuickChatVisible, setChatSheetVisible]);

  return { quickChatRef };
};

const StyledIconWrapper = styled.div`
  ${tw` overflow-hidden  pt-4 z-50 m-4 md:m-6 xl:m-8  bg-tertiary dark:bg-tertiaryDark transition-all hover:scale-105 rounded-xl size-20`}
`;

const StyledSapientorOutline = styled.div`
  ${tw`w-full rounded-t-full h-12`}
  background-color: ${COLOR_ITEMS[7].accentColor};
`;

const StyledSapientorEyeWrapper = styled.div`
  ${tw`flex px-4 pt-4 justify-between`}
`;

const StyledThinkingAnimationWrapper = styled.div`
  ${tw`z-40 relative top-2 mx-auto w-fit flex`}
`;

const SapientorIcon = () => {
  const [promptEntity] = useEntities((e) => e.has(AdditionalTags.PROMPT) && e.has(AdditionalTags.PROCESSING))[0];
  const [isProcessingCurrentPrompt] = useEntityHasTags(promptEntity, AdditionalTags.PROCESSING);
  const { quickChatRef } = useQuickChat();
  const { isQuickChatVisible, setQuickChatVisible, setChatSheetVisible, isChatSheetVisible } =
    useCurrentSapientorConversation();
  const { width } = useWindowDimensions();

  const openPromptBox = () => {
    if (width < MEDIUM_DEVICE_WIDTH) {
      setChatSheetVisible(true);
    } else {
      setQuickChatVisible(true);

      if (isQuickChatVisible) {
        setQuickChatVisible(false);
        setChatSheetVisible(true);
      }
    }
  };

  return (
    <div tw="hidden md:flex" ref={quickChatRef}>
      <motion.div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
        }}
      >
        <StyledIconWrapper onClick={openPromptBox}>
          <motion.div
            initial={{ y: -60 }}
            animate={{
              opacity: isProcessingCurrentPrompt && !isChatSheetVisible ? 1 : 0,
              y: isProcessingCurrentPrompt && !isChatSheetVisible ? 0 : -60,
            }}
          >
            <StyledThinkingAnimationWrapper>
              <motion.div
                style={{
                  backgroundColor: COLOR_ITEMS[0].color,
                  width: 13,
                  height: 13,
                  margin: 3,
                  borderRadius: '50%',
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
                  borderRadius: '50%',
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
                  borderRadius: '50%',
                }}
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </StyledThinkingAnimationWrapper>
          </motion.div>

          <motion.div
            initial={{ y: 0 }}
            animate={{
              y: isProcessingCurrentPrompt && !isChatSheetVisible ? 60 : 0,
            }}
          >
            <StyledSapientorOutline>
              <StyledSapientorEyeWrapper>
                <SapientorEye />
                <SapientorEye />
              </StyledSapientorEyeWrapper>
            </StyledSapientorOutline>
          </motion.div>
        </StyledIconWrapper>
      </motion.div>

      <SapientorQuickChat />
      <SapientorChatSheet />
    </div>
  );
};

export default SapientorIcon;
