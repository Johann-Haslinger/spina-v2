import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoAdd, IoColorWandOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { DiscardUnsavedChangesAlert } from '../../../../common/components/others';
import { useImageSelector, useInputFocus } from '../../../../common/hooks';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useSelectedLearningUnit } from '../../../../common/hooks/useSelectedLearningUnit';
import { useUserData } from '../../../../common/hooks/useUserData';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from '../../../../common/types/additionalFacets';
import { DataType, LearningUnitType, Story, SupabaseEdgeFunction } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { addFlashcards } from '../../../../common/utilities/addFlashcards';
import { displayButtonTexts } from '../../../../common/utilities/displayText';
import { generateFlashCards } from '../../../../common/utilities/generateResources';
import {
  FlexBox,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
} from '../../../../components';
import GeneratingIndicator from '../../../../components/content/GeneratingIndicator';
import supabaseClient from '../../../../lib/supabase';
import { updateLearningUnitType } from '../../functions/updateLearningUnitType';
import { useDiscardAlertState } from '../../hooks/useDiscardAlertState';
import PreviewFlashcard from './PreviewFlashcard';

type Flashcard = {
  question: string;
  answer: string;
};

enum AddFlashcardsMethods {
  ADDING_FLASHCARDS_MANUALLY,
  GENERATING_FLASHCARDS_FROM_TEXT,
  GENRATING_FLASHCARDS_FROM_IMAGE,
  IMPORT_FLASHCARDS,
  DONE,
}

const AddFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_FLASHCARDS_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const { selectedLearningUnitId, selectedLearningUnitType, selectedLearningUnitEntity } = useSelectedLearningUnit();
  const [addFlashcardsMethod, setAddFlashcardsMethod] = useState<AddFlashcardsMethods | undefined>(undefined);
  const { userId } = useUserData();
  const [generateFlashcardsPrompt, setGenerateFlashcardsPrompt] = useState('');
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const { openImagePicker } = useImageSelector((image) => generateFlashcardsFromImage(image));
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert } = useDiscardAlertState();
  const hasUnsavedChanges = flashcards.length > 0;

  useInputFocus(textAreaRef, addFlashcardsMethod == AddFlashcardsMethods.GENERATING_FLASHCARDS_FROM_TEXT);

  const generateFlashcardsFromImage = async (image: string) => {
    setIsGeneratingFlashcards(true);
    const session = await supabaseClient.auth.getSession();

    const { data: flashcardsData, error } = await supabaseClient.functions.invoke(
      SupabaseEdgeFunction.GENERATE_FLASHCARDS,
      {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: { base64_image: image },
      },
    );

    if (error) {
      console.error('Error generating completion:', error.message);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Erzeugen der Lernkarten',
        message: error.message + ' ' + error.details + ' ' + error.hint,
        type: 'error',
      });
    }

    const generatedFlashcards: { answer: string; question: string }[] = JSON.parse(flashcardsData).cards;
    setFlashcards(generatedFlashcards);
    setIsGeneratingFlashcards(false);
    setAddFlashcardsMethod(AddFlashcardsMethods.DONE);
  };

  useEffect(() => {
    if (flashcards[flashcards.length - 1] && flashcards[flashcards.length - 1].answer !== '') {
      setFlashcards([...flashcards, { question: '', answer: '' }]);
    }
  }, [flashcards[flashcards.length - 1]]);

  useEffect(() => {
    setAddFlashcardsMethod(undefined);
    setGenerateFlashcardsPrompt('');
    setFlashcards([]);
  }, [isVisible]);

  const navigateBack = () => {
    closeDiscardAlert();
    lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_SET_STORY);
  };

  const saveFlashcards = async () => {
    navigateBack();

    if (selectedLearningUnitType == LearningUnitType.NOTE && selectedLearningUnitEntity) {
      updateLearningUnitType(selectedLearningUnitEntity, userId, LearningUnitType.MIXED);
    }

    const parentId = selectedLearningUnitId;

    if (parentId) {
      const newFlashcardEntities = flashcards
        .filter((e) => e.answer !== '' && e.question !== '')
        .map((flashcard) => {
          const flashcardId = v4();

          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: flashcardId }));
          newFlashcardEntity.add(new ParentFacet({ parentId: parentId }));
          newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          newFlashcardEntity.add(new MasteryLevelFacet({ masteryLevel: 0 }));
          newFlashcardEntity.add(DataType.FLASHCARD);

          return newFlashcardEntity;
        });

      addFlashcards(lsc, newFlashcardEntities, userId);
    }
  };

  const handleGenerateFlashcards = async () => {
    setIsGeneratingFlashcards(true);
    const flashcards = await generateFlashCards(lsc, generateFlashcardsPrompt);
    setFlashcards(flashcards);
    setIsGeneratingFlashcards(false);
    setAddFlashcardsMethod(AddFlashcardsMethods.DONE);
  };

  const handleBackClick = () => (hasUnsavedChanges ? openDiscardAlert() : navigateBack());

  return (
    <div>
      <Sheet navigateBack={handleBackClick} visible={isVisible}>
        <FlexBox>
          <SecondaryButton onClick={handleBackClick}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
          {flashcards.length > 0 && (
            <PrimaryButton onClick={saveFlashcards}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
          )}
        </FlexBox>
        <Spacer />
        {addFlashcardsMethod == undefined && !isGeneratingFlashcards && (
          <div>
            <Section>
              <SectionRow
                last
                onClick={() => {
                  setAddFlashcardsMethod(AddFlashcardsMethods.ADDING_FLASHCARDS_MANUALLY);
                  setFlashcards([{ question: '', answer: '' }]);
                }}
                role="button"
                icon={<IoAdd />}
              >
                Karten manuell hinzufügen
              </SectionRow>
            </Section>
            <Spacer size={2} />
            <Section>
              <SectionRow
                onClick={() => setAddFlashcardsMethod(AddFlashcardsMethods.GENERATING_FLASHCARDS_FROM_TEXT)}
                role="button"
                icon={<IoAdd />}
              >
                Karten aus Text erzeugen
              </SectionRow>
              <SectionRow last onClick={openImagePicker} role="button" icon={<IoAdd />}>
                Karten aus Bild erzeugen
              </SectionRow>
            </Section>
          </div>
        )}
        {addFlashcardsMethod == AddFlashcardsMethods.GENERATING_FLASHCARDS_FROM_TEXT && !isGeneratingFlashcards && (
          <Fragment>
            <Section>
              <SectionRow last>
                <TextAreaInput
                  ref={textAreaRef}
                  placeholder="Worüber möchtest du Karten erzeugen?"
                  onChange={(e) => setGenerateFlashcardsPrompt(e.target.value)}
                />
              </SectionRow>
            </Section>
            <Spacer size={2} />
            {generateFlashcardsPrompt && (
              <Section>
                <SectionRow role="button" icon={<IoColorWandOutline />} last onClick={handleGenerateFlashcards}>
                  Karteikarten erzuegen
                </SectionRow>
              </Section>
            )}
          </Fragment>
        )}
        {isGeneratingFlashcards && <GeneratingIndicator />}
        <ScrollableBox>
          {flashcards.map((flashcard, index) => (
            <PreviewFlashcard
              isFocused={index === 0}
              updateFlashcard={(flashcard) =>
                setFlashcards([...flashcards.slice(0, index), flashcard, ...flashcards.slice(index + 1)])
              }
              key={index}
              flashcard={flashcard}
            />
          ))}
        </ScrollableBox>
      </Sheet>

      <DiscardUnsavedChangesAlert isVisible={isDiscardAlertVisible} cancel={closeDiscardAlert} close={navigateBack} />
    </div>
  );
};

export default AddFlashcardsSheet;
