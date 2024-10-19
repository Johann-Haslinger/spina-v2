import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { FlexBox, NavigationButton } from '../../../../components';
import { TutorialState } from '../../types';

const StyledMotionDiv = styled(motion.div)`
  ${tw`w-screen h-screen px-4 absolute left-0 top-0 flex flex-col items-center`}
`;

const StyledBackButton = styled.div`
  ${tw`text-xl`}
`;

const StyledContainerDiv = styled.div`
  ${tw`md:w-96 pb-14 h-full flex flex-col justify-between md:justify-start pt-20 md:pt-32 lg:pt-48 xl:pt-60`}
`;

const StyledTitle = styled.p`
  ${tw`text-2xl font-bold`}
`;

const StyledDescription = styled.p`
  ${tw`mt-4 md:mt-6`}
`;

const StyledInputContainer = styled.div`
  ${tw`mt-6 rounded-lg`}
`;

const StyledInput = styled.input`
  ${tw`mt-4`}
`;

const StyledHint = styled.p`
  ${tw`mt-2 text-secondary-text text-sm`}
`;

export const SelectingImageSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
  handleImageSelection: (image: File) => void;
}) => {
  const { tutorialState, setTutorialState, handleImageSelection } = props;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const isVisible = tutorialState == TutorialState.SELECTING_IMAGE;
  const positionX = isVisible ? 0 : tutorialState == TutorialState.INTRODUCTION ? 600 : -600;

  const handleBackButtonClick = () => setTutorialState(TutorialState.INTRODUCTION);
  const handleFurtherButtonClick = () => {
    handleImageSelection(selectedImage as File);
    setTutorialState(TutorialState.GENERATING_FLASHCARDS);
  };

  return (
    <StyledMotionDiv
      initial={{ opacity: 0, x: positionX }}
      animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
      transition={{
        type: 'tween',
        duration: 0.3,
      }}
    >
      <FlexBox tw="p-4 text-secondary-text absolute top-0 left-0 w-screen">
        <StyledBackButton onClick={handleBackButtonClick}>
          <IoArrowBack />
        </StyledBackButton>
      </FlexBox>

      <StyledContainerDiv>
        <div>
          <StyledTitle>Lernkarten aus einem Bild erzeugen</StyledTitle>
          <StyledDescription>
            Du kannst dir in Spina aus deinen Tafelbildern oder Vokabellisten Lernkarten erstellen - Probiere es aus!
          </StyledDescription>
          <StyledInputContainer>
            <StyledInput type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
            <StyledHint>Wähle ein Bild aus, um fortzufahren</StyledHint>
          </StyledInputContainer>
        </div>
        <NavigationButton isBlocked={!selectedImage} onClick={handleFurtherButtonClick}>
          Weiter
        </NavigationButton>
      </StyledContainerDiv>
    </StyledMotionDiv>
  );
};
