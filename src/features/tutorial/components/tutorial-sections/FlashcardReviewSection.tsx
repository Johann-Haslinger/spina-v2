import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 as uuid } from 'uuid';
import { useTimer } from '../../../../common/hooks';
import { useUserData } from '../../../../common/hooks/useUserData';
import {
  AnswerFacet,
  AnswerProps,
  DateAddedFacet,
  DueDateFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
  MasteryLevelFacet,
  QuestionFacet,
  QuestionProps,
} from '../../../../common/types/additionalFacets';
import { MAX_MASTERY_LEVEL, MIN_MASTERY_LEVEL } from '../../../../common/types/constants';
import { AdditionalTag, DataType, SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { GeneratedFlashcardSetResource } from '../../../../common/types/types';
import { addNotificationEntity } from '../../../../common/utilities';
import { CloseButton, FlexBox, NavigationButton, Sheet, Spacer } from '../../../../components';
import supabaseClient from '../../../../lib/supabase';
import { useDueFlashcards } from '../../../flashcards';
import { TutorialState } from '../../types';

const StyledTitle = styled.p`
  ${tw`text-2xl font-bold`}
`;

export const FlashcardReviewSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
  flashcardSet: GeneratedFlashcardSetResource | null;
}) => {
  const { tutorialState, setTutorialState, flashcardSet } = props;
  const isVisible = tutorialState == TutorialState.REVIEWING_FLASHCARDS;
  const [isFlashcardQuzVisible, setIsFlashcardQuizVisible] = useState(false);
  console.log('isFlashcardQuzVisible', isFlashcardQuzVisible);
  const positionX = isVisible
    ? 0
    : [
          TutorialState.INTRODUCTION,
          TutorialState.SELECTING_IMAGE,
          TutorialState.GENERATING_FLASHCARDS,
          TutorialState.DISPLAYING_FLASHCARDS,
          TutorialState.SAVING_FLASHCARDS,
          TutorialState.ADDING_SCHOOL_SUBJECTS,
        ].includes(tutorialState)
      ? 600
      : -600;

  const openFlashcardQuiz = () => setIsFlashcardQuizVisible(true);
  const closeFlashcardQuiz = () => {
    setIsFlashcardQuizVisible(false);
    setTimeout(() => setTutorialState(TutorialState.EXPLAINING_FLASHCARD_BENEFITS), 300);
  };

  return (
    flashcardSet &&
    positionX !== 600 && (
      <div>
        <motion.div
          initial={{ opacity: 0, x: positionX }}
          animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
          transition={{
            type: 'tween',
            duration: 0.3,
          }}
          tw="w-screen h-screen px-4 absolute left-0 top-0 flex justify-center"
        >
          <FlexBox tw="p-4 text-secondary-text absolute top-0 left-0 w-screen">
            <div />
            <div onClick={() => setTutorialState(TutorialState.EXPLAINING_OVERVIEW)} tw="text-secondary-text text-sm">
              Überspringen
            </div>
          </FlexBox>

          <div tw="md:w-96  pb-14 h-full flex flex-col justify-between md:justify-start pt-20 md:pt-32 lg:pt-48 xl:pt-60">
            <div>
              <StyledTitle>Lernkarten abfragen</StyledTitle>
              <p tw="mt-4  md:mt-6">
                Deine ersten Lernkarten sind mit Spina erstellt, aber jetzt fehlt noch das Wichtigste – das Abfragen!
              </p>
            </div>
            <NavigationButton onClick={openFlashcardQuiz}>Abfrage starten</NavigationButton>
          </div>
        </motion.div>

        <FlashcardQuiz
          isVisible={isFlashcardQuzVisible}
          navigateBack={closeFlashcardQuiz}
          flashcardSet={flashcardSet}
        />
      </div>
    )
  );
};

