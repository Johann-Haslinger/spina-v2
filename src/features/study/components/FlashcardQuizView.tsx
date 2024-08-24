import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { Fragment, useContext, useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline, IoChevronBack, IoFileTray, IoHeadset } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import {
  AnswerFacet,
  DateAddedFacet,
  DateUpdatedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
  QuestionFacet,
  StreakFacet,
} from '../../../app/additionalFacets';
import { AdditionalTags, DataType, Story, SupabaseColumns, SupabaseTables } from '../../../base/enums';
import { FlexBox, View } from '../../../components';
import { useIsAnyStoryCurrent } from '../../../hooks/useIsAnyStoryCurrent';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { useTimer } from '../../../hooks/useTimer';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { displayButtonTexts, displayLabelTexts } from '../../../utils/displayText';
import { dataTypeQuery } from '../../../utils/queries';
import { useSeletedFlashcardGroup } from '../../collection/hooks/useSelectedFlashcardGroup';
import { useSelectedSchoolSubjectColor } from '../../collection/hooks/useSelectedSchoolSubjectColor';
import { useSelectedSubtopic } from '../../collection/hooks/useSelectedSubtopic';
import { useBookmarkedFlashcardGroups } from '../hooks/useBookmarkedFlashcardGroups';
const fetchFlashcardsByDue = async () => {
  // const { data: flashcards, error } = await supabaseClient
  //   .from(SupabaseTables.FLASHCARDS)
  //   .select('answer, question, id')
  //   .lt('dueDate', new Date());

  // if (error) {
  //   console.error('Error fetching flashcards:', error);
  //   return [];
  // }

  const flashcards = [
    {
      id: '1',
      question: 'Was ist die Hauptstadt von Deutschland?',
      answer: 'Berlin',
    },
    {
      id: '2',
      question: 'Was ist die Hauptstadt von Frankreich?',
      answer: 'Paris',
    },
    {
      id: '3',
      question: 'Was ist die Hauptstadt von Italien?',
      answer: 'Rom',
    },
  ];

  const flashcardsEntities = flashcards?.map((flashcard) => {
    const entity = new Entity();
    entity.add(new IdentifierFacet({ guid: flashcard.id }));
    entity.add(new QuestionFacet({ question: flashcard.question }));
    entity.add(new AnswerFacet({ answer: flashcard.answer }));
    entity.add(DataType.FLASHCARD);
    return entity;
  });

  return flashcardsEntities || [];
};

