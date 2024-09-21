// import { LeanScopeClientContext } from '@leanscope/api-client/browser';
// import { useIsStoryCurrent } from '@leanscope/storyboarding';
// import { useContext, useState } from 'react';
// import { Story } from '../../../../base/enums';
// import { ConversationMessage, Suggestion } from '../../../../base/types';
// import { CloseButton, FlexBox, Sheet } from '../../../../components';
// import SapientorConversationMessage from '../../../../components/content/SapientorConversationMessage';

// enum View {
//   CHOOSE_LEARNING_UNIT_TYPE,
//   NOTE,
//   LEARNING_CARDS,
//   VOCABULARY_CARDS,
// }

// const GeneratingLearningUnitFromImageSheet = () => {
//   const lsc = useContext(LeanScopeClientContext);
//   const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
//   const [currentView, setCurrentView] = useState<View>(View.CHOOSE_LEARNING_UNIT_TYPE);

//   const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

//   return (
//     <Sheet navigateBack={navigateBack} visible={isVisible}>
//       <FlexBox>
//         <div />
//         <CloseButton onClick={navigateBack} />
//       </FlexBox>
//       <ChooseLearningUnitTypeScreen setView={setCurrentView} />

//       {currentView === View.NOTE ? <GeneratingNoteScreen /> : <GeneratingFlashcardScreen />}
//     </Sheet>
//   );
// };

// export default GeneratingLearningUnitFromImageSheet;

// const ChooseLearningUnitTypeScreen = (props: { setView: (view: View) => void }) => {
//   const { setView } = props;
//   const [isTypingAnimationPlaying, setIsTypingAnimationPlaying] = useState(true);
//   const [conversation, setConversation] = useState<ConversationMessage[]>([
//     {
//       role: 'gpt',
//       message: `Hey! Möchtest du, dass ich dir eine verbesserte Erklärung oder Karteikarten zu diesem Bild erstelle?`,
//       suggestions: [
//         {
//           answer: 'Kannst du mir eine verbesserte Erklärung zu diesem Bild erstellen?',
//           func: () => setView(View.NOTE),
//         },
//         {
//           answer: 'Kannst du mir Lernkarten dazu erstellen?',
//           func: () => setView(View.LEARNING_CARDS),
//         },
//         {
//           answer: 'Kannst du mir Vokabelkarten dazu erstellen?',
//           func: () => setView(View.VOCABULARY_CARDS),
//         },
//       ],
//     },
//   ]);

//   const handleSugesstionClick = (suggestion: Suggestion) => {
//     setConversation([
//       ...conversation,
//       {
//         role: 'user',
//         message: suggestion.answer,
//       },
//     ]);
//     suggestion.func();
//   };

//   return (
//     <div>
//       {conversation.map((message, index) => (
//         <SapientorConversationMessage
//           onWritingAnimationPlayed={() => setIsTypingAnimationPlaying(false)}
//           key={index}
//           message={message}
//         />
//       ))}
//     </div>
//   );
// };

// const GeneratingNoteScreen = () => {
//   return <div />;
// };

// const GeneratingFlashcardScreen = () => {
//   return <div />;
// };
