import styled from "@emotion/styled/macro";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { motion } from "framer-motion";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoChevronBack,
  IoCloseCircle,
  IoFileTray,
  IoHeadset,
} from "react-icons/io5";
import tw from "twin.macro";
import { AnswerFacet, LastReviewedFacet, MasteryLevelFacet, QuestionFacet } from "../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories, SupabaseTables } from "../../../base/enums";
import { FlexBox, View } from "../../../components";
import { useIsAnyStoryCurrent } from "../../../hooks/useIsAnyStoryCurrent";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useTimer } from "../../../hooks/useTimer";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import { displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { dataTypeQuery } from "../../../utils/queries";
import { useSeletedFlashcardGroup } from "../../collection/hooks/useSelectedFlashcardGroup";
import { useSelectedSchoolSubjectColor } from "../../collection/hooks/useSelectedSchoolSubjectColor";
import { useSelectedSubtopic } from "../../collection/hooks/useSelectedSubtopic";
import { useBookmarkedFlashcardGroups } from "../hooks/useBookmarkedFlashcardGroups";

const useFlashcardQuizEntities = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isBookmarkedQuiz = useIsStoryCurrent(Stories.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY);
  const { bookmarkedFlashcardGroupEntities } = useBookmarkedFlashcardGroups();
  const [allFlashcardEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.FLASHCARD));
  const { selectedFlashcardGroupId } = useSeletedFlashcardGroup();
  const { selectedSubtopicId } = useSelectedSubtopic();
  const [selectedFlashcardEntities, setSelectedFlashcardEntities] = useState<readonly Entity[]>([]);

  useEffect(() => {
    if (isBookmarkedQuiz) {
      let flashcardEntities: Entity[] = [];
      bookmarkedFlashcardGroupEntities.forEach(async (bookmarkedFlashcardGroup) => {
        const id = bookmarkedFlashcardGroup.get(IdentifierFacet)?.props.guid;

        if (id) {
          const { data: flashcards, error } = await supabaseClient
            .from("flashCards")
            .select("answer, question, id")
            .eq("parentId", id);
          if (error) {
            console.error("Error fetching flashcards:", error);
          }

          flashcards?.forEach((flashcard) => {
            const entity = new Entity();
            lsc.engine.addEntity(entity);
            flashcardEntities.push(entity);
            entity.add(new IdentifierFacet({ guid: flashcard.id }));
            entity.add(new QuestionFacet({ question: flashcard.question }));
            entity.add(new AnswerFacet({ answer: flashcard.answer }));
            entity.add(new ParentFacet({ parentId: id }));
            entity.add(DataTypes.FLASHCARD);
          });
        }
      });
      setSelectedFlashcardEntities(flashcardEntities);
    } else {
      if (selectedSubtopicId) {
        setSelectedFlashcardEntities(
          allFlashcardEntities.filter(
            (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedSubtopicId
          )
        );
      } else if (selectedFlashcardGroupId) {
        setSelectedFlashcardEntities(
          allFlashcardEntities.filter(
            (flashcardEntity) => flashcardEntity.get(ParentFacet)?.props.parentId === selectedFlashcardGroupId
          )
        );
      } else {
        setSelectedFlashcardEntities(allFlashcardEntities);
      }
    }
  }, [
    selectedFlashcardGroupId,
    selectedSubtopicId,
    bookmarkedFlashcardGroupEntities,
    isBookmarkedQuiz,
    allFlashcardEntities.length,
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
  ${tw` dark:bg-seconderyDark bg-white overflow-hidden mb-4 h-fit w-full  rounded-full `}
`;
const StyledProgressBar = styled.div<{ width?: number; backgroundColor: string }>`
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
  return `${minutes} ${minutes == 1 ? "Minute" : "Minuten"}`;
};

const FlashcardQuizView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { backgroundColor, accentColor } = useSelectedSchoolSubjectColor();
  const isVisible = useIsAnyStoryCurrent([
    Stories.OBSERVING_FLASHCARD_QUIZ_STORY,
    Stories.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY,
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

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_SET_STORY);

  const updateFlashcardsMasteryLavel = async () => {
    let updatedFlashcards: {
      id: string;
      user_id: string;
      mastery_level: number;
      last_reviewed: Date;
    }[] = [];

    flashcardEntities.map((flashcardEntity) => {
      const currentMasteryLevel = flashcardEntity.get(MasteryLevelFacet)?.props.masteryLevel;
      const answerdRight = flashcardEntity.has(AdditionalTags.ANSWERD_RIGHT);
      let newMasterLevel = 0;

      if (answerdRight) {
        newMasterLevel = (currentMasteryLevel || 0) + 1;
      }

      flashcardEntity.removeTag(AdditionalTags.ANSWERD_RIGHT);
      flashcardEntity.removeTag(AdditionalTags.ANSWERD_WRONG);
      flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: newMasterLevel }));
      flashcardEntity.add(new LastReviewedFacet({ lastReviewed: new Date().toISOString() }));

      updatedFlashcards.push({
        id: flashcardEntity.get(IdentifierFacet)?.props.guid || "",
        user_id: userId,
        mastery_level: newMasterLevel,
        last_reviewed: new Date(),
      });
    });

    const { error } = await supabaseClient
      .from(SupabaseTables.FLASHCARDS)
      .upsert(updatedFlashcards, { onConflict: "id" });

    if (error) {
      console.error("Fehler beim Aktualisieren der Flashcards:", error);
    }
  };

  const handleBackButtonClick = () => {
    navigateBack();
    updateFlashcardsMasteryLavel();
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
  ${tw` dark:text-primaryTextDark absolute top-0 right-0  left-0 flex justify-center items-center h-full w-full `}
`;

const StyledDoneIcon = styled.div<{ color: string }>`
  ${tw`text-8xl mx-auto mt-8`}
  color: ${(props) => props.color};
`;

const FlashcardQuizEndCard = (props: { elapsedTime: number }) => {
  const { elapsedTime } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();
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
        transition={{ type: "just" }}
        initial={{ x: -600, opacity: 0, width: "100%" }}
        animate={{ x: 0, opacity: 1 }}
      >
        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={isFlipped ? "back" : "front"}
          whileHover={{ scale: 1.05 }}
          variants={{
            front: { rotateY: 0 },
            back: { rotateY: 180 },
          }}
        >
          <StyledFlashcardWrapper>
            {!isFlipped ? (
              <StyledDoneIcon color={backgroundColor}>
                <IoCheckmarkCircleOutline />
              </StyledDoneIcon>
            ) : (
              <StyledAnswerText color={backgroundColor}>
                <p>
                  Abgefragte Karten: {sessionFlashCardsCount} {sessionFlashCardsCount == 1 ? "Karte" : "Karten"}
                </p>
                <p>Abgefragedauer: {formatElapsedTime(elapsedTime)} </p>

                <p>
                  Richtige Karten: {rightAnswerdFlashcardsCount} {rightAnswerdFlashcardsCount == 1 ? "Karte" : "Karten"}
                </p>
                <p>
                  Falsche Karten: {wrongAnswerdFlashcardsCount} {wrongAnswerdFlashcardsCount == 1 ? "Karte" : "Karten"}
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
  ${tw` dark:text-primaryTextDark absolute top-0 right-0  left-0 flex justify-center items-center h-full w-full `}
`;

const StyledFlashcardWrapper = styled.div`
  ${tw`bg-white mx-auto pb-12  cursor-pointer flex items-center  w-11/12 md:w-8/12 lg:w-1/2 h-60 dark:bg-tertiaryDark  p-4 rounded-2xl dark:shadow-md`}
`;

const StyledQuestionText = styled.div<{ color: string }>`
  ${tw`text-lg text-center mx-auto w-fit font-bold dark:text-primaryTextDark`}
  color: ${(props) => props.color};
`;

const StyledAnswerText = styled.div<{ color: string }>`
  ${tw`text-lg text-center mx-auto w-fit scale-x-[-1]  dark:text-primaryTextDark`}
  color: ${(props) => props.color};
`;

const StyledNavButtonAreaWrapper = styled.div`
  ${tw`flex text-white lg:px-20 px-6 justify-between absolute left-0 lg:bottom-8 bottom-4 w-full`}
`;

const StyledNavButton = styled.div`
  ${tw`flex text-lg cursor-pointer md:hover:opacity-50 transition-all items-center`}
`;
const StyledNavButtonText = styled.div`
  ${tw`px-4 text-base`}
`;

const FlashcardCell = (props: {
  flashcardEntity: Entity;
  currentFlashcardIndex: number;
  flashcardIndex: number;
  navigateToNextFlashcard: () => void;
}) => {
  const { flashcardEntity, currentFlashcardIndex, flashcardIndex, navigateToNextFlashcard } = props;
  const { selectedLanguage } = useSelectedLanguage();
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

  const handleRightAnswerClick = () => {
    flashcardEntity.add(AdditionalTags.ANSWERD_RIGHT);
    navigateToNextFlashcard();
  };
  const handleWrongAnswerClick = () => {
    flashcardEntity.add(AdditionalTags.ANSWERD_WRONG);
    navigateToNextFlashcard();
  };

  return (
    isDisplayed && (
      <Fragment>
        <StyledFlashcardCellContainer>
          <motion.div
            transition={{ type: "just" }}
            initial={{
              x: -600,
              opacity: 0,
              width: "100%",
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
                transformStyle: "flat",
                transition: "flat",
                transform: "translateZ(0)",
                width: "100%",
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
          <StyledNavButton onClick={handleRightAnswerClick}>
            <IoCheckmarkCircle />
            <StyledNavButtonText>{displayButtonTexts(selectedLanguage).true}</StyledNavButtonText>
          </StyledNavButton>
          <StyledNavButton onClick={handleWrongAnswerClick}>
            <StyledNavButtonText>{displayButtonTexts(selectedLanguage).false}</StyledNavButtonText>
            <IoCloseCircle />
          </StyledNavButton>
        </StyledNavButtonAreaWrapper>
      </Fragment>
    )
  );
};

export default FlashcardQuizView;
