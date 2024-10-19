import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IoArrowBack, IoCreateOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { GeneratedFlashcardSetResource } from '../../../../common/types/types';
import {
  FlexBox,
  NavigationButton,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextInput,
} from '../../../../components';
import { ParentDetails, TutorialState } from '../../types';

const StyledMotionDiv = styled(motion.div)`
  ${tw`w-screen h-screen px-4 absolute left-0 top-0 flex justify-center`}
`;

const StyledBackButton = styled.div`
  ${tw`absolute left-4 opacity-40 top-4 text-xl`}
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

const StyledEditLink = styled.div`
  ${tw`text-primary-color hover:opacity-80 transition-all cursor-pointer mt-4 space-x-2 flex items-center`}
`;

const StyledIcon = styled.div`
  ${tw`text-lg`}
`;

export const SavingFlashcardsSection = (props: {
  flashcardSet: GeneratedFlashcardSetResource | null;
  setFlashcardSet: (newValue: GeneratedFlashcardSetResource) => void;
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
  parentDetails: ParentDetails | null;
  setParentDetails: (newValue: ParentDetails) => void;
}) => {
  const { flashcardSet, tutorialState, setTutorialState, setFlashcardSet, setParentDetails } = props;
  const isVisible = tutorialState == TutorialState.SAVING_FLASHCARDS;
  const [isEditingSheetVisible, setIsEditingSheetVisible] = useState(false);
  const positionX = isVisible
    ? 0
    : [
          TutorialState.INTRODUCTION,
          TutorialState.SELECTING_IMAGE,
          TutorialState.GENERATING_FLASHCARDS,
          TutorialState.DISPLAYING_FLASHCARDS,
        ].includes(tutorialState)
      ? 600
      : -600;

  const handleFurtherButtonClick = () => setTutorialState(TutorialState.ADDING_SCHOOL_SUBJECTS);
  const handleBackButtonClick = () => setTutorialState(TutorialState.DISPLAYING_FLASHCARDS);
  const openEditingSheet = () => setIsEditingSheetVisible(true);
  const closeEditingSheet = () => setIsEditingSheetVisible(false);

  const saveFlashcardSetDetails = (details: { topicTitle: string; schoolSubjectTitle: string; title: string }) => {
    if (!flashcardSet) return;

    setFlashcardSet({ ...flashcardSet, title: details.title });
    setParentDetails(details);
    closeEditingSheet();
  };

  return (
    <div>
      <StyledMotionDiv
        initial={{ opacity: 0, x: positionX }}
        animate={{ opacity: isVisible ? 1 : 0, x: positionX, display: isVisible ? 'flex' : 'none' }}
        transition={{
          type: 'tween',
          duration: 0.3,
        }}
      >
        <StyledBackButton onClick={handleBackButtonClick}>
          <IoArrowBack />
        </StyledBackButton>

        <StyledContainerDiv>
          <div>
            <StyledTitle>Lernkarten abspeichern</StyledTitle>
            <StyledDescription>
              Basierend auf deinem Bild würden wir die Lernkarten unter dem Titel <b>"{flashcardSet?.title}"</b> im
              Schulfach <b>"{props.parentDetails?.schoolSubjectTitle}"</b> und Thema{' '}
              <b>"{props.parentDetails?.topicTitle}"</b> abspeichern.
            </StyledDescription>
            <StyledEditLink onClick={openEditingSheet}>
              <StyledIcon>
                <IoCreateOutline />
              </StyledIcon>
              <p>Ändern</p>
            </StyledEditLink>
          </div>
          <NavigationButton onClick={handleFurtherButtonClick}>Weiter</NavigationButton>
        </StyledContainerDiv>
      </StyledMotionDiv>

      <EditFlashcardSetDetailsSheet
        saveDetails={saveFlashcardSetDetails}
        isVisible={isEditingSheetVisible}
        navigateBack={closeEditingSheet}
        details={{
          topicTitle: props.parentDetails?.topicTitle || '',
          schoolSubjectTitle: props.parentDetails?.schoolSubjectTitle || '',
          title: flashcardSet?.title || '',
        }}
      />
    </div>
  );
};

const EditFlashcardSetDetailsSheet = (props: {
  isVisible: boolean;
  navigateBack: () => void;
  details: { topicTitle: string; schoolSubjectTitle: string; title: string };
  saveDetails: (details: { topicTitle: string; schoolSubjectTitle: string; title: string }) => void;
}) => {
  const { isVisible, navigateBack, details, saveDetails } = props;
  const { editedDetails, setEditedDetails } = useEditedFlashcardSetDetails(details);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>Abbrechen</SecondaryButton>
        {editedDetails != details && (
          <PrimaryButton onClick={() => saveDetails(editedDetails)}>Speichern</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last>
          <TextInput
            value={editedDetails.title}
            onChange={(e) => setEditedDetails({ ...editedDetails, title: e.target.value })}
            placeholder="Titel"
          />
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow>
          <TextInput
            value={editedDetails.topicTitle}
            onChange={(e) => setEditedDetails({ ...editedDetails, topicTitle: e.target.value })}
            placeholder="Thema"
          />
        </SectionRow>
        <SectionRow last>
          <TextInput
            value={editedDetails.schoolSubjectTitle}
            onChange={(e) => setEditedDetails({ ...editedDetails, schoolSubjectTitle: e.target.value })}
            placeholder="Schulfach"
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

const useEditedFlashcardSetDetails = (initialDetails: {
  topicTitle: string;
  schoolSubjectTitle: string;
  title: string;
}) => {
  const [editedDetails, setEditedDetails] = useState(initialDetails);

  useEffect(() => {
    setEditedDetails(initialDetails);
  }, [initialDetails]);

  return { editedDetails, setEditedDetails };
};
