import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { GeneratedFlashcardSetResource } from '../../../../common/types/types';
import { NavigationButton } from '../../../../components';
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

  const handleBackButtonClick = () => setTutorialState(TutorialState.ADDING_SCHOOL_SUBJECTS);
  const openFlashcardQuiz = () => setIsFlashcardQuizVisible(true);
  // const closeFlashcardQuiz = () => {
  //   setIsFlashcardQuizVisible(false);
  //   setTimeout(() => setTutorialState(TutorialState.EXPLAINING_FLASHCARD_BENEFITS), 300);
  // };

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
          <div tw="absolute left-4 opacity-40 top-4 text-xl" onClick={handleBackButtonClick}>
            <IoArrowBack />
          </div>

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

        {/* <FlashcardQuiz
          isVisible={isFlashcardQuizVisible}
          navigateBack={closeFlashcardQuiz}
          flashcardSet={flashcardSet}
        /> */}
      </div>
    )
  );
};

// const updateFlashcardEntities = (flashcardEntities: Entity[]) => {};

// const saveLearningSession = (flashcardEntities: Entity[]) => {};

// const FlashcardQuiz = (props: {
//   isVisible: boolean;
//   navigateBack: () => void;
//   flashcardSet: GeneratedFlashcardSetResource;
// }) => {
//   const { isVisible, navigateBack, flashcardSet } = props;
//   const flashcardEntities = useFlashcardEntitiesForQuiz(flashcardSet);
//   const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

//   const closeFlashcardQuiz = () => navigateBack();
//   const navigateToNextFlashcard = () => setCurrentFlashcardIndex((prevIndex) => (prevIndex != 3 ? prevIndex + 1 : 3));

//   const endFlashcardQuiz = () => {
//     updateFlashcardEntities(flashcardEntities);
//     saveLearningSession(flashcardEntities);
//     navigateBack();
//   };

//   return (
//     <Sheet visible={isVisible} navigateBack={navigateBack}>
//       <FlexBox>
//         <div /> <CloseButton onClick={closeFlashcardQuiz} />
//       </FlexBox>
//       <Spacer />
//       {/* {flashcardEntities.map((flashcardEntity, idx) => (
//         <Flashcard
//           key={idx}
//           entity={flashcardEntity}
//           question={flashcardEntity.get(QuestionFacet)?.props.question || ''}
//           answer={flashcardEntity.get(AnswerFacet)?.props.answer || ''}
//           navigateToNextFlashcard={navigateToNextFlashcard}
//           viewState={idx === currentFlashcardIndex ? 'visible' : idx > currentFlashcardIndex ? 'left' : 'right'}
//         />
//       ))}
//       <FlashcardQuizEnd isVisible={currentFlashcardIndex === 3} endQuiz={endFlashcardQuiz} /> */}
//     </Sheet>
//   );
// };

// const StyledFlashcardCellContainer = styled(motion.div)`
//   ${tw` overflow-hidden h-full left-0 items-center top-0 pb-14  flex justify-center absolute w-full `}
// `;

// const StyledFlashcardWrapper = styled(motion.div)`
//   ${tw`bg-white overflow-y-scroll dark:text-white  dark:bg-opacity-5 mx-auto py-16  cursor-pointer flex items-center  w-11/12 md:w-8/12 xl:w-2/5 2xl:w-1/2 lg:w-2/3 h-60  p-4 rounded-2xl`}
// `;

// const StyledQuestionText = styled.div`
//   ${tw`text-lg py-4 text-center mx-auto w-fit font-bold `}
// `;

// const StyledAnswerText = styled.div`
//   ${tw`text-lg py-4 text-center mx-auto w-fit scale-x-[-1]  `}
// `;

// const StyledNavButtonContainer = styled.div`
//   ${tw`flex w-[95%] xl:w-1/3 md:w-2/5  absolute bottom-8 lg:bottom-[] 2xl:bottom-[14%] xl:right-1/3 md:right-[30%] xl:left-1/3 md:left-[30%] left-[2.5%] right-[2.5%] space-x-1 `}
// `;

