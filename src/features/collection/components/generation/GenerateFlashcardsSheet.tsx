import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from '../../../../common/types/additionalFacets';
import { DataType, LearningUnitType, Story } from '../../../../common/types/enums';
import { addFlashcards } from '../../../../common/utilities/addFlashcards';
import { displayButtonTexts } from '../../../../common/utilities/displayText';
import { generateFlashCards } from '../../../../common/utilities/generateResources';
import {
  FlexBox,
  GeneratingIndicator,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Sheet,
  Spacer,
} from '../../../../components';
import SapientorConversationMessage from '../../../../components/content/SapientorConversationMessage';

import { useSelectedLearningUnit } from '../../../../common/hooks/useSelectedLearningUnit';
import { updateLearningUnitType } from '../../functions/updateLearningUnitType';
import PreviewFlashcard from '../flashcard-sets/PreviewFlashcard';

type Flashcard = {
  question: string;
  answer: string;
};

const StyledPreviewCardsWrapper = styled.div`
  ${tw`w-full md:px-4`}
`;

const GenerateFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_FLASHCARDS_STORY);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const {
    selectedLearningUnitText,
    selectedLearningUnitId,
    selectedLearningUnitType,
    selectedLearningUnitEntity,
    selectedLearningUnitTitle,
  } = useSelectedLearningUnit();
  const { selectedLanguage } = useSelectedLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const { userId } = useUserData();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const generateFlashcards = async () => {
      if (selectedLearningUnitText === '') {
        setMessage('Bitte füge erst Text hinzu, um Karteikarten zu generieren.');
        setGeneratedFlashcards([]);
        setIsGenerating(false);
        return;
      }
      setIsGenerating(true);
      const flashcards = await generateFlashCards(lsc, `${selectedLearningUnitTitle}: ${selectedLearningUnitText}`);
      setIsGenerating(false);
      setMessage('Passen die Karteikarten so für dich?<br/> <br/> ');
      setTimeout(() => {
        setGeneratedFlashcards(flashcards);
      }, 200);
    };

    if (isVisible && generatedFlashcards.length === 0) {
      generateFlashcards();
    } else if (!isVisible) {
      setGeneratedFlashcards([]);
    }
  }, [isVisible, selectedLearningUnitText]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_SET_STORY);

  const saveFlashcards = async () => {
    navigateBack();

    if (!selectedLearningUnitId) return;

    if (selectedLearningUnitType === LearningUnitType.NOTE && selectedLearningUnitEntity) {
      updateLearningUnitType(selectedLearningUnitEntity, userId, LearningUnitType.MIXED);
    }

    const newFlashcardEntities = generatedFlashcards
      .filter((flashcard) => flashcard.answer && flashcard.question)
      .map((flashcard) => {
        const flashcardId = v4();

        const newFlashcardEntity = new Entity();
        newFlashcardEntity.add(new IdentifierFacet({ guid: flashcardId }));
        newFlashcardEntity.add(new ParentFacet({ parentId: selectedLearningUnitId }));
        newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
        newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
        newFlashcardEntity.add(new MasteryLevelFacet({ masteryLevel: 0 }));
        newFlashcardEntity.add(DataType.FLASHCARD);

        return newFlashcardEntity;
      });

    addFlashcards(lsc, newFlashcardEntities, userId);
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {generatedFlashcards.length > 0 && (
          <PrimaryButton onClick={saveFlashcards}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      {isGenerating && <GeneratingIndicator />}
      <ScrollableBox>
        {!isGenerating && (
          <SapientorConversationMessage
            message={{
              role: 'gpt',
              message: message,
            }}
          />
        )}
        <StyledPreviewCardsWrapper>
          {generatedFlashcards.map((flashcard, index) => (
            <PreviewFlashcard
              updateFlashcard={(flashcard) =>
                setGeneratedFlashcards([
                  ...generatedFlashcards.slice(0, index),
                  flashcard,
                  ...generatedFlashcards.slice(index + 1),
                ])
              }
              key={index}
              flashcard={flashcard}
            />
          ))}
        </StyledPreviewCardsWrapper>
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateFlashcardsSheet;