const useFlashcardQuizEntities = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isBookmarkedQuiz = useIsStoryCurrent(Story.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY);
  const isSpacedRepetitionQuizVisible = useIsStoryCurrent(Story.OBSERVING_SPACED_REPETITION_QUIZ);
  const { bookmarkedFlashcardGroupEntities } = useBookmarkedFlashcardGroups();
  const [allFlashcardEntities] = useEntities((e) => dataTypeQuery(e, DataType.FLASHCARD));
  const { selectedFlashcardGroupId } = useSeletedFlashcardGroup();
  const { selectedSubtopicId } = useSelectedSubtopic();
  const [selectedFlashcardEntities, setSelectedFlashcardEntities] = useState<readonly Entity[]>([]);

  useEffect(() => {
    const selectFlashcardsForSession = async () => {
      if (isBookmarkedQuiz) {
        const flashcardEntities: Entity[] = [];
        bookmarkedFlashcardGroupEntities.forEach(async (bookmarkedFlashcardGroup) => {
          const id = bookmarkedFlashcardGroup.get(IdentifierFacet)?.props.guid;

          if (id) {
            const { data: flashcards, error } = await supabaseClient
              .from(SupabaseTables.FLASHCARDS)
              .select('answer, question, id')
              .eq(SupabaseColumns.PARENT_ID, id);
            if (error) {
              console.error('Error fetching flashcards:', error);
            }

            flashcards?.forEach((flashcard) => {
              const entity = new Entity();
              lsc.engine.addEntity(entity);
              flashcardEntities.push(entity);
              entity.add(new IdentifierFacet({ guid: flashcard.id }));
              entity.add(new QuestionFacet({ question: flashcard.question }));
              entity.add(new AnswerFacet({ answer: flashcard.answer }));
              entity.add(new ParentFacet({ parentId: id }));
              entity.add(DataType.FLASHCARD);
            });
          }
        });
        setSelectedFlashcardEntities(flashcardEntities);
      } else if (isSpacedRepetitionQuizVisible) {
        const sessionFlashcards = await fetchFlashcardsByDue();

        setSelectedFlashcardEntities(sessionFlashcards);
      } else {
        if (selectedSubtopicId) {
          setSelectedFlashcardEntities(
            allFlashcardEntities.filter(
              (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedSubtopicId,
            ),
          );
        } else if (selectedFlashcardGroupId) {
          setSelectedFlashcardEntities(
            allFlashcardEntities.filter(
              (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedFlashcardGroupId,
            ),
          );
        } else {
          setSelectedFlashcardEntities(allFlashcardEntities);
        }
      }
    };

    selectFlashcardsForSession();
  }, [
    selectedFlashcardGroupId,
    selectedSubtopicId,
    bookmarkedFlashcardGroupEntities,
    isBookmarkedQuiz,
    allFlashcardEntities.length,
    isSpacedRepetitionQuizVisible,
  ]);

  return selectedFlashcardEntities;
};

const StyledStatusBarWrapper = styled.div`
  ${tw` px-4 z-20 md:px-20 text-white absolute left-0 top-14 lg:top-20 w-full `}
`;

const StyledBackButtonWrapper = styled.div`
  ${tw`flex items-center cursor-pointer  md:hover:opacity-50 transition-all  space-x-1 pb-4`}
`;

const StyledBackButtonText = styled.div`
  ${tw`text-sm`}
`;
const StyledTalkingModeButton = styled.div`
  ${tw`transition-all cursor-pointer mb-4 md:hover:opacity-50 text-lg`}
`;

const StyledProgressBarWrapper = styled.div`
  ${tw`  bg-white overflow-hidden mb-4 h-fit w-full  rounded-full `}
`;
const StyledProgressBar = styled.div<{
  width?: number;
  backgroundColor: string;
}>`
  ${tw`transition-all bg-white  h-1 rounded-full`}
  width: ${(props) => props.width || 1}%;
  background-color: ${(props) => props.backgroundColor};
`;

const StyledFlashcardsStatusWrapper = styled.div`
  ${tw`flex mt-1.5 text-sm justify-between`}
`;
const StyledStatusText = styled.div`
  ${tw`text-sm`}
`;

const StyledFlashcardCountText = styled.div`
  ${tw`text-sm  mx-2`}
`;

const StyledQueriedFlashcardsStatusWrapper = styled.div`
  ${tw`flex items-center mt-1.5 text-sm`}
`;
const StyledRemaningFlashcardsStatusWrapper = styled.div`
  ${tw`flex  justify-end items-center mt-1.5 text-sm`}
`;

const formatElapsedTime = (timeInSeconds: number) => {
  const minutes = Math.ceil(timeInSeconds / 60);
  return `${minutes} ${minutes == 1 ? 'Minute' : 'Minuten'}`;
};

const FlashcardQuizView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { backgroundColor, accentColor } = useSelectedSchoolSubjectColor();
  const isVisible = useIsAnyStoryCurrent([
    Story.OBSERVING_FLASHCARD_QUIZ_STORY,
    Story.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY,
    Story.OBSERVING_SPACED_REPETITION_QUIZ,
  ]);
  const flashcardEntities = useFlashcardQuizEntities();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const { selectedLanguage } = useSelectedLanguage();
  const { elapsedTime, startTimer, stopTimer } = useTimer();
  const { selectedFlashcardGroupTitle } = useSeletedFlashcardGroup();
  const { userId } = useUserData();

  useEffect(() => {
    if (isVisible) {
      startTimer();
    }
    setCurrentFlashcardIndex(0);
  }, [isVisible]);

  useEffect(() => {
    if (currentFlashcardIndex === flashcardEntities.length) {
      stopTimer();
    }
  }, [currentFlashcardIndex]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_SET_STORY);

  const updateFlashcardsDueDate = async () => {
    const updatedFlashcards: {
      id: string;
      user_id: string;
      due_date: string;
    }[] = [];

    flashcardEntities.map((flashcardEntity) => {
      const id = flashcardEntity.get(IdentifierFacet)?.props.guid;

      if (!id) return;

      if (flashcardEntity.has(AdditionalTags.REMEMBERED_EASILY)) {
        const dueDate = new Date(new Date().setDate(new Date().getDate() + 4)).toISOString();
        updatedFlashcards.push({ id, user_id: userId, due_date: dueDate });
      } else if (flashcardEntity.has(AdditionalTags.REMEMBERED_WITH_EFFORT)) {
        const dueDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
        updatedFlashcards.push({ id, user_id: userId, due_date: dueDate });
      } else if (flashcardEntity.has(AdditionalTags.PARTIALLY_REMEMBERED)) {
        const dueDate = new Date(new Date().setHours(new Date().getHours() + 12)).toISOString();
        updatedFlashcards.push({ id, user_id: userId, due_date: dueDate });
      } else if (flashcardEntity.has(AdditionalTags.ANSWERD_WRONG)) {
        const dueDate = new Date(new Date().setMinutes(new Date().getMinutes() + 1)).toISOString();
        updatedFlashcards.push({ id, user_id: userId, due_date: dueDate });
      } else if (flashcardEntity.has(AdditionalTags.SKIP)) {
        const dueDate = new Date(new Date().setHours(new Date().getHours() + 1)).toISOString();
        updatedFlashcards.push({ id, user_id: userId, due_date: dueDate });
      }
    });

    const { error } = await supabaseClient
      .from(SupabaseTables.FLASHCARDS)
      .upsert(updatedFlashcards, { onConflict: SupabaseColumns.ID });

    if (error) {
      console.error('Fehler beim Aktualisieren der Flashcards:', error);
    }
  };

  const updateCurrentStreak = async () => {
    const streakEntity = lsc.engine.entities.find((e) => e.has(StreakFacet));
    const currentStreak = streakEntity?.get(StreakFacet)?.props.streak || 0;
    const currentDate = new Date();

    if (streakEntity) {
      const { error: updateError } = await supabaseClient
        .from(SupabaseTables.STREAKS)
        .update({
          streak: currentStreak + 1,
          date_updated: currentDate.toISOString(),
        })
        .eq(SupabaseColumns.ID, streakEntity.get(IdentifierFacet)?.props.guid);

      if (updateError) {
        console.error('Error updating current streak:', updateError);
      }

      streakEntity?.add(new StreakFacet({ streak: currentStreak + 1 }));
      streakEntity?.add(new DateUpdatedFacet({ dateUpdated: currentDate.toISOString() }));
    }
  };

  const addFlashcardSession = async () => {
    const newFlashcardSession = {
      id: v4(),
      user_id: userId,
      session_date: new Date().toISOString(),
      duration: elapsedTime,
      flashcard_count: flashcardEntities.length,
      skip: flashcardEntities.filter((e) => e.has(AdditionalTags.SKIP)).length,
      forgot: flashcardEntities.filter((e) => e.has(AdditionalTags.FORGOT)).length,
      partially_remembered: flashcardEntities.filter((e) => e.has(AdditionalTags.PARTIALLY_REMEMBERED)).length,
      remembered_with_effort: flashcardEntities.filter((e) => e.has(AdditionalTags.REMEMBERED_WITH_EFFORT)).length,
      easily_remembered: flashcardEntities.filter((e) => e.has(AdditionalTags.REMEMBERED_EASILY)).length,
    };
    const { error } = await supabaseClient.from(SupabaseTables.FLASHCARD_SESSIONS).insert([newFlashcardSession]);

    if (error) {
      console.error('Error adding flashcard session:', error);
    }

    const newSessionEntity = new Entity();
    lsc.engine.addEntity(newSessionEntity);
    newSessionEntity.add(new IdentifierFacet({ guid: newFlashcardSession.id }));
    newSessionEntity.add(new DateAddedFacet({ dateAdded: newFlashcardSession.session_date }));
    newSessionEntity.add(new FlashcardCountFacet({ flashcardCount: newFlashcardSession.flashcard_count }));
    newSessionEntity.add(new DurationFacet({ duration: newFlashcardSession.duration }));
    newSessionEntity.add(
      new FlashcardPerformanceFacet({
        flashcardPerformance: {
          partiallyRemembered: newFlashcardSession.partially_remembered,
          rememberedWithEffort: newFlashcardSession.remembered_with_effort,
          easilyRemembered: newFlashcardSession.easily_remembered,
          forgot: newFlashcardSession.forgot,
          skip: newFlashcardSession.skip,
        },
      }),
    );
    newSessionEntity.addTag(DataType.FLASHCARD_SESSION);
  };

  const handleBackButtonClick = () => {
    navigateBack();
    addFlashcardSession();
    updateCurrentStreak();
    updateFlashcardsDueDate();
  };

  return (
    <View backgroundColor={backgroundColor} overlaySidebar visible={isVisible}>
      <StyledStatusBarWrapper>
        <FlexBox>
          <StyledBackButtonWrapper onClick={handleBackButtonClick}>
            <IoChevronBack />
            <StyledBackButtonText>
              {selectedFlashcardGroupTitle || displayButtonTexts(selectedLanguage).back}
            </StyledBackButtonText>
          </StyledBackButtonWrapper>
          <StyledTalkingModeButton>
            <IoHeadset />
          </StyledTalkingModeButton>
        </FlexBox>
        <StyledProgressBarWrapper>
          <StyledProgressBar
            backgroundColor={accentColor}
            width={((currentFlashcardIndex || 0) / (flashcardEntities.length || 1)) * 100 + 1}
          />
        </StyledProgressBarWrapper>

        <StyledFlashcardsStatusWrapper>
          <div>
            <StyledStatusText>{displayLabelTexts(selectedLanguage).queriedCards}</StyledStatusText>
            <StyledQueriedFlashcardsStatusWrapper>
              <IoFileTray />
              <StyledFlashcardCountText>{currentFlashcardIndex}</StyledFlashcardCountText>
            </StyledQueriedFlashcardsStatusWrapper>
          </div>

          <div>
            <StyledStatusText>{displayLabelTexts(selectedLanguage).remainingCards}</StyledStatusText>
            <StyledRemaningFlashcardsStatusWrapper>
              <StyledFlashcardCountText>{flashcardEntities.length - currentFlashcardIndex}</StyledFlashcardCountText>
              <IoFileTray />
            </StyledRemaningFlashcardsStatusWrapper>
          </div>
        </StyledFlashcardsStatusWrapper>
      </StyledStatusBarWrapper>

      {currentFlashcardIndex === flashcardEntities.length && <FlashcardQuizEndCard elapsedTime={elapsedTime} />}

      {flashcardEntities.map((flashcardEntity, index) => (
        <FlashcardCell
          navigateToNextFlashcard={() => setCurrentFlashcardIndex((prev) => prev + 1)}
          flashcardEntity={flashcardEntity}
          currentFlashcardIndex={currentFlashcardIndex}
          flashcardIndex={index}
          key={index}
        />
      ))}
    </View>
  );
};
const StyledFlashcardQuizEndCardWrapper = styled.div`
  ${tw` absolute top-0 right-0  left-0 flex justify-center items-center h-full w-full `}
`;

