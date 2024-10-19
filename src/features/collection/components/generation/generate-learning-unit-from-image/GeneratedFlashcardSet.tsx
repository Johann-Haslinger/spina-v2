import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import tw from 'twin.macro';
import { v4 as uuid } from 'uuid';
import { useUserData } from '../../../../../common/hooks/useUserData';
import {
  AnswerFacet,
  DateAddedFacet,
  LearningUnitTypeFacet,
  PriorityFacet,
  QuestionFacet,
  TitleFacet,
} from '../../../../../common/types/additionalFacets';
import { DataType, LearningUnitPriority, LearningUnitType, Story } from '../../../../../common/types/enums';
import { Flashcard, GeneratedFlashcardSetResource } from '../../../../../common/types/types';
import { addFlashcards } from '../../../../../common/utilities/addFlashcards';
import { addLearningUnit } from '../../../../../common/utilities/addLeaningUnit';
import { CloseButton, FlexBox, ScrollableBox } from '../../../../../components';
import SapientorConversationMessage from '../../../../../components/content/SapientorConversationMessage';
import { findMatchingTopicForLearningUnit } from '../../../functions/findMatchingTopicForLearningUnit';
import { useSelectedTopic } from '../../../hooks/useSelectedTopic';
import PreviewFlashcard from '../../flashcard-sets/PreviewFlashcard';

const StyledPreviewCardsWrapper = styled.div`
  ${tw`w-full`}
`;

const GeneratedFlashcardSet = (props: {
  generatedFlashcardSet: GeneratedFlashcardSetResource;
  isVisible: boolean;
  regenerateFlashcards: () => void;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const {
    generatedFlashcardSet: { flashcards, title },
    isVisible,
    regenerateFlashcards,
  } = props;
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>(flashcards);
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();
  const isFlashcardSetEmpty = generatedFlashcards.length === 0;
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const navigateBack = () => lsc.stories.transitTo(Story.ANY);

  const saveLearningUnit = () => {
    navigateBack();

    const parentId = selectedTopicId || selectedParentId;
    const learningUnitId = uuid();

    const newLearningUnitEntity = new Entity();
    newLearningUnitEntity.add(new IdentifierFacet({ guid: learningUnitId }));
    newLearningUnitEntity.add(new TitleFacet({ title: title }));
    newLearningUnitEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.FLASHCARD_SET }));
    newLearningUnitEntity.add(new ParentFacet({ parentId: parentId || '' }));
    newLearningUnitEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    newLearningUnitEntity.add(new PriorityFacet({ priority: LearningUnitPriority.ACTIVE }));
    newLearningUnitEntity.add(DataType.LEARNING_UNIT);
    newLearningUnitEntity.add(Tags.SELECTED);

    addLearningUnit(lsc, newLearningUnitEntity, userId);

    const flashcardEntities = generatedFlashcards.map((flashcard) => {
      const flashcardEntity = new Entity();
      flashcardEntity.add(new IdentifierFacet({ guid: uuid() }));
      flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
      flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
      flashcardEntity.add(new ParentFacet({ parentId: learningUnitId }));

      return flashcardEntity;
    });

    addFlashcards(lsc, flashcardEntities, userId);
  };

  const checkParentId = () => {
    if (selectedTopicId) {
      saveLearningUnit();
    } else {
      const learningUnitContent =
        title + ' ' + generatedFlashcards.map((flashcard) => flashcard.question + ' = ' + flashcard.answer).join(' ');
      const parentId = findMatchingTopicForLearningUnit(learningUnitContent);
      setSelectedParentId(parentId);
    }
  };

  return (
    <motion.div tw="md:px-4 pt-1 h-full w-full">
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>

      {isVisible && (
        <ScrollableBox>
          <SapientorConversationMessage
            message={{
              role: 'gpt',
              message: isFlashcardSetEmpty
                ? 'Leider konnte aus deinem Bild keine Notiz generiert werden. Bitte versuche es mit einem anderen Bild erneut.'
                : 'Passt das so für dich?  <br/><br/>',
              specialContent: (
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
              ),
              suggestions: !isFlashcardSetEmpty
                ? [
                    {
                      answer: 'Ja, das passt!',
                      func: checkParentId,
                    },
                    {
                      answer: 'Nein, kannst du das nochmal generieren?',
                      func: regenerateFlashcards,
                    },
                  ]
                : [],
            }}
          />
        </ScrollableBox>
      )}
    </motion.div>
  );
};

export default GeneratedFlashcardSet;
