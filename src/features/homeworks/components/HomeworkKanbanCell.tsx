import styled from "@emotion/styled";
import { Entity } from "@leanscope/ecs-engine";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";
import { Tags } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { RelationshipFacet, TitleFacet } from "../../../app/additionalFacets";
import { useDaysUntilDue } from "../../../hooks/useDaysUntilDue";
import { useSchoolSubject } from "../../../hooks/useSchoolSubject";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../utils/displayText";
import { useSelectedTheme } from "../../collection/hooks/useSelectedTheme";

const StyledHomeworkCellContainer = styled.div`
  ${tw`w-full  transition-all h-32 px-2 py-1`}
`;
const StyledHomeworkCellWrapper = styled.div<{
  backgroundColor: string;
}>`
  ${tw`h-full  text-white text-opacity-60 bg-opacity-50 backdrop-blur-xl transition-all md:hover:scale-105  px-2.5 pt-2  w-full`}
  background-color: ${(props) => props.backgroundColor};
`;

const StyledHomeworkCellTitle = styled.div`
  ${tw` line-clamp-2 font-bold leading-6`}
`;
const StyledHomeworkCellSubtitle = styled.div`
  ${tw` text-sm mt-0.5 text-opacity-50 font-medium line-clamp-2`}
`;

const HomeworkKanbanCell = (props: { entity: Entity; backgroundColor: string; color: string }) => {
  const { entity, backgroundColor } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [titleProps, relationShipProps] = useEntityFacets(entity, TitleFacet, RelationshipFacet);
  const daysUntilDue = useDaysUntilDue(entity);
  const title = titleProps?.title || displayAlertTexts(selectedLanguage).noTitle;
  const relatedSchoolSubjectId = relationShipProps?.relationship;
  const { schoolSubjectTitle } = useSchoolSubject(relatedSchoolSubjectId);
  const { isDarkMode } = useSelectedTheme();

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
        <StyledHomeworkCellWrapper backgroundColor={isDarkMode ? backgroundColor + 60 : backgroundColor }>
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
