import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { Fragment, useContext, useEffect, useState } from 'react';
import {
  IoBookmark,
  IoBookmarkOutline,
  IoCheckmarkCircleOutline,
  IoChevronBack,
  IoCreateOutline,
  IoEllipsisVertical,
  IoFileTray,
  IoPauseOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import {
  AnswerFacet,
  DateAddedFacet,
  DateUpdatedFacet,
  DurationFacet,
  FlashcardCountFacet,
  FlashcardPerformanceFacet,
  MasteryLevelFacet,
  PriorityFacet,
  QuestionFacet,
  StreakFacet,
} from '../../../app/additionalFacets';
import { MAX_MASTERY_LEVEL, MIN_MASTERY_LEVEL } from '../../../base/constants';
import {
  AdditionalTag,
  DataType,
  LearningUnitPriority,
  Story,
  SupabaseColumn,
  SupabaseTable,
} from '../../../base/enums';
import {
  ActionRow,
  ActionSheet,
  Alert,
  AlertButton,
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
  View,
} from '../../../components';
import { useSeletedFlashcardGroup } from '../../../features/collection/hooks/useSelectedFlashcardGroup';
import { useSelectedSchoolSubjectColor } from '../../../features/collection/hooks/useSelectedSchoolSubjectColor';
import { useSelectedSubtopic } from '../../../features/collection/hooks/useSelectedSubtopic';
import { useSelectedTheme } from '../../../features/collection/hooks/useSelectedTheme';
import { FlashcardPerformance } from '../../../features/flashcards';
import { useDueFlashcards } from '../../../features/flashcards/hooks/useDueFlashcards';
import { useIsAnyStoryCurrent } from '../../../hooks/useIsAnyStoryCurrent';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { useTimer } from '../../../hooks/useTimer';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../utils/displayText';
import { dataTypeQuery } from '../../../utils/queries';
import { useSelectedLearningUnit } from '../../hooks/useSelectedLearningUnit';
import { updatePriority } from '../../utilities';

const fetchFlashcardsByDue = async () => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('answer, question, id, parent_id, mastery_level')
    .lt('due_date', new Date().toISOString())
    .limit(30);

  if (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }

  const flashcardsEntities = flashcards?.map((flashcard) => {
    const entity = new Entity();
    entity.add(new IdentifierFacet({ guid: flashcard.id }));
    entity.add(new QuestionFacet({ question: flashcard.question }));
    entity.add(new AnswerFacet({ answer: flashcard.answer }));
    entity.add(new ParentFacet({ parentId: flashcard.parent_id }));
    entity.add(new MasteryLevelFacet({ masteryLevel: flashcard.mastery_level }));
    entity.add(DataType.FLASHCARD);
    return entity;
  });

  return flashcardsEntities || [];
};

