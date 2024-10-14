import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { IoSparkles } from 'react-icons/io5';
import tw from 'twin.macro';
import { useWindowDimensions } from '../../../../../hooks/useWindowDimensions';

const StyledGenerateOptionsWrapper = styled(motion.div)`
  ${tw`md:flex  w-full h-full md:space-x-2`}
`;

const StyledGenerateOption = styled.div`
  ${tw`w-full hover:bg-opacity-60  flex flex-col justify-between p-4 dark:bg-tertiary-dark bg-secondary transition-all h-1/2 md:h-full rounded-xl`}
`;

const StyledResourceTitle = styled.p`
  ${tw`font-semibold dark:text-primary-text-dark mt-3 text-lg`}
`;

const StyledNoteText = styled.p`
  ${tw`text-secondary-text mt-0.5`}
`;

const StyledGenerateButton = styled.div`
  ${tw`bg-primary-color cursor-pointer hover:scale-105 transition-all hover:opacity-80 dark:bg-opacity-10 bg-opacity-5 text-primary-color flex space-x-2 w-fit px-4 py-1.5 items-center rounded-full`}
`;

const StyledGenerateButtonText = styled.p`
  ${tw`font-medium`}
`;

const StyledIconWrapper = styled.div`
  ${tw`text-lg`}
`;

const StyledCardText = styled.p`
  ${tw`text-secondary-text mt-0.5`}
`;

const GenerateOptions = (props: { onGenerateNote: () => void; onGenerateCards: () => void; isVisible: boolean }) => {
  const { onGenerateNote, onGenerateCards, isVisible } = props;
  const { isMobile } = useWindowDimensions();

  return (
    <StyledGenerateOptionsWrapper
      initial={{ opacity: 0, scale: 1 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
        display: isVisible ? (isMobile ? 'block' : 'flex') : 'none',
      }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      <StyledGenerateOption onClick={onGenerateNote}>
        <div>
          <StyledResourceTitle>Notiz</StyledResourceTitle>
          <StyledNoteText>Lasse dir eine Notiz basierend auf deinem Bild generieren.</StyledNoteText>
        </div>
        <StyledGenerateButton>
          <StyledIconWrapper>
            <IoSparkles />
          </StyledIconWrapper>
          <StyledGenerateButtonText>Generieren</StyledGenerateButtonText>
        </StyledGenerateButton>
      </StyledGenerateOption>
      <StyledGenerateOption onClick={onGenerateCards}>
        <div>
          <StyledResourceTitle>Lernkarten</StyledResourceTitle>
          <StyledCardText>Lasse dir Lernkarten basierend auf deinem Bild generieren.</StyledCardText>
        </div>
        <StyledGenerateButton>
          <StyledIconWrapper>
            <IoSparkles />
          </StyledIconWrapper>
          <StyledGenerateButtonText>Generieren</StyledGenerateButtonText>
        </StyledGenerateButton>
      </StyledGenerateOption>
    </StyledGenerateOptionsWrapper>
  );
};

export default GenerateOptions;
