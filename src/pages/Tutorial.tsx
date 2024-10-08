import TransitToTutorialSystem from '../features/tutorial/systems/TransitToTutorialSystem';

// enum TutorialStage {
//   INTRODUCTION,
//   OBSERVING,
//   INTERACTING,
//   PRACTICING,
//   CONCLUSION,
// }

const Tutorial = () => {
  // const isTutorialVisible = useIsStoryCurrent(Story.OBSERVING_TUTORIAL_STORY);
  // const [tutorialStage, setTutorialStage] = useState(TutorialStage.INTRODUCTION);

  return (
    <div>
      <TransitToTutorialSystem />
    </div>
  );
};

export default Tutorial;