const StyledDoneIcon = styled.div<{ color: string }>`
  ${tw`text-8xl mx-auto mt-8`}
  color: ${(props) => props.color};
`;

const FlashcardQuizEndCard = (props: { elapsedTime: number }) => {
  const { elapsedTime } = props;
  const { accentColor } = useSelectedSchoolSubjectColor();
  const [isFlipped, setIsFlipped] = useState(false);
  const [rightAnswerdFlashcards] = useEntities((e) => e.has(AdditionalTags.ANSWERD_RIGHT));
  const [wrongAnswerdFlashcards] = useEntities((e) => e.has(AdditionalTags.ANSWERD_WRONG));

  const rightAnswerdFlashcardsCount = rightAnswerdFlashcards.length;
  const wrongAnswerdFlashcardsCount = wrongAnswerdFlashcards.length;

  const sessionFlashCardsCount = rightAnswerdFlashcardsCount + wrongAnswerdFlashcardsCount;

  // TODO: Add dynamic text

  return (
    <StyledFlashcardQuizEndCardWrapper>
      <motion.div
        transition={{ type: 'just' }}
        initial={{ x: -600, opacity: 0, width: '100%' }}
        animate={{ x: 0, opacity: 1 }}
      >
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={isFlipped ? 'back' : 'front'}
          whileHover={{ scale: 1.05 }}
          variants={{
            front: { rotateY: 0 },
            back: { rotateY: 180 },
          }}
        >
          <StyledFlashcardWrapper>
            {!isFlipped ? (
              <StyledDoneIcon color={accentColor}>
                <IoCheckmarkCircleOutline />
              </StyledDoneIcon>
            ) : (
              <StyledAnswerText color={accentColor}>
                <p>
                  Abgefragte Karten: {sessionFlashCardsCount} {sessionFlashCardsCount == 1 ? 'Karte' : 'Karten'}
                </p>
                <p>Abgefragedauer: {formatElapsedTime(elapsedTime)} </p>

                <p>
                  Richtige Karten: {rightAnswerdFlashcardsCount} {rightAnswerdFlashcardsCount == 1 ? 'Karte' : 'Karten'}
                </p>
                <p>
                  Falsche Karten: {wrongAnswerdFlashcardsCount} {wrongAnswerdFlashcardsCount == 1 ? 'Karte' : 'Karten'}
                </p>
              </StyledAnswerText>
            )}
          </StyledFlashcardWrapper>
        </motion.div>
      </motion.div>
    </StyledFlashcardQuizEndCardWrapper>
  );
};

