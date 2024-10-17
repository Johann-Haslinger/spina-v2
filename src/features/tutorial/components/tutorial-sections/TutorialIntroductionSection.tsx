import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import { NavigationButton } from '../../../../components';
import { TutorialState } from '../../types';

const StyledTitle = styled.p`
  ${tw`text-3xl font-extrabold`}
`;

const StyledMotionDiv = styled(motion.div)`
  ${tw`h-screen overflow-hidden absolute px-4 left-0 top-0 w-screen pt-20 md:pt-32 lg:pt-48 xl:pt-60 flex justify-center`}
`;

const StyledContainerDiv = styled.div`
  ${tw`md:w-96 w-full flex flex-col justify-between md:justify-start pb-14 h-full`}
`;

const StyledEmoji = styled.p`
  ${tw`md:text-6xl text-5xl mb-8`}
`;

const StyledDescription = styled.p`
  ${tw`mt-4 md:mt-8`}
`;

export const TutorialIntroductionSection = (props: {
  isVisible: boolean;
  setTutorialState: (newValue: TutorialState) => void;
}) => {
  const { isVisible, setTutorialState } = props;

  const handleButtonClick = () => setTutorialState(TutorialState.SELECTING_IMAGE);

  return (
    <StyledMotionDiv
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -600 }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
    >
      <StyledContainerDiv>
        <div>
          <StyledEmoji>🎉</StyledEmoji>
          <StyledTitle>Willkommen bei Spina!</StyledTitle>
          <StyledDescription>
            Wir führen dich jetzt schnell durch die wichtigsten Funktionen, damit du direkt loslegen kannst.
          </StyledDescription>
        </div>
        <NavigationButton onClick={handleButtonClick}>
          <span>Los geht's!</span>
        </NavigationButton>
      </StyledContainerDiv>
    </StyledMotionDiv>
  );
};

export default TutorialIntroductionSection;