const useFlashcardQuizEntities = () => {
  const isBookmarkedQuiz = useIsStoryCurrent(Story.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY);
  const isSpacedRepetitionQuizVisible = useIsStoryCurrent(Story.OBSERVING_SPACED_REPETITION_QUIZ);
  const [allFlashcardEntities] = useEntities((e) => dataTypeQuery(e, DataType.FLASHCARD));
  const { selectedLearningUnitId } = useSelectedLearningUnit();
  const { selectedSubtopicId } = useSelectedSubtopic();
  const [selectedFlashcardEntities, setSelectedFlashcardEntities] = useState<readonly Entity[]>([]);

  useEffect(() => {
    const selectFlashcardsForSession = async () => {
      if (isSpacedRepetitionQuizVisible) {
        const sessionFlashcards = await fetchFlashcardsByDue();

        setSelectedFlashcardEntities(sessionFlashcards);
      } else {
        if (selectedSubtopicId) {
          setSelectedFlashcardEntities(
            allFlashcardEntities.filter(
              (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedSubtopicId,
            ),
          );
        } else if (selectedLearningUnitId) {
          setSelectedFlashcardEntities(
            allFlashcardEntities.filter(
              (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedLearningUnitId,
            ),
          );
        } else {
          setSelectedFlashcardEntities(allFlashcardEntities);
        }
      }
    };

    selectFlashcardsForSession();
  }, [
    selectedLearningUnitId,
    selectedSubtopicId,
    isBookmarkedQuiz,
    allFlashcardEntities.length,
    isSpacedRepetitionQuizVisible,
  ]);

  return selectedFlashcardEntities;
};

const StyledStatusBarWrapper = styled.div`
  ${tw` px-4 z-20 md:px-20 dark:text-secondary-text-dark text-white absolute left-0 top-14 lg:top-20 w-full `}
`;

const StyledBackButtonWrapper = styled.div`
  ${tw`flex items-center cursor-pointer  md:hover:opacity-50 transition-all  space-x-1 pb-4`}
`;

const StyledBackButtonText = styled.div`
  ${tw`text-sm`}
`;

const StyledProgressBarWrapper = styled.div`
  ${tw`  bg-white overflow-hidden mb-4 h-fit dark:bg-opacity-5 w-full  rounded-full `}
`;
const StyledProgressBar = styled.div<{
  width?: number;
  backgroundColor: string;
}>`
  ${tw`transition-all dark:bg-opacity-10 dark:bg-white h-1 rounded-full`}
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
  const { backgroundColor, color, backgroundColorDark } = useSelectedSchoolSubjectColor();
  const isVisible = useIsAnyStoryCurrent([
    Story.OBSERVING_FLASHCARD_QUIZ_STORY,
    Story.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY,
    Story.OBSERVING_SPACED_REPETITION_QUIZ,
  ]);
  const flashcardEntities = useFlashcardQuizEntities();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const { selectedLanguage } = useSelectedLanguage();
  const { elapsedTime: elapsedSeconds, startTimer, stopTimer } = useTimer();
  const { selectedFlashcardGroupTitle } = useSeletedFlashcardGroup();
  const { userId } = useUserData();
  const { dueFlashcardEntity, dueFlashcardsCount } = useDueFlashcards();
  const { isDarkModeActive } = useSelectedTheme();
  const { selectedLearningUnitEntity } = useSelectedLearningUnit();
  const isQuizInCollection = useIsAnyStoryCurrent([
    Story.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY,
    Story.OBSERVING_FLASHCARD_QUIZ_STORY,
  ]);

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

  const updateFlashcardsDueDateAndMasteryLevel = async () => {
    const updatedFlashcards: {
      id: string;
      user_id: string;
      due_date: string;
      parent_id: string;
      mastery_level: number;
    }[] = [];

    if (isQuizInCollection) {
      selectedLearningUnitEntity?.add(new PriorityFacet({ priority: LearningUnitPriority.ACTIVE }));

      const flashcardParentIds = Array.from(new Set(flashcardEntities.map((e) => e.get(ParentFacet)?.props.parentId)));
      flashcardParentIds.forEach(async (parentId) => {
        const learningUnitEntity = lsc.engine.entities.find((e) => e.get(IdentifierFacet)?.props.guid === parentId);

        if (!learningUnitEntity) return;

        updatePriority(learningUnitEntity, LearningUnitPriority.ACTIVE, dueFlashcardEntity);
      });
    }

    flashcardEntities.forEach((flashcardEntity) => {
      const id = flashcardEntity.get(IdentifierFacet)?.props.guid;
      const parentId = flashcardEntity.get(ParentFacet)?.props.parentId || '';

      if (!id) return;

      let dueDate: Date | null = null;

      if (flashcardEntity.has(AdditionalTag.REMEMBERED_EASILY)) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 4);
      } else if (flashcardEntity.has(AdditionalTag.REMEMBERED_WITH_EFFORT)) {
        dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 1);
      } else if (flashcardEntity.has(AdditionalTag.PARTIALLY_REMEMBERED)) {
        dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + 12);
      } else if (flashcardEntity.has(AdditionalTag.FORGOT)) {
        dueDate = new Date();
      } else if (flashcardEntity.has(AdditionalTag.SKIP)) {
        dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + 1);
      }

      const masteryLevel = flashcardEntity.get(MasteryLevelFacet)?.props.masteryLevel || 0;
      let newMasterLevel = masteryLevel;

      if (masteryLevel == MAX_MASTERY_LEVEL && !flashcardEntity.has(AdditionalTag.FORGOT)) {
        newMasterLevel = MAX_MASTERY_LEVEL;
      } else if (flashcardEntity.has(AdditionalTag.REMEMBERED_EASILY)) {
        newMasterLevel = masteryLevel + 1;
        flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
      } else if (flashcardEntity.has(AdditionalTag.REMEMBERED_WITH_EFFORT)) {
        newMasterLevel = masteryLevel + 1;
        flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
      } else if (flashcardEntity.has(AdditionalTag.PARTIALLY_REMEMBERED)) {
        newMasterLevel = masteryLevel + 1;
        flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
      } else if (flashcardEntity.has(AdditionalTag.FORGOT)) {
        newMasterLevel = MIN_MASTERY_LEVEL;
        flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
      } else {
        newMasterLevel = 0;
      }
      lsc.engine.entities
        .find((e) => e.get(IdentifierFacet)?.props.guid === id)
        ?.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));

      if (dueDate) {
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
          dueFlashcardsCount -
          flashcardEntities.filter(
            (e) =>
              e.has(AdditionalTag.REMEMBERED_WITH_EFFORT) ||
              e.has(AdditionalTag.REMEMBERED_EASILY) ||
              e.has(AdditionalTag.SKIP) ||
              e.has(AdditionalTag.PARTIALLY_REMEMBERED),
          ).length,
      }),
    );

    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .upsert(updatedFlashcards, { onConflict: SupabaseColumn.ID });

    if (error) {
      console.error('Fehler beim Aktualisieren der Flashcards:', error);
    }
  };

  const updateCurrentStreak = async () => {
    if (currentFlashcardIndex === 0 || !userId) return;

    const streakEntity = lsc.engine.entities.find((e) => e.has(StreakFacet));
    const currentStreak = streakEntity?.get(StreakFacet)?.props.streak || 0;
    const currentDate = new Date();

    if (
      streakEntity &&
      currentDate.getDate() !== new Date(streakEntity.get(DateUpdatedFacet)?.props.dateUpdated || '').getDate()
    ) {
      const { error: updateError } = await supabaseClient
        .from(SupabaseTable.STREAKS)
        .update({
          streak: currentStreak + 1,
          date_updated: currentDate.toISOString(),
        })
        .eq(SupabaseColumn.ID, streakEntity.get(IdentifierFacet)?.props.guid);

      if (updateError) {
        console.error('Error updating current streak:', updateError);
      }

      streakEntity?.add(new StreakFacet({ streak: currentStreak + 1 }));
      streakEntity?.add(new DateUpdatedFacet({ dateUpdated: currentDate.toISOString() }));
    }
  };

  const addFlashcardSession = async () => {
    if (currentFlashcardIndex === 0 || !userId) return;

    const elapsedMinutes = Math.ceil(elapsedSeconds / 60);
    const newFlashcardSession = {
      id: v4(),
      user_id: userId,
      session_date: new Date().toISOString(),
      duration: elapsedMinutes,
      flashcard_count: currentFlashcardIndex,
      skip: flashcardEntities.filter((e) => e.has(AdditionalTag.SKIP)).length,
      forgot: flashcardEntities.filter((e) => e.has(AdditionalTag.FORGOT)).length,
      partially_remembered: flashcardEntities.filter((e) => e.has(AdditionalTag.PARTIALLY_REMEMBERED)).length,
      remembered_with_effort: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_WITH_EFFORT)).length,
      easily_remembered: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_EASILY)).length,
    };
    const { error } = await supabaseClient.from(SupabaseTable.FLASHCARD_SESSIONS).insert([newFlashcardSession]);

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
    updateFlashcardsDueDateAndMasteryLevel();
  };

  return (
    <View backgroundColor={isDarkModeActive ? backgroundColorDark : backgroundColor} overlaySidebar visible={isVisible}>
      <StyledStatusBarWrapper>
        <FlexBox>
          <StyledBackButtonWrapper onClick={handleBackButtonClick}>
            <IoChevronBack />
            <StyledBackButtonText>
              {selectedFlashcardGroupTitle || displayButtonTexts(selectedLanguage).back}
            </StyledBackButtonText>
          </StyledBackButtonWrapper>
        </FlexBox>
        <StyledProgressBarWrapper>
          <StyledProgressBar
            backgroundColor={isDarkModeActive ? color + 26 : color}
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

      {currentFlashcardIndex === flashcardEntities.length && (
        <FlashcardQuizEndCard flashcardEntities={flashcardEntities} elapsedTime={elapsedSeconds} />
      )}

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
  ${tw`text-8xl dark:opacity-60 mx-auto mt-4`}
  color: ${(props) => props.color};
`;

const StyledBar = styled.div<{ isHovered: boolean; backgroundColor: string }>`
  ${tw` transition-all mr-auto rounded-r h-3 ml-4 opacity-60 dark:opacity-20  `}
  ${({ isHovered }) => isHovered && tw`opacity-100`}
  background-color: ${(props) => props.backgroundColor};
`;

const StyledPerformanceList = styled.div<{ color: string }>`
  ${tw` w-full mt-6 space-y-1`}
  color: ${(props) => props.color};
`;

const StyledFlexItem = styled.div`
  ${tw`items-center flex justify-between`}
`;
const StyledLabel2 = styled.div`
  ${tw`text-lg`}
`;

const FlashcardQuizEndCard = (props: { elapsedTime: number; flashcardEntities: readonly Entity[] }) => {
  const { flashcardEntities, elapsedTime } = props;
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(0);
  const { flashcardPerformance, totalCardCount } = useFlashcardSessionPerformance(flashcardEntities);
  const { color } = useSelectedSchoolSubjectColor();
  const { isDarkModeActive } = useSelectedTheme();

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
              <StyledDoneIcon color={color}>
                <IoCheckmarkCircleOutline />
              </StyledDoneIcon>
            ) : (
              <div tw="scale-x-[-1] w-full px-4 mx-auto ">
                <StyledPerformanceList color={color}>
                  {[
                    { label: '⏩', value: flashcardPerformance?.skip, id: 1 },
                    { label: '❌', value: flashcardPerformance?.forgot, id: 2 },
                    { label: '🤔', value: flashcardPerformance?.partiallyRemembered, id: 3 },
                    { label: '😀', value: flashcardPerformance?.rememberedWithEffort, id: 4 },
                    { label: '👑', value: flashcardPerformance?.easilyRemembered, id: 5 },
                  ].map(({ label, value, id }) => (
                    <StyledFlexItem
                      key={id}
                      onMouseEnter={() => setHoveredBar(id)}
                      onMouseLeave={() => setHoveredBar(0)}
                    >
                      <StyledLabel2>{label}</StyledLabel2>
                      <StyledBar
                        backgroundColor={color}
                        isHovered={hoveredBar === id ? true : false}
                        style={{ width: `${value}%` }}
                      />
                      {true && (
                        <div style={{ opacity: isDarkModeActive ? 0.7 : 1 }} tw=" ml-4">
                          {' '}
                          {value}%
                        </div>
                      )}
                    </StyledFlexItem>
                  ))}
                  <StyledFlexItem>
                    <StyledLabel2>ℹ️</StyledLabel2>
                    <p style={{ opacity: isDarkModeActive ? 0.7 : 1 }} tw=" ml-4 font-semibold">
                      {totalCardCount} Karten in {formatElapsedTime(elapsedTime)}
                    </p>
                  </StyledFlexItem>
                </StyledPerformanceList>
              </div>
            )}
          </StyledFlashcardWrapper>
        </motion.div>
      </motion.div>
    </StyledFlashcardQuizEndCardWrapper>
  );
};

