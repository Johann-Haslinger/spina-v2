import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { NavigationButton } from "../../../../components";
import { TutorialState } from "../../types";
import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledTitle = styled.p`
  ${tw`text-2xl font-bold`}
`;

export const ExplainingFlashcardBenefitsSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
}) => {
  const { tutorialState, setTutorialState } = props;
  const isVisible = tutorialState == TutorialState.EXPLAINING_FLASHCARD_BENEFITS;
  const positionX = isVisible
    ? 0
    : [
          TutorialState.INTRODUCTION,
          TutorialState.SELECTING_IMAGE,
          TutorialState.GENERATING_FLASHCARDS,
          TutorialState.DISPLAYING_FLASHCARDS,
          TutorialState.SAVING_FLASHCARDS,
          TutorialState.ADDING_SCHOOL_SUBJECTS,
          TutorialState.REVIEWING_FLASHCARDS,
        ].includes(tutorialState)
      ? 600
      : -600;

  const handleBackButtonClick = () => setTutorialState(TutorialState.REVIEWING_FLASHCARDS);
  const handleFurtherButtonClick = () => setTutorialState(TutorialState.EXPLAINING_OVERVIEW);

  return (
    <motion.div
      initial={{ opacity: 0, x: positionX }}
      animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
      tw="w-screen h-screen px-4 absolute left-0 top-0 flex justify-center"
    >
      <div tw="absolute left-4 opacity-40 top-4 text-xl" onClick={handleBackButtonClick}>
        <IoArrowBack />
      </div>

      <div tw="md:w-96  pb-14 h-full flex flex-col justify-between md:justify-start pt-20 md:pt-32 lg:pt-48 xl:pt-60">
        <div>
          <StyledTitle>Warum Karteikarten?</StyledTitle>
          <p tw="mt-4  md:mt-6">
            Karteikarten sind als Lernmethode besonders effektiv, weil sie gezieltes Wiederholen fördern. Durch die
            aktive Erinnerung und regelmäßige Abfrage werden Informationen besser im Langzeitgedächtnis verankert.
            <br />
            <br /> Zudem ermöglichen Karteikarten eine individuelle Anpassung des Lernrhythmus und schaffen eine
            effiziente Struktur für nachhaltiges Lernen.
          </p>
        </div>
        <NavigationButton onClick={handleFurtherButtonClick}>Weiter</NavigationButton>
      </div>
    </motion.div>
  );
};