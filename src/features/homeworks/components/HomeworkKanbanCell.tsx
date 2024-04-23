import styled from "@emotion/styled";
import { Entity, useEntity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import tw from "twin.macro";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { IdentifierFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { useDaysUntilDue } from "../../../hooks/useDaysUntilDue";
import { motion } from "framer-motion";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjectEntities";

const StyledHomeworkCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledHomeworkCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`h-full  transition-all hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.color};
  color: ${(props) => props.backgroundColor};
`;

const StyledHomeworkCellTitle = styled.div`
  ${tw`text-lg line-clamp-2 font-black`}
`;
const StyledHomeworkCellSubtitle = styled.div`
  ${tw` text-sm font-medium line-clamp-2`}
`;

interface HomeworkKanbanCellProps {
  backgroundColor: string;
  color: string;
}

const HomeworkKanbanCell = (pops: {
  entity: Entity;
  backgroundColor: string;
  color: string;
}) => {
  const { entity, backgroundColor, color } = pops;

  const [titleProps, parentProps] = useEntityFacets(
    entity,
    TitleFacet,
    ParentFacet
  );
  const daysUntilDue = useDaysUntilDue(entity);
  const title = titleProps?.title || "No Title";
  const parentId = parentProps?.parentId || "No Parent";
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const parentSchoolSubjectEntity = schoolSubjectEntities.find(
    (e) =>
      e.get(IdentifierFacet)?.props.guid === parentId &&
      dataTypeQuery(e, DataTypes.SCHOOL_SUBJECT)
  );

  const parentSchoolSubjectTitle =
    parentSchoolSubjectEntity?.get(TitleFacet)?.props.title ||
    "No School Subject";

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
            {parentSchoolSubjectTitle}, {daysUntilDue}
          </StyledHomeworkCellSubtitle>
        </StyledHomeworkCellWrapper>
      </StyledHomeworkCellContainer>
    </motion.div>
  );
};

export default HomeworkKanbanCell;
