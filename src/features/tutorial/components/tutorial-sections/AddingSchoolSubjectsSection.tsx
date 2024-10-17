import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoArrowBack, IoRemoveCircle, IoAddCircle } from 'react-icons/io5';
import { SCHOOL_SUBJECTS } from '../../../../common/types/constants';
import { Section, SectionRow, Spacer, TextInput, NavigationButton } from '../../../../components';
import { TutorialState } from '../../types';
import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledTitle = styled.p`
  ${tw`text-2xl font-bold`}
`;

export const AddingSchoolSubjectsSection = (props: {
  tutorialState: TutorialState;
  setTutorialState: (newValue: TutorialState) => void;
  schoolSubjects: string[];
  setSchoolSubjects: (newValue: string[]) => void;
  handleSaveUserData: () => void;
}) => {
  const { tutorialState, setTutorialState, schoolSubjects, setSchoolSubjects, handleSaveUserData } = props;
  const isVisible = tutorialState == TutorialState.ADDING_SCHOOL_SUBJECTS;
  const [customSchoolSubject, setCustomSchoolSubject] = useState('');
  const positionX = isVisible
    ? 0
    : [
          TutorialState.INTRODUCTION,
          TutorialState.SELECTING_IMAGE,
          TutorialState.GENERATING_FLASHCARDS,
          TutorialState.DISPLAYING_FLASHCARDS,
          TutorialState.SAVING_FLASHCARDS,
        ].includes(tutorialState)
      ? 600
      : -600;

  const handleFurtherButtonClick = () => {
    handleSaveUserData();
    setTutorialState(TutorialState.REVIEWING_FLASHCARDS);
  };
  const handleBackButtonClick = () => setTutorialState(TutorialState.SAVING_FLASHCARDS);

  const findMissingSubjects = () => {
    const missingSubjects: string[] = [];

    for (const subject of SCHOOL_SUBJECTS) {
      const isMissing = !schoolSubjects.some((s) => s === subject);
      if (isMissing) {
        missingSubjects.push(subject);
      }
    }

    return missingSubjects;
  };

  const addSchoolSubject = (schoolSubject: string) => setSchoolSubjects([...schoolSubjects, schoolSubject]);
  const removeSchoolSubject = (schoolSubject: string) =>
    setSchoolSubjects(schoolSubjects.filter((s) => s !== schoolSubject));
  const addCustomSchoolSubject = () => {
    if (customSchoolSubject) {
      setSchoolSubjects([...schoolSubjects, customSchoolSubject]);
      setCustomSchoolSubject('');
    }
  };

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
          <StyledTitle>Wähle deine Schulfächer aus</StyledTitle>
          <p tw="mt-4  md:mt-6">Wähle deine Schulfächer aus. Du kannst diese später in den Einstellungen noch anpassen.</p>

          <div tw="mt-6">
            {schoolSubjects.length > 0 && (
              <div>
                <Section>
                  {schoolSubjects.map((schoolSubject, idx) => (
                    <SectionRow
                      icon={<IoRemoveCircle color="#ef4444" />}
                      key={idx}
                      last={idx == schoolSubjects.length - 1}
                      onClick={() => removeSchoolSubject(schoolSubject)}
                    >
                      {schoolSubject}
                    </SectionRow>
                  ))}
                </Section>
                <Spacer size={2} />
              </div>
            )}

            {findMissingSubjects().length > 0 && (
              <Section>
                {findMissingSubjects().map((schoolSubject, idx) => (
                  <SectionRow
                    icon={<IoAddCircle color="#3b82f6" />}
                    key={idx}
                    onClick={() => addSchoolSubject(schoolSubject)}
                  >
                    {schoolSubject}
                  </SectionRow>
                ))}
                <SectionRow
                  icon={
                    <IoAddCircle
                      onClick={addCustomSchoolSubject}
                      color={customSchoolSubject ? '#3b82f6' : '#3b82f670'}
                    />
                  }
                  last
                >
                  <TextInput
                    value={customSchoolSubject}
                    onChange={(e) => setCustomSchoolSubject(e.target.value)}
                    placeholder="Sonstiges Schulfach"
                  />
                </SectionRow>
              </Section>
            )}
          </div>
        </div>

        <div tw="pb-12 md:pb-40">
          <NavigationButton isBlocked={schoolSubjects.length == 0} onClick={handleFurtherButtonClick}>
            Weiter
          </NavigationButton>
        </div>
      </div>
    </motion.div>
  );
};
