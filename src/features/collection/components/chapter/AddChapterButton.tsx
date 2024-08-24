import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../../../base/enums';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const StyledButtonWrapper = styled.div<{ color: string }>`
  ${tw`flex tems-center  space-x-4`}
  color: ${({ color }) => color};
`;

const StyledIcon = styled.div`
  ${tw`text-2xl`}
`;

const AddChapterButton = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { accentColor } = useSelectedSchoolSubjectColor();

  const openAddChapterSheet = () => lsc.stories.transitTo(Story.ADDING_CHAPTER_STORY);

  return (
    <StyledButtonWrapper color={accentColor} onClick={openAddChapterSheet}>
      <StyledIcon>
        <IoAdd />
      </StyledIcon>
      <p>Kapitel hinzufügen</p>
    </StyledButtonWrapper>
  );
};

export default AddChapterButton;