const calculateDueDate = (flashcardEntity: Entity): Date | null => {
  const now = new Date();
  if (flashcardEntity.has(AdditionalTag.REMEMBERED_EASILY)) {
    now.setDate(now.getDate() + 4);
  } else if (flashcardEntity.has(AdditionalTag.REMEMBERED_WITH_EFFORT)) {
    now.setDate(now.getDate() + 1);
  } else if (flashcardEntity.has(AdditionalTag.PARTIALLY_REMEMBERED)) {
    now.setHours(now.getHours() + 12);
  } else if (flashcardEntity.has(AdditionalTag.FORGOT)) {
    return now;
  } else if (flashcardEntity.has(AdditionalTag.SKIP)) {
    now.setHours(now.getHours() + 1);
  } else {
    return null;
  }
  return now;
};

const calculateMasteryLevel = (flashcardEntity: Entity, currentMasteryLevel: number): number => {
  if (currentMasteryLevel === MAX_MASTERY_LEVEL && !flashcardEntity.has(AdditionalTag.FORGOT)) {
    return MAX_MASTERY_LEVEL;
  } else if (
    flashcardEntity.has(AdditionalTag.REMEMBERED_EASILY) ||
    flashcardEntity.has(AdditionalTag.REMEMBERED_WITH_EFFORT) ||
    flashcardEntity.has(AdditionalTag.PARTIALLY_REMEMBERED)
  ) {
    return currentMasteryLevel + 1;
  } else if (flashcardEntity.has(AdditionalTag.FORGOT)) {
    return MIN_MASTERY_LEVEL;
  }
  return currentMasteryLevel;
};

const updateFlashcardsDueDateAndMasteryLevel = async (
  lsc: ILeanScopeClient,
  flashcardEntities: Entity[],
  userId: string,
  dueFlashcardEntity?: Entity,
) => {
  const updatedFlashcards: {
    id: string;
    user_id: string;
    due_date: string;
    parent_id: string;
    mastery_level: number;
  }[] = [];

  flashcardEntities.forEach((flashcardEntity) => {
    const id = flashcardEntity.get(IdentifierFacet)?.props.guid;
    const parentId = flashcardEntity.get(ParentFacet)?.props.parentId || '';
    const flashcardInLsc = lsc.engine.entities.find((e) => e.get(IdentifierFacet)?.props.guid === id);

    if (!id) return;

    const dueDate = calculateDueDate(flashcardEntity);
    const masteryLevel = flashcardEntity.get(MasteryLevelFacet)?.props.masteryLevel || 0;
    const newMasterLevel = calculateMasteryLevel(flashcardEntity, masteryLevel);

    flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
    flashcardInLsc?.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));

    if (dueDate) {
      flashcardInLsc?.add(new DueDateFacet({ dueDate: dueDate.toISOString() }));
      updatedFlashcards.push({
        id,
        user_id: userId,
        due_date: dueDate.toISOString(),
        parent_id: parentId,
        mastery_level: newMasterLevel,
      });
    }
  });

  dueFlashcardEntity?.add(
    new CountFacet({
      count:
        flashcardEntities.length -
        flashcardEntities.filter(
          (e) =>
            e.has(AdditionalTag.REMEMBERED_WITH_EFFORT) ||
            e.has(AdditionalTag.REMEMBERED_EASILY) ||
            e.has(AdditionalTag.SKIP) ||
            e.has(AdditionalTag.PARTIALLY_REMEMBERED),
        ).length,
    }),
  );

  try {
    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .upsert(updatedFlashcards, { onConflict: SupabaseColumn.ID });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Flashcards:', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Aktualisieren der Lernkarten',
      message: (error as Error).message,
      type: 'error',
    });
  }
};