const StyledFlashcardCellContainer = styled.div`
  ${tw`  absolute top-0 right-0  left-0 flex justify-center items-center h-full w-full `}
`;

const StyledFlashcardWrapper = styled.div`
  ${tw`bg-white   mx-auto pb-12  cursor-pointer flex items-center  w-11/12 md:w-8/12 lg:w-1/2 h-60  p-4 rounded-2xl`}
`;

const StyledQuestionText = styled.div<{ color: string }>`
  ${tw`text-lg text-center mx-auto w-fit font-bold `}
  color: ${(props) => props.color};
`;

const StyledAnswerText = styled.div<{ color: string }>`
  ${tw`text-lg text-center mx-auto w-fit scale-x-[-1]  `}
  color: ${(props) => props.color};
`;

const StyledNavButtonAreaWrapper = styled.div`
  ${tw`flex w-[90%] space-x-1 md:space-x-1.5 md:w-2/5 text-xl md:text-2xl md:right-[30%] right-[5%] md:left-[30%] left-[5%] justify-between bg-white bg-opacity-20 p-1 md:p-1.5 rounded-xl md:rounded-2xl absolute bottom-8  `}
`;

const StyledNavButton = styled.div`
  ${tw`w-1/5 space-y-0.5 h-16 flex justify-center flex-col items-center rounded-lg md:rounded-xl hover:opacity-50 transition-all bg-white bg-opacity-60`}
`;

