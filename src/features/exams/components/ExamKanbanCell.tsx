import styled from "@emotion/styled";
import { Entity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { Tags } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { TitleFacet, RelationshipFacet } from "../../../app/a";
import { useDaysUntilDue } from "../../../hooks/useDaysUntilDue";
import { useSchoolSubject } from "../../../hooks/useSchoolSubject";

const StyledExamCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledExamCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`h-full  transition-all hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.color};
  color: ${(props) => props.backgroundColor};
`;

const StyledExamCellTitle = styled.div`
  ${tw`text-lg line-clamp-2 font-black`}
`;
const StyledExamCellSubtitle = styled.div`
  ${tw` text-sm font-medium line-clamp-2`}
`;



const ExamKanbanCell = (pops: {
  entity: Entity;
  backgroundColor: string;
  color: string;
}) => {
  const { entity, backgroundColor, color } = pops;

  const [titleProps, relationShipProps ] = useEntityFacets(
    entity,
    TitleFacet, RelationshipFacet
  );
  const daysUntilDue = useDaysUntilDue(entity);
  const title = titleProps?.title || "No Title";
  const relatedSchoolSubjectId = relationShipProps?.relationship
  const {schoolSubjectTitle} = useSchoolSubject(relatedSchoolSubjectId);



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
        <StyledExamCellWrapper
          backgroundColor={backgroundColor}
          color={color}
        >
          <StyledExamCellTitle>{title}</StyledExamCellTitle>
          <StyledExamCellSubtitle>
            {schoolSubjectTitle}, {daysUntilDue}
          </StyledExamCellSubtitle>
        </StyledExamCellWrapper>
      </StyledExamCellContainer>
    </motion.div>
  );
};

export default ExamKanbanCell