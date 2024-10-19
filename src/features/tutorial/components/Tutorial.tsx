import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useState } from 'react';
import { Story } from '../../../common/types/enums';
import { TutorialState } from '../types';
import TutorialView from './TutorialView';

const Tutorial = () => {
  const isTutorialPlaying = useIsStoryCurrent(Story.OBSERVING_TUTORIAL_STORY);
  const [tutorialState, setTutorialState] = useState<TutorialState>(TutorialState.SELECTING_IMAGE);

  return (
    isTutorialPlaying && (
      <div>
        <TutorialView tutorialState={tutorialState} setTutorialState={setTutorialState} />
        {/* <TutorialTextBoxes tutorialState={tutorialState} setTutorialState={setTutorialState} /> */}
      </div>
    )
  );
};

export default Tutorial;

// const TutorialTextBoxes = (props: {
//   tutorialState: TutorialState;
//   setTutorialState: (newValue: TutorialState) => void;
// }) => {
//   const { tutorialState, setTutorialState } = props;

//   return (
//     <div>
//       <ExplainingOverviewTextBox
//         isVisible={tutorialState === TutorialState.EXPLAINING_OVERVIEW}
//         setTutorialState={setTutorialState}
//       />
//     </div>
//   );
// };

// const ExplainingOverviewTextBox = (props: {
//   isVisible: boolean;
//   setTutorialState: (newValue: TutorialState) => void;
// }) => {
//   const { isVisible, setTutorialState } = props;

//   const handleFurtherButtonClick = () => {
//     setTutorialState(TutorialState.SELECTING_IMAGE);
//   };

//   return (
//     <TextBox isVisible={isVisible}>
//       <div>

//         <p tw="mt-1">Das ist die <b>Übersichtsseite</b>. Hier siehst auf einen Blick, alles was für dein Schulaltag wichtig ist.</p>
//       </div>
//       <div tw="flex text-primary-color hover:opacity-80 transition-all hover:cursor-pointer space-x-2 items-center">
//         <p>Weiter</p>
//         <div>
//           <IoChevronForward />
//         </div>
//       </div>
//     </TextBox>
//   );
// };

// const StyledTextBoxWrapper = styled(motion.div)`
//   ${tw`absolute dark:text-white dark:text-opacity-80 dark:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)]  flex flex-col justify-between min-h-40 bottom-8 w-[95%] md:w-1/2 xl:w-1/3 left-[2.5%] md:left-1/4 xl:left-1/3 backdrop-blur-3xl bg-white  bg-opacity-50 dark:bg-white dark:bg-opacity-5 rounded-2xl px-6 py-5`}
// `;

// interface TextBoxProps extends PropsWithChildren {
//   isVisible: boolean;
// }

// const TextBox = (props: TextBoxProps) => {
//   const { isVisible, children } = props;

//   return (
//     <StyledTextBoxWrapper
//       initial={{ opacity: 0, scale: 0.5, y: 100 }}
//       animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5, y: isVisible ? 0 : 100 }}
//     >
//       {children}
//     </StyledTextBoxWrapper>
//   );
// };