const saveFlashcardSession = async (
  lsc: ILeanScopeClient,
  flashcardEntities: Entity[],
  elapsedSeconds: number,
  userId: string,
) => {
  const reviewedFlashcardsCount = flashcardEntities.filter((e) =>
    [
      AdditionalTag.SKIP,
      AdditionalTag.FORGOT,
      AdditionalTag.PARTIALLY_REMEMBERED,
      AdditionalTag.REMEMBERED_WITH_EFFORT,
      AdditionalTag.REMEMBERED_EASILY,
    ].some((tag) => e.has(tag)),
  ).length;

  if (reviewedFlashcardsCount === 0 || !userId) return;

  try {
    const elapsedMinutes = Math.ceil(elapsedSeconds / 60);
    const flashcardPerformance = {
      skip: flashcardEntities.filter((e) => e.has(AdditionalTag.SKIP)).length,
      forgot: flashcardEntities.filter((e) => e.has(AdditionalTag.FORGOT)).length,
      partiallyRemembered: flashcardEntities.filter((e) => e.has(AdditionalTag.PARTIALLY_REMEMBERED)).length,
      rememberedWithEffort: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_WITH_EFFORT)).length,
      easilyRemembered: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_EASILY)).length,
    };

    const newFlashcardSession = {
      id: uuid(),
      user_id: userId,
      session_date: new Date().toISOString(),
      duration: elapsedMinutes,
      flashcard_count: reviewedFlashcardsCount,
      ...flashcardPerformance,
    };

    const { error } = await supabaseClient.from(SupabaseTable.FLASHCARD_SESSIONS).insert([newFlashcardSession]);

    if (error) {
      console.error('Error adding flashcard session:', error);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Hinzufügen der Lernkartensession',
        message: `Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut: ${error.message}`,
        type: 'error',
      });
      return;
    }

    const newSessionEntity = new Entity();
    lsc.engine.addEntity(newSessionEntity);
    newSessionEntity.add(new IdentifierFacet({ guid: newFlashcardSession.id }));
    newSessionEntity.add(new DateAddedFacet({ dateAdded: newFlashcardSession.session_date }));
    newSessionEntity.add(new FlashcardCountFacet({ flashcardCount: newFlashcardSession.flashcard_count }));
    newSessionEntity.add(new DurationFacet({ duration: newFlashcardSession.duration }));
    newSessionEntity.add(new FlashcardPerformanceFacet({ flashcardPerformance }));
    newSessionEntity.addTag(DataType.FLASHCARD_SESSION);
  } catch (error) {
    console.error('Unexpected error:', error);
    addNotificationEntity(lsc, {
      title: 'Unerwarteter Fehler',
      message: `Etwas ist schiefgelaufen: ${(error as Error).message}`,
      type: 'error',
    });
  }
};

