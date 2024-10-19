import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { TutorialState } from '../../types';

const StyledMotionDiv = styled(motion.div)`
  ${tw`w-screen px-4 absolute left-0 top-0 flex justify-center`}
`;

const StyledBackButton = styled.div`
  ${tw`absolute left-4 opacity-40 top-4 text-xl`}
`;

const StyledContentDiv = styled.div`
  ${tw`md:w-96 pt-20 md:pt-32 lg:pt-48 xl:pt-60`}
`;

const StyledTitle = styled.div`
  ${tw`text-2xl flex flex-wrap font-bold`}
`;

const StyledDescription = styled.p`
  ${tw`mt-4 md:mt-6`}
`;

const StyledIndicatorContainer = styled.div`
  ${tw`mt-6`}
`;

const StyledProgressBar = styled(motion.div)`
  ${tw`h-2 bg-primary-color rounded-full`}
`;

const AnimatedTextContainer = styled.div`
  ${tw`relative h-8 text-secondary-text w-full`}
`;

const StyledAnimatedText = styled(motion.div)`
  ${tw`absolute w-full`}
`;

export const GeneratingFlashcardsSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
  isGeneratingDone: boolean;
}) => {
  const { tutorialState, setTutorialState, isGeneratingDone } = props;
  const isVisible = tutorialState == TutorialState.GENERATING_FLASHCARDS;
  const positionX = isVisible
    ? 0
    : [TutorialState.INTRODUCTION, TutorialState.SELECTING_IMAGE].includes(tutorialState)
      ? 600
      : -600;

  const handleBackButtonClick = () => setTutorialState(TutorialState.SELECTING_IMAGE);

  return (
    <StyledMotionDiv
      initial={{ opacity: 0, x: positionX }}
      animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
    >
      <StyledBackButton onClick={handleBackButtonClick}>
        <IoArrowBack />
      </StyledBackButton>

      <StyledContentDiv>
        <StyledTitle>Deine Lernkarten werden generiert ...</StyledTitle>
        <StyledDescription>
          Dein Bild wird jetzt analysiert und wir erstellen dir passende Lernkarten, die du später lernen kannst.
        </StyledDescription>

        <GeneratingIndicator isAnimationPlaying={isVisible} isGeneratingDone={isGeneratingDone} />
      </StyledContentDiv>
    </StyledMotionDiv>
  );
};

const GeneratingIndicator = (props: { isGeneratingDone: boolean; isAnimationPlaying: boolean }) => {
  const { isGeneratingDone, isAnimationPlaying } = props;
  const generatingProgress = useGeneratingProgress(isGeneratingDone, isAnimationPlaying);

  return (
    <StyledIndicatorContainer>
      <motion.div tw="flex animate-pulse space-x-4">
        <AnimatedTextSwitcher
          isAnimationPlaying={isAnimationPlaying}
          texts={[
            'Hochladen des Bildes',
            'Analyse des Bildes',
            'Erstellung der Lernkarten',
            'Validierung der Lernkarten',
            'Fertigstellung der Lernkarten',
            'Zuordnung zu Themen',
            'Speichern der Lernkarten',
          ]}
        />
      </motion.div>
      <div tw="mt-2 w-full">
        <StyledProgressBar
          animate={{
            width: `${generatingProgress}%`,
          }}
        />
      </div>
    </StyledIndicatorContainer>
  );
};
const useGeneratingProgress = (isGeneratingDone: boolean, isAnimationPlaying: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAnimationPlaying) return;

    if (isGeneratingDone) {
      setProgress(100);
      return;
    }

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * (0.5 + (100 - prev) / 50);
        const nextProgress = Math.min(prev + increment, 100);
        return nextProgress;
      });
    }, 250);

    return () => clearInterval(intervalId);
  }, [isGeneratingDone, isAnimationPlaying]);

  return progress;
};

const AnimatedTextSwitcher = ({ texts, isAnimationPlaying }: { texts: string[]; isAnimationPlaying: boolean }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!isAnimationPlaying) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex == texts.length - 1 ? prevIndex : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length, isAnimationPlaying]);

  return (
    <AnimatedTextContainer>
      {texts.map((text, index) => (
        <StyledAnimatedText
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={index === currentTextIndex ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.8, type: 'spring', delay: index * 0.2 }}
        >
          {text}
        </StyledAnimatedText>
      ))}
    </AnimatedTextContainer>
  );
};