const useFlashcardSessionPerformance = (flashcardEntities: readonly Entity[]) => {
  const totalCardCount = flashcardEntities.length;
  const [flashcardPerformance, setFlashcardPerformance] = useState<FlashcardPerformance>();

  useEffect(() => {
    const performance = {
      skip: flashcardEntities.filter((e) => e.has(AdditionalTag.SKIP)).length,
      forgot: flashcardEntities.filter((e) => e.has(AdditionalTag.FORGOT)).length,
      partiallyRemembered: flashcardEntities.filter((e) => e.has(AdditionalTag.PARTIALLY_REMEMBERED)).length,
      rememberedWithEffort: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_WITH_EFFORT)).length,
      easilyRemembered: flashcardEntities.filter((e) => e.has(AdditionalTag.REMEMBERED_EASILY)).length,
    };

    const skipPercentage = Math.round((performance.skip / totalCardCount) * 100);
    const forgotPercentage = Math.round((performance.forgot / totalCardCount) * 100);
    const partiallyRememberedPercentage = Math.round((performance.partiallyRemembered / totalCardCount) * 100);
    const rememberedWithEffortPercentage = Math.round((performance.rememberedWithEffort / totalCardCount) * 100);
    const easilyRememberedPercentage = Math.round((performance.easilyRemembered / totalCardCount) * 100);

    setFlashcardPerformance({
      skip: skipPercentage || 0,
      forgot: forgotPercentage || 0,
      partiallyRemembered: partiallyRememberedPercentage || 0,
      rememberedWithEffort: rememberedWithEffortPercentage || 0,
      easilyRemembered: easilyRememberedPercentage || 0,
    });
  }, [flashcardEntities, totalCardCount]);

  return { totalCardCount, flashcardPerformance };
};
const StyledFlashcardCellContainer = styled.div`
  ${tw`  absolute top-0 right-0  left-0 flex justify-center items-center h-full w-full `}
`;

