import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoSparkles } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../../../base/enums';
import { BackgroundOverlay } from '../../../../common/components/others';
import { useOutsideClick } from '../../../../common/hooks';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';

enum View {
  CHOOSE_LEARNING_UNIT_TYPE,
  NOTE,
  CARDS,
  DONE,
}

const StyledSheet = styled(motion.div)`
  ${tw`bg-white overflow-hidden z-[200] dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.13)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] rounded-2xl dark:bg-primary-dark p-2 absolute`}
`;

const GeneratingLearningUnitFromImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const { currentView, setCurrentView } = useCurrentView();
  const sheetRef = useRef<HTMLDivElement>(null);
  const isSheetLarge = currentView === View.NOTE || currentView === View.CARDS;
  const { isMobile } = useWindowDimensions();
  const isChoosingLearningUnitType = currentView === View.CHOOSE_LEARNING_UNIT_TYPE;

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  useOutsideClick(sheetRef, navigateBack, isVisible);

  const handleGenerateNoteButtonClick = () => {
    setCurrentView(View.NOTE);
  };

  const handleGenerateCardsButtonClick = () => {
    setCurrentView(View.CARDS);
  };

  const normalSheetHeight = isMobile ? '40%' : '30%';
  const largeSheetHeight = isMobile ? '80%' : '90%';
  const sheetHeight = isSheetLarge ? largeSheetHeight : normalSheetHeight;

  const normalSheetWidth = isMobile ? '90%' : '40%';
  const largeSheetWidth = isMobile ? '90%' : '60%';
  const sheetWidth = isSheetLarge ? largeSheetWidth : normalSheetWidth;

  const normalTop = isMobile ? '10%' : '30%';
  const largeTop = isMobile ? '10%' : '5%';
  const sheetTop = isSheetLarge ? largeTop : normalTop;

  const normalLeft = isMobile ? '5%' : '30%';
  const largeLeft = isMobile ? '5%' : '20%';
  const sheetLeft = isSheetLarge ? largeLeft : normalLeft;

  return (
    <div>
      <BackgroundOverlay isVisible={isVisible} />
      <StyledSheet
        ref={sheetRef}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          height: sheetHeight,
          width: sheetWidth,
          top: sheetTop,
          left: sheetLeft,
        }}
        initial={{ opacity: 0, scale: 0, display: 'none' }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <GenerateOptions
          onGenerateNote={handleGenerateNoteButtonClick}
          onGenerateCards={handleGenerateCardsButtonClick}
          isVisible={isChoosingLearningUnitType}
        />
        <GeneratingIndicator isVisible={currentView === View.NOTE || currentView === View.CARDS} />
      </StyledSheet>
    </div>
  );
};

export default GeneratingLearningUnitFromImageSheet;

const StyledGeneratingIndicatorWrapper = styled(motion.div)`
  ${tw`flex h-full pb-20 items-center justify-center`}
`;

const ballStyle = {
  backgroundColor: '#325FFF',
  width: '4rem',
  height: '4rem',
  margin: '1.5rem',
  borderRadius: '50%',
};

const GeneratingIndicator = (props: { isVisible: boolean }) => {
  const { isVisible } = props;
  const animationVariants = {
    bounce: (delay: number) => ({
      y: [-20, 20, -20],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay,
      },
    }),
  };

  return (
    <StyledGeneratingIndicatorWrapper
      initial={{
        opacity: 0,

        display: 'none',
      }}
      animate={{
        opacity: isVisible ? 1 : 0,

        display: isVisible ? 'flex' : 'none',
      }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      {[0, 0.2, 0.4].map((delay, index) => (
        <motion.div key={index} style={ballStyle} variants={animationVariants} animate="bounce" custom={delay} />
      ))}
    </StyledGeneratingIndicatorWrapper>
  );
};

const StyledGenerateOptionsWrapper = styled(motion.div)`
  ${tw`md:flex  w-full h-full md:space-x-2`}
`;

const StyledGenerateOption = styled.div`
  ${tw`w-full flex flex-col justify-between p-4 bg-secondary transition-all h-1/2 md:h-full rounded-xl`}
`;

const StyledNoteTitle = styled.p`
  ${tw`font-semibold mt-3 text-lg`}
`;

const StyledNoteText = styled.p`
  ${tw`text-secondary-text mt-0.5`}
`;

const StyledGenerateButton = styled.div`
  ${tw`bg-primary-color cursor-pointer hover:scale-105 transition-all hover:opacity-80 bg-opacity-5 text-primary-color flex space-x-2 w-fit px-4 py-1.5 items-center rounded-full`}
`;

const StyledGenerateButtonText = styled.p`
  ${tw`font-medium`}
`;

const StyledIconWrapper = styled.div`
  ${tw`text-lg`}
`;

const StyledCardTitle = styled.p`
  ${tw`font-semibold flex items-center space-x-2 mt-3 text-lg`}
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
      <StyledGenerateOption>
        <div>
          <StyledNoteTitle>Notiz</StyledNoteTitle>
          <StyledNoteText>Lasse dir eine Notiz basierend auf deinem Bild generieren.</StyledNoteText>
        </div>
        <StyledGenerateButton onClick={onGenerateNote}>
          <StyledIconWrapper>
            <IoSparkles />
          </StyledIconWrapper>
          <StyledGenerateButtonText>Generieren</StyledGenerateButtonText>
        </StyledGenerateButton>
      </StyledGenerateOption>
      <StyledGenerateOption>
        <div>
          <StyledCardTitle>Lernkarten</StyledCardTitle>
          <StyledCardText>Lasse dir Lernkarten basierend auf deinem Bild generieren.</StyledCardText>
        </div>
        <StyledGenerateButton onClick={onGenerateCards}>
          <StyledIconWrapper>
            <IoSparkles />
          </StyledIconWrapper>
          <StyledGenerateButtonText>Generieren</StyledGenerateButtonText>
        </StyledGenerateButton>
      </StyledGenerateOption>
    </StyledGenerateOptionsWrapper>
  );
};

const useCurrentView = () => {
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const [currentView, setCurrentView] = useState<View>(View.CHOOSE_LEARNING_UNIT_TYPE);

  useEffect(() => {
    if (isVisible) {
      setCurrentView(View.CHOOSE_LEARNING_UNIT_TYPE);
    }
  }, [isVisible]);

  return { currentView, setCurrentView };
};