// const StyledNavButtonAreaWrapper = styled.div`
//   ${tw`flex  space-x-1  w-full text-xl md:text-2xl  justify-between dark:bg-opacity-5 bg-white  bg-opacity-40 p-1   rounded-xl md:rounded-2xl  `}
// `;

// const StyledNavButton = styled.div`
//   ${tw`w-1/5 space-y-0.5  h-fit py-2.5 flex justify-center flex-col items-center rounded-lg md:rounded-xl lg:hover:opacity-70 transition-all dark:bg-opacity-5 bg-white `}
// `;

// const StyledLabel = styled.div`
//   ${tw`text-xs dark:text-secondary-text-dark text-secondary-text  line-clamp-1`}
// `;

// interface FlashcardProps extends AnswerProps, QuestionProps, EntityProps {
//   navigateToNextFlashcard: () => void;
//   viewState: 'visible' | 'left' | 'right';
// }

// const Flashcard = (props: FlashcardProps) => {
//   const { question, answer, navigateToNextFlashcard, viewState, entity } = props;
//   const isVisible = viewState === 'visible';
//   const [isFlipped, setIsFlipped] = useState(false);
//   const isDisplayed = useIsDisplayed(isVisible);

//   const handleNavigateToNextFlashcardClick = (
//     buttonClick: 'skip' | 'forgot' | 'partiallyRemembered' | 'rememberedWithEffort' | 'rememberedEasily',
//   ) => {
//     if (buttonClick === 'skip') {
//       entity.add(AdditionalTag.SKIP);
//     } else if (buttonClick === 'forgot') {
//       entity.add(AdditionalTag.FORGOT);
//     } else if (buttonClick === 'partiallyRemembered') {
//       entity.add(AdditionalTag.PARTIALLY_REMEMBERED);
//     } else if (buttonClick === 'rememberedWithEffort') {
//       entity.add(AdditionalTag.REMEMBERED_WITH_EFFORT);
//     } else if (buttonClick === 'rememberedEasily') {
//       entity.add(AdditionalTag.REMEMBERED_EASILY);
//     }

//     navigateToNextFlashcard();
//   };

//   return (
//     isDisplayed && (
//       <div>
//         <StyledFlashcardCellContainer transition={{ type: 'just' }}>
//           <div tw="h-full md:w-8/12 2xl:w-6/12 w-full overflow-hidden">
//             <motion.div
//               tw="w-full h-full flex justify-center items-center"
//               transition={{ type: 'just' }}
//               initial={{
//                 x: -600,
//                 opacity: 0,
//               }}
//               animate={{
//                 x: isVisible ? 0 : viewState == 'right' ? 600 : -600,
//                 opacity: isDisplayed ? 1 : 0,
//               }}
//             >
//               <StyledFlashcardWrapper
//                 initial={{ rotateY: 0 }}
//                 animate={{ rotateY: isFlipped ? 180 : 0 }}
//                 whileHover={{ scale: 1.05 }}
//                 style={{
//                   transformStyle: 'flat',
//                   transition: 'flat',
//                   transform: 'translateZ(0)',
//                 }}
//                 onClick={() => setIsFlipped((prev) => !prev)}
//               >
//                 {isFlipped ? (
//                   <StyledAnswerText>{answer}</StyledAnswerText>
//                 ) : (
//                   <StyledQuestionText>{question}</StyledQuestionText>
//                 )}
//               </StyledFlashcardWrapper>
//             </motion.div>
//           </div>
//         </StyledFlashcardCellContainer>
//         {isVisible && (
//           <StyledNavButtonContainer>
//             {isFlipped ? (
//               <StyledNavButtonAreaWrapper>
//                 <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('skip')}>
//                   <div>⏩</div>
//                   <StyledLabel>1 h</StyledLabel>
//                 </StyledNavButton>
//                 <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('forgot')}>
//                   <div>❌</div> <StyledLabel>1 min</StyledLabel>
//                 </StyledNavButton>
//                 <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('partiallyRemembered')}>
//                   <div>🤔</div> <StyledLabel>12 h</StyledLabel>
//                 </StyledNavButton>
//                 <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('rememberedWithEffort')}>
//                   <div>😀</div> <StyledLabel>24 h</StyledLabel>
//                 </StyledNavButton>
//                 <StyledNavButton onClick={() => handleNavigateToNextFlashcardClick('rememberedEasily')}>
//                   <div>👑</div> <StyledLabel>4 Tage</StyledLabel>
//                 </StyledNavButton>
//               </StyledNavButtonAreaWrapper>
//             ) : (
//               <StyledNavButtonAreaWrapper>
//                 <StyledNavButton tw="w-full" onClick={() => setIsFlipped((prev) => !prev)}>
//                   <div>🔄</div>
//                   <StyledLabel>Antwort</StyledLabel>
//                 </StyledNavButton>
//               </StyledNavButtonAreaWrapper>
//             )}
//           </StyledNavButtonContainer>
//         )}
//       </div>
//     )
//   );
// };

