import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useEntities } from '@leanscope/ecs-engine';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { BackgroundOverlay } from '../../../../../common/components/others';
import { useOutsideClick } from '../../../../../common/hooks';
import { useUserData } from '../../../../../common/hooks/useUserData';
import { useWindowDimensions } from '../../../../../common/hooks/useWindowDimensions';
import { FileFacet } from '../../../../../common/types/additionalFacets';
import { AdditionalTag, Story } from '../../../../../common/types/enums';
import { GeneratedFlashcardSetResource, GeneratedNoteResource } from '../../../../../common/types/types';
import { generateLearningUnitFromFile } from '../../../functions/generateLearningUnitFromFile';
import GeneratedFlashcardSet from './GeneratedFlashcardSet';
import GeneratedNote from './GeneratedNote';
import GenerateOptions from './GenerateOptions';
import GeneratingIndicator from './GeneratingIndicator';

enum View {
  CHOOSE_LEARNING_UNIT_TYPE,
  GENERATING,
  NOTE,
  CARDS,
  DONE,
}

const StyledSheet = styled(motion.div)`
  ${tw`bg-white dark:text-white  dark:bg-secondary-dark overflow-hidden z-[200] dark:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] rounded-2xl p-2 fixed`}
`;

const GeneratingLearningUnitFromImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const { currentView, setCurrentView } = useCurrentView();
  const sheetRef = useRef<HTMLDivElement>(null);
  const isSheetLarge = currentView === View.NOTE || currentView === View.CARDS;
  const { isMobile } = useWindowDimensions();
  const isChoosingLearningUnitType = currentView === View.CHOOSE_LEARNING_UNIT_TYPE;
  const { generatedFlashcardSet, setGeneratedFlashcardSet } = useGeneratedFlashcards();
  const { generatedNote, setGeneratedNote } = useGeneratedNote();
  const [uploadedFileEntities] = useEntities((e) => e.has(AdditionalTag.UPLOADED_FILE));
  const uploadedFile = uploadedFileEntities[0]?.get(FileFacet)?.props.file;
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.ANY);

  useOutsideClick(sheetRef, navigateBack, isVisible);

  const handleGenerateNoteButtonClick = async () => {
    if (!uploadedFile) return;

    setGeneratedNote(null);
    setCurrentView(View.GENERATING);

    const generatedNote = await generateLearningUnitFromFile(lsc, uploadedFile, userId, 'note');
    setGeneratedNote(generatedNote);
    setCurrentView(View.NOTE);
  };

  const handleGenerateCardsButtonClick = async () => {
    if (!uploadedFile) return;

    setGeneratedFlashcardSet(null);
    setCurrentView(View.GENERATING);

    const generatedFlashcards = await generateLearningUnitFromFile(lsc, uploadedFile, userId, 'flashcardSet');
    setGeneratedFlashcardSet(generatedFlashcards);
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
        <GeneratingIndicator isVisible={currentView === View.GENERATING} />
        {generatedFlashcardSet && (
          <GeneratedFlashcardSet
            regenerateFlashcards={handleGenerateCardsButtonClick}
            generatedFlashcardSet={generatedFlashcardSet}
            isVisible={currentView === View.CARDS}
          />
        )}
        {generatedNote && (
          <GeneratedNote
            note={generatedNote}
            isVisible={currentView === View.NOTE}
            regenerateNote={handleGenerateNoteButtonClick}
          />
        )}
      </StyledSheet>
    </div>
  );
};

export default GeneratingLearningUnitFromImageSheet;

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

const useGeneratedFlashcards = () => {
  const [generatedFlashcardSet, setGeneratedFlashcardSet] = useState<GeneratedFlashcardSetResource | null>(null);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);

  useEffect(() => {
    setGeneratedFlashcardSet(null);
  }, [isVisible]);

  return { generatedFlashcardSet, setGeneratedFlashcardSet };
};

const useGeneratedNote = () => {
  const [generatedNote, setGeneratedNote] = useState<GeneratedNoteResource | null>(null);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);

  useEffect(() => {
    setGeneratedNote(null);
  }, [isVisible]);

  return { generatedNote, setGeneratedNote };
};
