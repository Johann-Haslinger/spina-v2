import styled from '@emotion/styled/macro';
import { EntityProps } from '@leanscope/ecs-engine';
import { OrderProps, Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoBook, IoChevronForward } from 'react-icons/io5';
import tw from 'twin.macro';
import { TitleProps } from '../../../../app/additionalFacets';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const StyledContainer = styled.div`
  ${tw`py-3 items-center pl-4 flex justify-between`}
`;

const StyledContent = styled(motion.div)`
  ${tw`flex space-x-4 items-center`}
`;

const StyledIcon = styled.div<{ color: string }>`
  ${tw`text-xl`}
  color: ${({ color }) => color};
`;

const StyledText = styled.p`
  ${tw`font-semibold`}
`;

const StyledChevron = styled.div`
  ${tw`text-lg text-opacity-80 text-seconderyText`}
`;

const ChapterRow = (props: TitleProps & OrderProps & EntityProps) => {
  const { title, orderIndex = 0, entity } = props;
  const { accentColor } = useSelectedSchoolSubjectColor();
  const [isHovered, setIsHovered] = useState(false);

  const openChapter = () => entity.add(Tags.SELECTED);

  return (
    <StyledContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openChapter}
    >
      <StyledContent animate={{ x: isHovered ? 5 : 0 }}>
        <StyledIcon color={accentColor}>
          <IoBook />
        </StyledIcon>
        <StyledText>
          <span>Kapitel {orderIndex + 1} -</span> {title}
        </StyledText>
      </StyledContent>
      <StyledChevron>
        <IoChevronForward />
      </StyledChevron>
    </StyledContainer>
  );
};

export default ChapterRow;