const StyledFlashcardWrapper = styled.div<{ backgroundColor?: string }>`
  ${tw`bg-white overflow-y-scroll dark:text-white  dark:bg-opacity-5 mx-auto py-16  cursor-pointer flex items-center  w-11/12 md:w-8/12 xl:w-2/5 2xl:w-1/3 lg:w-1/2 h-60  p-4 rounded-2xl`}/* background-color: ${(
    props,
  ) => (props.backgroundColor ? props.backgroundColor + 10 : '')}; */
`;

const StyledQuestionText = styled.div<{ color: string }>`
  ${tw`text-lg py-4 text-center mx-auto w-fit font-bold `}
  color: ${(props) => props.color};
`;

const StyledAnswerText = styled.div<{ color: string }>`
  ${tw`text-lg py-4 text-center mx-auto w-fit scale-x-[-1]  `}
  color: ${(props) => props.color};
`;

const StyledNavButtonContainer = styled.div<{ backgroundColor?: string }>`
  ${tw`flex w-[95%] xl:w-1/3 md:w-2/5  absolute bottom-8 xl:right-1/3 md:right-[30%] xl:left-1/3 md:left-[30%] left-[2.5%] right-[2.5%] space-x-1 `}
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : '')};
`;

const StyledNavButtonAreaWrapper = styled.div`
  ${tw`flex  space-x-1  w-full text-xl md:text-2xl  justify-between dark:bg-opacity-5 bg-white  bg-opacity-40 p-1   rounded-xl md:rounded-2xl  `}
`;