// const useIsDisplayed = (isVisible: boolean) => {
//   const [isDisplayed, setIsDisplayed] = useState(false);

//   useEffect(() => {
//     if (isVisible) {
//       setIsDisplayed(true);
//     } else {
//       setTimeout(() => {
//         setIsDisplayed(false);
//       }, 200);
//     }
//   }, [isVisible]);

//   return isDisplayed;
// };

// const useFlashcardEntitiesForQuiz = (flashcardSet: GeneratedFlashcardSetResource) => {
//   const [flashcardEntities, setFlashcardEntities] = useState<Entity[]>([]);

//   useEffect(() => {
//     const fetchFlashcardEntities = async () => {
//       // const { data: flashcards, error } = await supabaseClient
//       //   .from(SupabaseTable.FLASHCARDS)
//       //   .select('question, answer, id')
//       //   .eq('parentId', flashcardSet.id);

//       // if (error) {
//       //   console.error('Error fetching flashcards:', error);
//       // }
//       const flashcards = flashcardSet.flashcards;
//       const flashcardEntities = flashcards?.map((flashcard, idx) => {
//         const newFlashcardEntity = new Entity();
//         newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
//         newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
//         // newFlashcardEntity.add(new IdentifierFacet({ guid: flashcard.id|| idx }));
//         newFlashcardEntity.add(new IdentifierFacet({ guid: idx.toString() }));

//         return newFlashcardEntity;
//       });

//       if (!flashcardEntities) return;

//       setFlashcardEntities(flashcardEntities);
//     };

//     fetchFlashcardEntities();
//   }, [flashcardSet]);

//   return flashcardEntities;
// };

// const FlashcardQuizEnd = (props: { isVisible: boolean; endQuiz: () => void }) => {
//   const { isVisible } = props;

//   return (
//     isVisible && (
//       <div>
//         <StyledFlashcardCellContainer transition={{ type: 'just' }}>
//           <div tw="h-full md:w-8/12 2xl:w-6/12 w-full overflow-hidden">
//             <motion.div
//               tw="w-full h-full flex justify-center items-center"
//               transition={{ type: 'just' }}
//               initial={{
//                 x: -600,
//                 opacity: 0,
//               }}
//               animate={{
//                 x: isVisible ? 0 : -600,
//                 opacity: isVisible ? 1 : 0,
//               }}
//             >
//               <div tw="md:w-96 ">
//                 <p tw="text-2xl font-bold">Geschafft!</p>
//                 <p tw="mt-4 ">Glückwunsch zu deiner ersten Lernkarten-Abfrage mit Spina – du hast es geschafft! 🎉</p>
//               </div>
//             </motion.div>
//           </div>
//         </StyledFlashcardCellContainer>
//       </div>
//     )
//   );
// };
