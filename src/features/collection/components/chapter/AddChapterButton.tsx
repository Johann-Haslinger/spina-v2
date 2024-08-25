import styled from '@emotion/styled';
import { IoAdd } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const StyledButtonWrapper = styled.div<{ color: string }>`
  ${tw`flex items-center text-primaryColor py-3 pl-4 space-x-4`}/* color: ${({ color }) => color}; */
`;

const StyledIcon = styled.div`
  ${tw`text-2xl`}
`;

const AddChapterButton = () => {
  const { accentColor } = useSelectedSchoolSubjectColor();

  const addChapter = () => {
    console.log('add chapter');
  };

  return (
    <StyledButtonWrapper color={accentColor} onClick={addChapter}>
      <StyledIcon>
        <IoAdd />
      </StyledIcon>
      <p>Kapitel hinzufügen</p>
    </StyledButtonWrapper>
  );
};

export default AddChapterButton;
