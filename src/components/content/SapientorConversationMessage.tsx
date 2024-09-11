import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../base/constants';
import { useSelectedTheme } from '../../features/collection/hooks/useSelectedTheme';
import Spacer from '../layout/Spacer';
import TypingAnimationInnerHTML from './TypingAnimationInnerHTML';
import { ConversationMessage, Suggestion } from '../../base/types';

const StyledMessageHeader = styled.div`
  ${tw`flex items-center space-y-1 space-x-3`}
`;

const StyledLoadingIndicatorWrapper = styled.div`
  ${tw`flex items-center mt-4  `}
`;

const StyledRoleIcon = styled.div<{ role: 'gpt' | 'user' }>`
  ${tw`w-4 h-4 rounded-full`}
  background-color: ${(props) => (props.role === 'gpt' ? COLOR_ITEMS[0].color : COLOR_ITEMS[1].color)};
`;

const StyledRoleTitle = styled.p`
  ${tw`text-lg mb-1 font-semibold`}
`;

const StyledMessageWrapper = styled.div`
  ${tw`pl-8`}
`;

const SapientorConversationMessage = (props: {
  message: ConversationMessage;
  onWritingAnimationPlayed?: () => void;
  isLoading?: boolean;
  playWritingAnimation?: boolean;
}) => {
  const { message, onWritingAnimationPlayed, isLoading } = props;
  const [additionalContent, setAdditionalContent] = useState<ReactNode>(null);
  const { isDarkModeAktive: isDarkMode } = useSelectedTheme();
  const [sugesstions, setSugesstions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setAdditionalContent(message.specialContent);
      setSugesstions(message.suggestions || []);
    }, 600);
  }, [message]);

  return (
    <div>
      <Spacer size={6} />
      <StyledMessageHeader>
        <StyledRoleIcon role={message.role} />
        <StyledRoleTitle>{message.role === 'user' ? 'Du' : 'Sapientor'}</StyledRoleTitle>
      </StyledMessageHeader>

      <StyledMessageWrapper>
        {message.role === 'user' ? (
          message.message
        ) : isLoading ? (
          <StyledLoadingIndicatorWrapper>
            <motion.div
              style={{
                backgroundColor: isDarkMode ? 'white' : 'black',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginLeft: '4px',
                marginRight: '4px',
              }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.div
              style={{
                backgroundColor: isDarkMode ? 'white' : 'black',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginLeft: '4px',
                marginRight: '4px',
              }}
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              style={{
                backgroundColor: isDarkMode ? 'white' : 'black',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginLeft: '4px',
                marginRight: '4px',
              }}
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </StyledLoadingIndicatorWrapper>
        ) : (
          <TypingAnimationInnerHTML
            onWritingAnimationPlayed={onWritingAnimationPlayed}
            playAnimation={true}
            text={message.message}
          />
        )}
      </StyledMessageWrapper>

      {additionalContent && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {additionalContent}
        </motion.div>
      )}

      <StyledSugesstionsWrapper>
        {sugesstions.map((sugesstion, index) => (
          <AnswerSugesstion key={index} sugesstion={sugesstion.answer} onClick={sugesstion.func} />
        ))}
      </StyledSugesstionsWrapper>
    </div>
  );
};

export default SapientorConversationMessage;

const StyledSugesstionsWrapper = styled.div`
  ${tw`px-4 mt-4`}
`;

const StyledSugesstionWrapper = styled.div`
  ${tw`  border w-fit  rounded-lg py-1 md:hover:opacity-50 transition-all mt-2 px-4`}
  color: ${COLOR_ITEMS[0].color};
  border-color: ${COLOR_ITEMS[0].color};
`;

const AnswerSugesstion = (props: { sugesstion: string; onClick: () => void }) => {
  const { sugesstion, onClick } = props;
  return <StyledSugesstionWrapper onClick={onClick}>{sugesstion}</StyledSugesstionWrapper>;
};