const FlashcardQuiz = (props: {
  isVisible: boolean;
  navigateBack: () => void;
  flashcardSet: GeneratedFlashcardSetResource;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { isVisible, navigateBack, flashcardSet } = props;
  const flashcardEntities = useFlashcardEntitiesForQuiz(flashcardSet);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const { userId } = useUserData();
  const { elapsedTime, startTimer, stopTimer } = useTimer();
  const { dueFlashcardEntity } = useDueFlashcards();

  useTimerStart(isVisible, startTimer);

  const navigateToNextFlashcard = () => setCurrentFlashcardIndex((prevIndex) => prevIndex + 1);

  const endFlashcardQuiz = () => {
    stopTimer();
    updateFlashcardsDueDateAndMasteryLevel(lsc, flashcardEntities, userId, dueFlashcardEntity);
    saveFlashcardSession(lsc, flashcardEntities, elapsedTime, userId);
    navigateBack();
  };

  return (
    <Sheet visible={isVisible} navigateBack={() => {}}>
      <FlexBox>
        <div /> <CloseButton onClick={endFlashcardQuiz} />
      </FlexBox>
      <Spacer />
      {flashcardEntities.map((flashcardEntity, idx) => (
        <Flashcard
          key={idx}
          entity={flashcardEntity}
          question={flashcardEntity.get(QuestionFacet)?.props.question || ''}
          answer={flashcardEntity.get(AnswerFacet)?.props.answer || ''}
          navigateToNextFlashcard={navigateToNextFlashcard}
          viewState={idx === currentFlashcardIndex ? 'visible' : idx > currentFlashcardIndex ? 'left' : 'right'}
        />
      ))}
      <FlashcardQuizEnd isVisible={currentFlashcardIndex === flashcardEntities.length} endQuiz={endFlashcardQuiz} />
    </Sheet>
  );
};

const useTimerStart = (isVisible: boolean, startTimer: () => void) => {
  useEffect(() => {
    if (isVisible) {
      startTimer();
    }
  }, [isVisible]);
};

const StyledFlashcardCellContainer = styled(motion.div)`
  ${tw` overflow-hidden  mx-auto 2xl:h-[70%] md:h-[80%]  mt-[8%] md:mt-[8%] 2xl:mt-[8%] h-[94%] md:w-8/12 2xl:w-6/12  items-center top-0 pb-14  flex justify-center absolute w-full `}
`;

const StyledFlashcardWrapper = styled(motion.div)`
  ${tw`bg-white overflow-y-scroll dark:text-white  dark:bg-opacity-5 mx-auto py-16  cursor-pointer flex items-center  w-11/12 md:w-3/4 xl:w-2/3 2xl:w-1/2 lg:w-2/3 h-60  p-4 rounded-2xl`}
`;

const StyledQuestionText = styled.div`
  ${tw`text-lg py-4 text-center mx-auto w-fit font-bold `}
`;

const StyledAnswerText = styled.div`
  ${tw`text-lg py-4 text-center mx-auto w-fit scale-x-[-1]  `}
`;

const StyledNavButtonContainer = styled.div`
  ${tw`flex w-[95%] xl:w-1/3 md:w-2/5  absolute bottom-8 sm:bottom-[10%] lg:bottom-[10%] 2xl:bottom-[14%] xl:right-1/3 md:right-[30%] xl:left-1/3 md:left-[30%] left-[2.5%] right-[2.5%] space-x-1 `}
`;

const StyledNavButtonAreaWrapper = styled.div`
  ${tw`flex  space-x-1  w-full text-xl md:text-2xl  justify-between dark:bg-opacity-5 bg-white  bg-opacity-40 p-1   rounded-xl md:rounded-2xl  `}
`;

const StyledNavButton = styled.div`
  ${tw`w-1/5 space-y-0.5  h-fit py-2.5 flex justify-center flex-col items-center rounded-lg md:rounded-xl lg:hover:opacity-70 transition-all dark:bg-opacity-5 bg-white `}
`;

const StyledLabel = styled.div`
  ${tw`text-xs dark:text-secondary-text-dark text-secondary-text  line-clamp-1`}
`;

interface FlashcardProps extends AnswerProps, QuestionProps, EntityProps {
  navigateToNextFlashcard: () => void;
  viewState: 'visible' | 'left' | 'right';
}

const Flashcard = (props: FlashcardProps) => {
  const { question, answer, navigateToNextFlashcard, viewState, entity } = props;
  const isVisible = viewState === 'visible';
  const [isFlipped, setIsFlipped] = useState(false);
  const isDisplayed = useIsDisplayed(isVisible);

  const handleNavigateToNextFlashcardClick = (
    buttonClick: 'skip' | 'forgot' | 'partiallyRemembered' | 'rememberedWithEffort' | 'rememberedEasily',
  ) => {
    if (buttonClick === 'skip') {
      entity.add(AdditionalTag.SKIP);
    } else if (buttonClick === 'forgot') {
      entity.add(AdditionalTag.FORGOT);
    } else if (buttonClick === 'partiallyRemembered') {
      entity.add(AdditionalTag.PARTIALLY_REMEMBERED);
    } else if (buttonClick === 'rememberedWithEffort') {
      entity.add(AdditionalTag.REMEMBERED_WITH_EFFORT);
    } else if (buttonClick === 'rememberedEasily') {
      entity.add(AdditionalTag.REMEMBERED_EASILY);
    }

    navigateToNextFlashcard();
  };

  return (
    isDisplayed && (
      <div>
        <StyledFlashcardCellContainer transition={{ type: 'just' }}>
          <div tw="relative right-8 h-full w-full overflow-hidden">
            <motion.div
              tw="w-full h-full flex justify-center items-center"
              transition={{ type: 'just' }}
              initial={{
                x: -600,
                opacity: 0,
              }}
              animate={{
                x: isVisible ? 0 : viewState == 'right' ? 600 : -600,
                opacity: isDisplayed ? 1 : 0,
              }}
            >
              <StyledFlashcardWrapper
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                whileHover={{ scale: 1.05 }}
                style={{
                  transformStyle: 'flat',
                  transition: 'flat',
                  transform: 'translateZ(0)',
                }}
                onClick={() => setIsFlipped((prev) => !prev)}
              >
                {isFlipped ? (
                  <StyledAnswerText>{answer}</StyledAnswerText>
                ) : (
                  <StyledQuestionText>{question}</StyledQuestionText>
                )}
              </StyledFlashcardWrapper>
            </motion.div>
          </div>
        </StyledFlashcardCellContainer>
        {isVisible && (
          <StyledNavButtonContainer>
            {isFlipped ? (
              <StyledNavButtonAreaWrapper>
                <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('skip')}>
                  <div>⏩</div>
                  <StyledLabel>1 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('forgot')}>
                  <div>❌</div> <StyledLabel>1 min</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('partiallyRemembered')}>
                  <div>🤔</div> <StyledLabel>12 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('rememberedWithEffort')}>
                  <div>😀</div> <StyledLabel>24 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('rememberedEasily')}>
                  <div>👑</div> <StyledLabel>4 Tage</StyledLabel>
                </StyledNavButton>
              </StyledNavButtonAreaWrapper>
            ) : (
              <StyledNavButtonAreaWrapper>
                <StyledNavButton tw="w-full" onClick={() => setIsFlipped((prev) => !prev)}>
                  <div>🔄</div>
                  <StyledLabel>Antwort</StyledLabel>
                </StyledNavButton>
              </StyledNavButtonAreaWrapper>
            )}
          </StyledNavButtonContainer>
        )}
      </div>
    )
  );
};