const StyledNavButton = styled.div`
  ${tw`w-1/5 space-y-0.5  h-fit py-2.5 flex justify-center flex-col items-center rounded-lg md:rounded-xl lg:hover:opacity-70 transition-all dark:bg-opacity-5 bg-white bg-opacity-80`}
`;

const StyledLabel = styled.div`
  ${tw`text-xs dark:text-secondary-text-dark text-secondary-text  line-clamp-1`}
`;

const FlashcardCell = (props: {
  flashcardEntity: Entity;
  currentFlashcardIndex: number;
  flashcardIndex: number;
  navigateToNextFlashcard: () => void;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { flashcardEntity, currentFlashcardIndex, flashcardIndex, navigateToNextFlashcard } = props;
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const isCurrent = currentFlashcardIndex === flashcardIndex;
  const question = flashcardEntity.get(QuestionFacet)?.props.question;
  const answer = flashcardEntity.get(AnswerFacet)?.props.answer;
  const { color, backgroundColorDark, backgroundColor } = useSelectedSchoolSubjectColor();
  const { isDarkModeActive } = useSelectedTheme();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isDeleteFlashcardAlertVisible, setIsDeleteFlashcardAlertVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const flashcardId = flashcardEntity.get(IdentifierFacet)?.props.guid;
  const [isEditFlashcardSheetVisible, setIsEditFlashcardSheetVisible] = useState(false);

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
    flashcardEntity.add(AdditionalTag.SKIP);
    navigateToNextFlashcard();
  };

  const handleForgotClick = () => {
    flashcardEntity.add(AdditionalTag.FORGOT);
    navigateToNextFlashcard();
  };

  const handlePartiallyRememberedClick = () => {
    flashcardEntity.add(AdditionalTag.PARTIALLY_REMEMBERED);
    navigateToNextFlashcard();
  };

  const handleRememberedWithEffortClick = () => {
    flashcardEntity.add(AdditionalTag.REMEMBERED_WITH_EFFORT);
    navigateToNextFlashcard();
  };

  const handleRememberedEasilyClick = () => {
    flashcardEntity.add(AdditionalTag.REMEMBERED_EASILY);
    navigateToNextFlashcard();
  };

  const deleteFlashcard = async () => {
    navigateToNextFlashcard();

    if (!flashcardId) return;

    const { error } = await supabaseClient.from(SupabaseTable.FLASHCARDS).delete().eq(SupabaseColumn.ID, flashcardId);

    if (error) {
      console.error('Error deleting flashcard:', error);
    }

    const flashcardEntityToDelete = lsc.engine.entities.find((e) => e.get(IdentifierFacet)?.props.guid === flashcardId);
    if (flashcardEntityToDelete) {
      lsc.engine.removeEntity(flashcardEntityToDelete);
    }

    setIsDeleteFlashcardAlertVisible(false);
  };

  const pauseFlashcard = async () => {
    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .update({ due_date: null })
      .eq(SupabaseColumn.ID, flashcardEntity.get(IdentifierFacet)?.props.guid);

    if (error) {
      console.error('Error pausing flashcard:', error);
    }

    navigateToNextFlashcard();
  };

  const bookmarkFlashcard = async () => {
    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .update({ is_bookmarked: true })
      .eq(SupabaseColumn.ID, flashcardEntity.get(IdentifierFacet)?.props.guid);

    if (error) {
      console.error('Error bookmarking flashcard:', error);
    }

    const flashcardEntityToBookmark = lsc.engine.entities.find(
      (e) => e.get(IdentifierFacet)?.props.guid === flashcardId,
    );
    if (flashcardEntityToBookmark) {
      flashcardEntityToBookmark.add(AdditionalTag.BOOKMARKED);
    }

    setIsBookmarked(true);
  };

  return (
    isDisplayed && (
      <div>
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
              <StyledFlashcardWrapper backgroundColor={isDarkModeActive ? color : ''}>
                {isFlipped ? (
                  <StyledAnswerText color={isDarkModeActive ? 'white' : color}>{answer}</StyledAnswerText>
                ) : (
                  <StyledQuestionText color={isDarkModeActive ? 'white' : color}>{question}</StyledQuestionText>
                )}
              </StyledFlashcardWrapper>
            </motion.div>
          </motion.div>
        </StyledFlashcardCellContainer>
        <div tw="scale-100 fixed bottom-72 mb-4 xl:right-[28%] md:right-[24%] right-2">
          <ActionSheet visible={isContextMenuVisible} navigateBack={() => setIsContextMenuVisible(false)}>
            <ActionRow onClick={() => setIsEditFlashcardSheetVisible(true)} icon={<IoCreateOutline />} first>
              Bearbeiten
            </ActionRow>
            <ActionRow onClick={bookmarkFlashcard} icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}>
              Merken
            </ActionRow>
            <ActionRow onClick={pauseFlashcard} icon={<IoPauseOutline />}>
              Karte Pausieren
            </ActionRow>
            <ActionRow
              onClick={() => setIsDeleteFlashcardAlertVisible(true)}
              last
              destructive
              icon={<IoTrashOutline />}
            >
              Löschen
            </ActionRow>
          </ActionSheet>
        </div>
        <StyledNavButtonContainer backgroundColor={isDarkModeActive ? backgroundColorDark : backgroundColor}>
          <StyledNavButtonAreaWrapper>
            {isFlipped ? (
              <Fragment>
                <StyledNavButton onClick={handleSkipClick}>
                  <div>⏩</div>
                  <StyledLabel>1 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={handleForgotClick}>
                  <div>❌</div> <StyledLabel>1 min</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={handlePartiallyRememberedClick}>
                  <div>🤔</div> <StyledLabel>12 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={handleRememberedWithEffortClick}>
                  <div>😀</div> <StyledLabel>24 h</StyledLabel>
                </StyledNavButton>
                <StyledNavButton onClick={handleRememberedEasilyClick}>
                  <div>👑</div> <StyledLabel>4 Tage</StyledLabel>
                </StyledNavButton>
              </Fragment>
            ) : (
              <StyledNavButton tw="w-full" onClick={() => setIsFlipped((prev) => !prev)}>
                <div>🔄</div>
                <StyledLabel>Antwort</StyledLabel>
              </StyledNavButton>
            )}
          </StyledNavButtonAreaWrapper>

          <div tw="text-xl md:w-20  w-9 md:text-2xl text-secondary-text dark:text-secondary-text-dark  dark:bg-opacity-5 bg-white  bg-opacity-40 p-1   rounded-xl md:rounded-2xl  ">
            <StyledNavButton onClick={() => setIsContextMenuVisible(true)} tw="w-full h-full">
              <IoEllipsisVertical />
            </StyledNavButton>
          </div>
        </StyledNavButtonContainer>

        <DeleteFlashcardAlert
          isVisible={isDeleteFlashcardAlertVisible}
          navigateBack={() => setIsDeleteFlashcardAlertVisible(false)}
          deleteFlashcard={deleteFlashcard}
        />
        <EditFlashcardSheet
          isVisible={isEditFlashcardSheetVisible}
          navigateBack={() => setIsEditFlashcardSheetVisible(false)}
          flashcardEntity={flashcardEntity}
        />
      </div>
    )
  );
};

