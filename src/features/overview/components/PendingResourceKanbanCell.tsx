import styled from '@emotion/styled';
import { Entity } from '@leanscope/ecs-engine';
import { useEntityFacets } from '@leanscope/ecs-engine/react-api/hooks/useEntityFacets';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import { RelationshipFacet, TitleFacet } from '../../../app/additionalFacets';
import { useDaysUntilDue } from '../../../hooks/useDaysUntilDue';
import { useSchoolSubject } from '../../../hooks/useSchoolSubject';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { displayAlertTexts } from '../../../utils/displayText';

const StyledResourceCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledResourceCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`h-full  text-white text-opacity-60 bg-opacity-50 backdrop-blur-xl transition-all md:hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.backgroundColor};
`;

const StyledResourceCellTitle = styled.div`
  ${tw` line-clamp-2 font-bold leading-6`}
`;
const StyledResourceCellSubtitle = styled.div`
  ${tw` text-sm mt-0.5 text-opacity-50 font-medium line-clamp-2`}
`;

const PendingResourceKanbanCell = (props: { entity: Entity; backgroundColor: string; color: string }) => {
  const { entity, backgroundColor, color } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [titleProps, relationShipProps] = useEntityFacets(entity, TitleFacet, RelationshipFacet);
  const daysUntilDue = useDaysUntilDue(entity);
  const title = titleProps?.title || displayAlertTexts(selectedLanguage).noTitle;
  const relatedSchoolSubjectId = relationShipProps?.relationship;
  const { schoolSubjectTitle } = useSchoolSubject(relatedSchoolSubjectId);

  const handleOpenResource = () => entity.add(Tags.SELECTED);

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
      <StyledResourceCellContainer onClick={handleOpenResource}>
        <StyledResourceCellWrapper backgroundColor={backgroundColor} color={color}>
          <StyledResourceCellTitle>{title}</StyledResourceCellTitle>
          <StyledResourceCellSubtitle>
            {schoolSubjectTitle}, {daysUntilDue}
          </StyledResourceCellSubtitle>
        </StyledResourceCellWrapper>
      </StyledResourceCellContainer>
    </motion.div>
  );
};

export default PendingResourceKanbanCell;
