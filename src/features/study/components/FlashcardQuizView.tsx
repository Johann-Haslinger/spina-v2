import { Fragment, useContext, useEffect } from "react";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { AdditionalTags, DataTypes, Stories } from "../../../base/enums";
import { FlexBox, View } from "../../../components";
import { useSeletedFlashcardGroup } from "../../collection/hooks/useSelectedFlashcardGroup";
import { useState } from "react";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { AnswerFacet, LastReviewedFacet, MasteryLevelFacet, QuestionFacet } from "../../../app/AdditionalFacets";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { motion } from "framer-motion";
import { isChildOfQuery, dataTypeQuery } from "../../../utils/queries";
import {
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoChevronBack,
  IoCloseCircle,
  IoFileTray,
  IoHeadset,
} from "react-icons/io5";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { useTimer } from "../../../hooks/useTimer";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const StyledStatusBarWrapper = styled.div`
  ${tw` px-4 z-20 md:px-20 absolute left-0 top-14 lg:top-20 w-full `}
`;

const StyledBackButtonWrapper = styled.div`
  ${tw`flex items-center cursor-pointer  md:hover:opacity-50 transition-all  space-x-1 pb-4`}
`;

const StyledBackButtonText = styled.div`
  ${tw`text-sm`}
`;
const StyledTalkingModeButton = styled.div`
  ${tw`transition-all cursor-pointer mb-4 hover:opacity-50 text-lg`}
`;

const StyledProgressBarWrapper = styled.div`
  ${tw` dark:bg-seconderyDark bg-tertiary  overflow-hidden mb-4 h-fit w-full  rounded-full `}
`;
const StyledProgressBar = styled.div<{ width: number }>`
  ${tw`transition-all dark:bg-white bg-primaryColor h-1 rounded-full`}
  width: ${(props) => props.width}%;
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
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  const { selectedFlashcardGroupEntity } = useSeletedFlashcardGroup();
  const [flashcardEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.FLASHCARD));
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
      difficulty: number;
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
        difficulty: newMasterLevel,
        last_reviewed: new Date(),
      });
    });

    const { error } = await supabaseClient.from("flashCards").upsert(updatedFlashcards, { onConflict: "id" });

    if (error) {
      console.error("Fehler beim Aktualisieren der Flashcards:", error);
    }
  };

  const handleBackButtonClick = () => {
    navigateBack();
    updateFlashcardsMasteryLavel();
  };

  return (
    <View overlaySidebar visibe={isVisible}>
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
          <StyledProgressBar width={(currentFlashcardIndex / flashcardEntities.length) * 100 + 1} />
        </StyledProgressBarWrapper>

        <StyledFlashcardsStatusWrapper>
          <div>
            <StyledStatusText>
              {displayLabelTexts(selectedLanguage).queriedCards}
            </StyledStatusText>
            <StyledQueriedFlashcardsStatusWrapper>
              <IoFileTray />
              <StyledFlashcardCountText>{currentFlashcardIndex}</StyledFlashcardCountText>
            </StyledQueriedFlashcardsStatusWrapper>
          </div>

          <div>
            <StyledStatusText>
              {displayLabelTexts(selectedLanguage).remainingCards}
            </StyledStatusText>
            <StyledRemaningFlashcardsStatusWrapper>
              <StyledFlashcardCountText>{flashcardEntities.length - currentFlashcardIndex}</StyledFlashcardCountText>
              <IoFileTray />
            </StyledRemaningFlashcardsStatusWrapper>
          </div>
        </StyledFlashcardsStatusWrapper>
      </StyledStatusBarWrapper>

      {currentFlashcardIndex === flashcardEntities.length && <FlashcardQuizEndCard elapsedTime={elapsedTime} />}

      {flashcardEntities
        .filter((e) => isChildOfQuery(e, selectedFlashcardGroupEntity))
        .map((flashcardEntity, index) => (
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

const StyledDoneIcon = styled.div`
  ${tw`text-8xl mx-auto mt-8`}
`;

const FlashcardQuizEndCard = (props: { elapsedTime: number }) => {
  const { elapsedTime } = props;
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
              <StyledDoneIcon>
                <IoCheckmarkCircleOutline />
              </StyledDoneIcon>
            ) : (
              <StyledAnswerText>
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
  ${tw`bg-tertiary mx-auto pb-12  cursor-pointer flex items-center  w-11/12 md:w-8/12 lg:w-1/2 h-60 dark:bg-tertiaryDark  p-4 rounded-2xl dark:shadow-md`}
`;

const StyledQuestionText = styled.div`
  ${tw`text-lg text-center mx-auto w-fit font-semibold`}
`;

const StyledAnswerText = styled.div`
  ${tw`text-lg text-center mx-auto w-fit scale-x-[-1]`}
`;

const StyledNavButtonAreaWrapper = styled.div`
  ${tw`flex text-primaryColor dark:text-primaryTextDark lg:px-20 px-6 justify-between absolute left-0 lg:bottom-8 bottom-4 w-full`}
`;

const StyledNavButton = styled.div`
  ${tw`flex text-lg cursor-pointer hover:opacity-50 transition-all items-center`}
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
  const {selectedLanguage} = useSelectedLanguage();
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const isCurrent = currentFlashcardIndex === flashcardIndex;
  const question = flashcardEntity.get(QuestionFacet)?.props.question;
  const answer = flashcardEntity.get(AnswerFacet)?.props.answer;

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
                  <StyledAnswerText>{answer}</StyledAnswerText>
                ) : (
                  <StyledQuestionText>{question}</StyledQuestionText>
                )}
              </StyledFlashcardWrapper>
            </motion.div>
          </motion.div>
        </StyledFlashcardCellContainer>

        <StyledNavButtonAreaWrapper>
          <StyledNavButton onClick={handleRightAnswerClick}>
            <IoCheckmarkCircle />
            <StyledNavButtonText>
              {displayButtonTexts(selectedLanguage).true}
            </StyledNavButtonText>
          </StyledNavButton>
          <StyledNavButton onClick={handleWrongAnswerClick}>
            <StyledNavButtonText>
              {displayButtonTexts(selectedLanguage).false}
            </StyledNavButtonText>
            <IoCloseCircle />
          </StyledNavButton>
        </StyledNavButtonAreaWrapper>
      </Fragment>
    )
  );
};

export default FlashcardQuizView;
