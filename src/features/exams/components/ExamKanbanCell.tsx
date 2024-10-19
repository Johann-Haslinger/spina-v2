import styled from '@emotion/styled';
import { Entity, useEntityComponents } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import { useDaysUntilDue } from '../../../common/hooks/useDaysUntilDue';
import { useSchoolSubject } from '../../../common/hooks/useSchoolSubject';
import { RelationshipFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { useSelectedTheme } from '../../collection/hooks/useSelectedTheme';

const StyledExamCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledExamCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`h-full text-white text-opacity-70 bg-opacity-50 backdrop-blur-xl transition-all md:hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.backgroundColor};
`;

const StyledExamCellTitle = styled.div`
  ${tw` line-clamp-2 font-bold leading-6`}
`;
const StyledExamCellSubtitle = styled.div`
  ${tw` text-sm mt-0.5 text-opacity-50 font-medium line-clamp-2`}
`;

const ExamKanbanCell = (pops: { entity: Entity; backgroundColor: string; color: string }) => {
  const { entity, backgroundColor, color } = pops;

  const [titleFacet, relationShipFacet] = useEntityComponents(entity, TitleFacet, RelationshipFacet);
  const daysUntilDue = useDaysUntilDue(entity);
  const title = titleFacet?.props.title || 'No Title';
  const relatedSchoolSubjectId = relationShipFacet?.props.relationship || '';
  const { schoolSubjectTitle } = useSchoolSubject(relatedSchoolSubjectId);
  const { isDarkModeActive: isDarkMode } = useSelectedTheme();

  const handleOpenExam = () => entity.add(Tags.SELECTED);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <StyledExamCellContainer onClick={handleOpenExam}>
        <StyledExamCellWrapper backgroundColor={isDarkMode ? backgroundColor + 60 : backgroundColor} color={color}>
          <StyledExamCellTitle>{title}</StyledExamCellTitle>
          <StyledExamCellSubtitle>
            {schoolSubjectTitle}, {daysUntilDue}
          </StyledExamCellSubtitle>
        </StyledExamCellWrapper>
      </StyledExamCellContainer>
    </motion.div>
  );
};

export default ExamKanbanCell;
