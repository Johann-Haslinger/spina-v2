import styled from '@emotion/styled/macro';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../../common/types/enums';
import { View } from '../../../components';

enum TutorialState {
  INTRODUCTION,
  SELECTING_IMAGE,
  GENERATING_FLASHCARDS,
  SAVING_FLASHCARDS,
  ADDING_SCHOOL_SUBJECTS,
  REVIEWING_FLASHCARDS,
  EXPLAINING_OVERVIEW,
  EXPLAINING_COLLECTION,
}

const Tutorial = () => {
  const isTutorialPlaying = useIsStoryCurrent(Story.OBSERVING_TUTORIAL_STORY);
  const [tutorialState, setTutorialState] = useState<TutorialState>(TutorialState.INTRODUCTION);

  return (
    isTutorialPlaying && (
      <div>
        <TutorialView tutorialState={tutorialState} setTutorialState={setTutorialState} />
      </div>
    )
  );
};

export default Tutorial;

const TutorialView = (props: { tutorialState: TutorialState; setTutorialState: (newValue: TutorialState) => void }) => {
  const { tutorialState, setTutorialState } = props;
  const isViewDisplayed = [
    TutorialState.INTRODUCTION,
    TutorialState.SELECTING_IMAGE,
    TutorialState.GENERATING_FLASHCARDS,
    TutorialState.SAVING_FLASHCARDS,
    TutorialState.ADDING_SCHOOL_SUBJECTS,
  ].includes(tutorialState);

  return (
    <View visible={isViewDisplayed}>
      <TutorialIntroduction
        isVisible={tutorialState == TutorialState.INTRODUCTION}
        setTutorialState={setTutorialState}
      />
      <SelectingImageSection tutorialState={tutorialState} setTutorialState={setTutorialState} />
      <GeneratingFlashcardsSection tutorialState={tutorialState} setTutorialState={setTutorialState} />
    </View>
  );
};

const StyledTitle = styled.p`
  ${tw`text-3xl font-extrabold`}
`;

const TutorialIntroduction = (props: { isVisible: boolean; setTutorialState: (newValue: TutorialState) => void }) => {
  const { isVisible, setTutorialState } = props;

  const handleButtonClick = () => setTutorialState(TutorialState.SELECTING_IMAGE);

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -600 }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
      tw=" absolute left-0 top-0 w-screen pt-20 md:pt-32 lg:pt-48 xl:pt-60 flex justify-center"
    >
      <div tw="md:w-96  ">
        <p tw="text-6xl mb-8">🎉</p>
        <StyledTitle>Willkommen bei Spina!</StyledTitle>
        <p tw="mt-4  md:mt-8">
          Wir führen dich jetzt schnell durch die wichtigsten Funktionen, damit du direkt loslegen kannst.
        </p>
        <StyledButton onClick={handleButtonClick}>
          <span>Los geht's!</span>
        </StyledButton>
      </div>
    </motion.div>
  );
};

const SelectingImageSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
}) => {
  const { tutorialState, setTutorialState } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const isVisible = tutorialState == TutorialState.SELECTING_IMAGE;
  const positionX = isVisible ? 0 : tutorialState == TutorialState.INTRODUCTION ? 600 : -600;

  const handleBackButtonClick = () => setTutorialState(TutorialState.INTRODUCTION);
  const handleFurtherButtonClick = () => setTutorialState(TutorialState.GENERATING_FLASHCARDS);

  return (
    <motion.div
      initial={{ opacity: 0, x: positionX }}
      animate={{ opacity: isVisible ? 1 : 0, x: positionX }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
      tw="w-screen  absolute left-0 top-0 flex justify-center"
    >
      <div tw="absolute left-4 opacity-40 top-4 text-xl" onClick={handleBackButtonClick}>
        <IoArrowBack />
      </div>

      <div tw="md:w-96 pt-20 md:pt-32 lg:pt-48 xl:pt-60">
        <p tw="text-2xl font-bold">Lernkarten aus einem Bild erzeugen</p>
        <p tw="mt-4  md:mt-6">
          Du kannst dir in Spina aus deinen Tafelbildern oder Vokabellisten Lernkarten erstellen - Probiere es aus!
        </p>
        <div tw=" mt-6 rounded-lg">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            tw="mt-4"
          />
          <p tw="mt-2 text-secondary-text text-sm">Wähle ein Bild aus, um fortzufahren</p>
        </div>
        <StyledButton isBlocked={!selectedImage} onClick={handleFurtherButtonClick}>
          Weiter
        </StyledButton>
      </div>
    </motion.div>
  );
};

const GeneratingFlashcardsSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
}) => {
  const { tutorialState, setTutorialState } = props;
  const isVisible = tutorialState == TutorialState.GENERATING_FLASHCARDS;
  const positionX = isVisible
    ? 0
    : [TutorialState.INTRODUCTION, TutorialState.SELECTING_IMAGE].includes(tutorialState)
      ? 600
      : -600;

  const handleBackButtonClick = () => setTutorialState(TutorialState.SELECTING_IMAGE);
  // const handleFurtherButtonClick = () => setTutorialState(TutorialState.SAVING_FLASHCARDS);

  return (
    <motion.div
      initial={{ opacity: 0, x: positionX }}
      animate={{ opacity: isVisible ? 1 : 0, x: positionX }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
      tw="w-screen  absolute left-0 top-0 flex justify-center"
    >
      <div tw="absolute left-4 opacity-40 top-4 text-xl" onClick={handleBackButtonClick}>
        <IoArrowBack />
      </div>

      <div tw="md:w-96 pt-20 md:pt-32 lg:pt-48 xl:pt-60">
        <p tw="text-2xl font-bold">Deine Karteikarten werden generiert</p>
        <p tw="mt-4  md:mt-6">
          Dein Bild wird jetzt analysiert und wir erstellen dir passende Karteikarten, die du später lernen kannst.
        </p>
      </div>
    </motion.div>
  );
};

const StyledButton = styled.button<{ isBlocked?: boolean }>`
  ${tw`bg-black text-white w-full hover:opacity-80 transition-all font-semibold py-3 px-4 rounded-full mt-8 md:mt-12`}
  ${({ isBlocked }) => isBlocked && tw`opacity-20 pointer-events-none`}
`;
