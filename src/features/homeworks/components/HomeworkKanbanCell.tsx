import styled from "@emotion/styled";
import { Entity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import tw from "twin.macro";
import { RelationshipFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { Tags } from "@leanscope/ecs-models";
import { useDaysUntilDue } from "../../../hooks/useDaysUntilDue";
import { motion } from "framer-motion";
import { useSchoolSubject } from "../../../hooks/useSchoolSubject";

const StyledHomeworkCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledHomeworkCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`h-full  transition-all md:hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.color};
  color: ${(props) => props.backgroundColor};
`;

const StyledHomeworkCellTitle = styled.div`
  ${tw`text-lg line-clamp-2 font-black`}
`;
const StyledHomeworkCellSubtitle = styled.div`
  ${tw` text-sm font-medium line-clamp-2`}
`;



const HomeworkKanbanCell = (pops: {
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



  const handleOpenHomework = () => entity.add(Tags.SELECTED);

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
      <StyledHomeworkCellContainer onClick={handleOpenHomework}>
        <StyledHomeworkCellWrapper
          backgroundColor={backgroundColor}
          color={color}
        >
          <StyledHomeworkCellTitle>{title}</StyledHomeworkCellTitle>
          <StyledHomeworkCellSubtitle>
            {schoolSubjectTitle}, {daysUntilDue}
          </StyledHomeworkCellSubtitle>
        </StyledHomeworkCellWrapper>
      </StyledHomeworkCellContainer>
    </motion.div>
  );
};

export default HomeworkKanbanCell;