const useIsDisplayed = (isVisible: boolean) => {
  const [isDisplayed, setIsDisplayed] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 200);
    }
  }, [isVisible]);

  return isDisplayed;
};

const useFlashcardEntitiesForQuiz = (flashcardSet: GeneratedFlashcardSetResource) => {
  const [flashcardEntities, setFlashcardEntities] = useState<Entity[]>([]);

  useEffect(() => {
    const fetchFlashcardEntities = async () => {
      // const { data: flashcards, error } = await supabaseClient
      //   .from(SupabaseTable.FLASHCARDS)
      //   .select('question, answer, id')
      //   .eq('parentId', flashcardSet.id);

      // if (error) {
      //   console.error('Error fetching flashcards:', error);
      // }
      const flashcards = flashcardSet.flashcards;
      const flashcardEntities = flashcards?.map((flashcard, idx) => {
        const newFlashcardEntity = new Entity();
        newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
        newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
        // newFlashcardEntity.add(new IdentifierFacet({ guid: flashcard.id|| idx }));
        newFlashcardEntity.add(new IdentifierFacet({ guid: idx.toString() }));

        return newFlashcardEntity;
      });

      if (!flashcardEntities) return;

      setFlashcardEntities(flashcardEntities);
    };

    fetchFlashcardEntities();
  }, [flashcardSet]);

  return flashcardEntities;
};

const FlashcardQuizEnd = (props: { isVisible: boolean; endQuiz: () => void }) => {
  const { isVisible } = props;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    isVisible && (
      <StyledFlashcardCellContainer transition={{ type: 'just' }}>
        <div tw="relative right-8 h-full w-full overflow-hidden">
          <motion.div
            tw="w-full h-full flex justify-center items-center"
            transition={{ type: 'just' }}
            initial={{
              x: -600,
              opacity: 0,
            }}
            animate={{
              x: isVisible ? 0 : -600,
              opacity: isVisible ? 1 : 0,
            }}
          >
            <StyledFlashcardWrapper
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              whileHover={{ scale: 1.05 }}
              style={{
                transformStyle: 'flat',
                transition: 'flat',
                transform: 'translateZ(0)',
              }}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              {isFlipped ? (
                <div tw="w-full flex flex-col items-center">
                  <StyledAnswerText>
                    <p tw="font-semibold ">Glückwunsch!</p>
                    <br />
                    <p tw="w-2/3 mx-auto relative bottom-4">
                      Du hast alle Lernkarten durchgearbeitet. Klicke auf das X Symbol, um die Lernsession zu beenden
                    </p>
                  </StyledAnswerText>
                </div>
              ) : (
                <div tw="text-9xl w-full flex justify-center text-primary-color">
                  <IoCheckmarkCircleOutline />
                </div>
              )}
            </StyledFlashcardWrapper>
          </motion.div>
        </div>
      </StyledFlashcardCellContainer>
    )
  );
};
