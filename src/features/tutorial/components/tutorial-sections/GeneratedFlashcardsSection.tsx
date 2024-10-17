import { motion } from "framer-motion";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { GeneratedFlashcardSetResource } from "../../../../common/types/types";
import { NavigationButton } from "../../../../components";
import PreviewFlashcard from "../../../collection/components/flashcard-sets/PreviewFlashcard";
import { TutorialState } from "../../types";


const StyledMotionDiv = styled(motion.div)`
  ${tw`w-screen h-screen overflow-y-scroll px-4 absolute left-0 top-0 flex justify-center`}
`;

const StyledContentDiv = styled.div`
  ${tw`md:w-96 pt-20 md:pt-32 lg:pt-48 xl:pt-60`}
`;

const StyledTitle = styled.div`
  ${tw`text-2xl flex flex-wrap font-bold`}
`;

const StyledDescription = styled.p`
  ${tw`mt-4 md:mt-6`}
`;

const StyledFlashcardContainer = styled.div`
  ${tw`mt-6 pb-20 md:pb-60`}
`;

export const GeneratedFlashcardsSection = (props: {
  flashcardSet: GeneratedFlashcardSetResource | null;
  setFlashcardSet: (newValue: GeneratedFlashcardSetResource) => void;
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
}) => {
  const { flashcardSet, tutorialState, setTutorialState } = props;
  const isVisible = tutorialState == TutorialState.DISPLAYING_FLASHCARDS;
  const positionX = isVisible
    ? 0
    : [TutorialState.INTRODUCTION, TutorialState.SELECTING_IMAGE, TutorialState.GENERATING_FLASHCARDS].includes(
        tutorialState,
      )
    ? 600
    : -600;

  const handleFurtherButtonClick = () => setTutorialState(TutorialState.SAVING_FLASHCARDS);

  return (
    flashcardSet &&
    flashcardSet.flashcards.length > 0 && (
      <StyledMotionDiv
        initial={{ opacity: 0, x: positionX }}
        animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
        transition={{
          type: "tween",
          duration: 0.3,
        }}
      >
        <StyledContentDiv>
          <StyledTitle>Und hier sind deine neuen Lernkarten!</StyledTitle>
          <StyledDescription>
            Mit Hilfe von KI haben wir dir passende Lernkarten erstellt, die du jetzt noch anpassen kannst.
          </StyledDescription>

          <StyledFlashcardContainer>
            {flashcardSet.flashcards.map((flashcard, index) => (
              <PreviewFlashcard
                key={index}
                flashcard={flashcard}
                updateFlashcard={(updatedFlashcard) => {
                  const updatedFlashcards = [...flashcardSet.flashcards];
                  updatedFlashcards[index] = updatedFlashcard;
                  props.setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
                }}
              />
            ))}
            <div onClick={handleFurtherButtonClick}>
              <NavigationButton>Weiter</NavigationButton>
            </div>
          </StyledFlashcardContainer>
        </StyledContentDiv>
      </StyledMotionDiv>
    )
  );
};