const FlashcardCell = (props: {
  flashcardEntity: Entity;
  currentFlashcardIndex: number;
  flashcardIndex: number;
  navigateToNextFlashcard: () => void;
}) => {
  const { flashcardEntity, currentFlashcardIndex, flashcardIndex, navigateToNextFlashcard } = props;
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const isCurrent = currentFlashcardIndex === flashcardIndex;
  const question = flashcardEntity.get(QuestionFacet)?.props.question;
  const answer = flashcardEntity.get(AnswerFacet)?.props.answer;
  const { accentColor } = useSelectedSchoolSubjectColor();

  useEffect(() => {
    if (isCurrent) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 200);
    }
  }, [isCurrent]);

  const handleSkipClick = () => {
    flashcardEntity.add(AdditionalTags.SKIP);
    navigateToNextFlashcard();
  };

  const handleForgotClick = () => {
    flashcardEntity.add(AdditionalTags.FORGOT);
    navigateToNextFlashcard();
  };

  const handlePartiallyRememberedClick = () => {
    flashcardEntity.add(AdditionalTags.PARTIALLY_REMEMBERED);
    navigateToNextFlashcard();
  };

  const handleRememberedWithEffortClick = () => {
    flashcardEntity.add(AdditionalTags.REMEMBERED_WITH_EFFORT);
    navigateToNextFlashcard();
  };

  const handleRememberedEasilyClick = () => {
    flashcardEntity.add(AdditionalTags.REMEMBERED_EASILY);
    navigateToNextFlashcard();
  };

  return (
    isDisplayed && (
      <Fragment>
        <StyledFlashcardCellContainer>
          <motion.div
            transition={{ type: 'just' }}
            initial={{
              x: -600,
              opacity: 0,
              width: '100%',
            }}
            animate={{
              x: isCurrent ? 0 : flashcardIndex < currentFlashcardIndex ? 600 : -600,
              opacity: isCurrent ? 1 : 0,
            }}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              whileHover={{ scale: 1.05 }}
              style={{
                transformStyle: 'flat',
                transition: 'flat',
                transform: 'translateZ(0)',
                width: '100%',
              }}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              <StyledFlashcardWrapper>
                {isFlipped ? (
                  <StyledAnswerText color={accentColor}>{answer}</StyledAnswerText>
                ) : (
                  <StyledQuestionText color={accentColor}>{question}</StyledQuestionText>
                )}
              </StyledFlashcardWrapper>
            </motion.div>
          </motion.div>
        </StyledFlashcardCellContainer>

        <StyledNavButtonAreaWrapper>
          <StyledNavButton onClick={handleSkipClick}>
            <div>⏩</div>
            <div tw="text-xs text-seconderyText line-clamp-1">1 h</div>
          </StyledNavButton>
          <StyledNavButton onClick={handleForgotClick}>
            <div>❌</div> <div tw="text-xs text-seconderyText line-clamp-1">1 min</div>
          </StyledNavButton>
          <StyledNavButton onClick={handlePartiallyRememberedClick}>
            <div>🤔</div> <div tw="text-xs text-seconderyText line-clamp-1">12 h</div>
          </StyledNavButton>
          <StyledNavButton onClick={handleRememberedWithEffortClick}>
            <div>😀</div> <div tw="text-xs text-seconderyText line-clamp-1">24 h</div>
          </StyledNavButton>
          <StyledNavButton onClick={handleRememberedEasilyClick}>
            <div>👑</div> <div tw="text-xs text-seconderyText line-clamp-1">4 Tage</div>
          </StyledNavButton>
        </StyledNavButtonAreaWrapper>
      </Fragment>
    )
  );
};

export default FlashcardQuizView;