export default FlashcardQuizView;

const DeleteFlashcardAlert = (props: { isVisible: boolean; navigateBack: () => void; deleteFlashcard: () => void }) => {
  const { isVisible, navigateBack, deleteFlashcard } = props;
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={deleteFlashcard} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

// const useKeyEvents = (callback: (event: KeyboardEvent) => void) => {
//   useEffect(() => {
//     window.addEventListener('keydown', callback);
//     return () => window.removeEventListener('keydown', callback);
//   }, []);
// };

const EditFlashcardSheet = (props: { isVisible: boolean; navigateBack: () => void; flashcardEntity: Entity }) => {
  const { isVisible, navigateBack, flashcardEntity } = props;
  const question = flashcardEntity.get(QuestionFacet)?.props.question;
  const answer = flashcardEntity.get(AnswerFacet)?.props.answer;
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedAnswer, setEditedAnswer] = useState(answer);
  const { selectedLanguage } = useSelectedLanguage();
  const displaySaveButton = editedQuestion !== question || editedAnswer !== answer;

  const saveFlashcard = async () => {
    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .update({ question: editedQuestion, answer: editedAnswer })
      .eq(SupabaseColumn.ID, flashcardEntity.get(IdentifierFacet)?.props.guid);

    if (error) {
      console.error('Error updating flashcard:', error);
    }

    flashcardEntity.add(new QuestionFacet({ question: editedQuestion || '' }));
    flashcardEntity.add(new AnswerFacet({ answer: editedAnswer || '' }));

    navigateBack();
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {displaySaveButton && (
          <PrimaryButton onClick={saveFlashcard}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextAreaInput
            placeholder="Frage"
            value={editedQuestion}
            onChange={(event) => setEditedQuestion(event.target.value)}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            placeholder="Antwort"
            value={editedAnswer}
            onChange={(event) => setEditedAnswer(event.target.value)}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};
