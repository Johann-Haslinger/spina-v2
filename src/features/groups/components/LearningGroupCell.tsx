import { ColorProps, DescriptionProps, Tags } from "@leanscope/ecs-models"
import { TitleProps } from "../../../app/additionalFacets"
import { EntityProps } from "@leanscope/ecs-engine"
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../utils/displayText";
import { IoPeople } from "react-icons/io5";

const StyledTopicCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-6 h-fit`}
`;

const StyledTopicCellWrapper = styled.div<{
  backgroundColor: string;
}>`
  ${tw`w-full h-40  text-white text-opacity-40 rounded-xl flex justify-center items-center  md:hover:scale-105 transition-all  text-7xl font-bold p-2 `}
  background-color: ${({ backgroundColor }) => backgroundColor};  
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 dark:text-white text-primatyText font-bold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`;

const LearningGroupCell = (props: TitleProps & ColorProps & DescriptionProps & EntityProps) => {
  const { colorName, title, entity, description } = props
  const { selectedLanguage } = useSelectedLanguage()

  const openLearningGroup = () => entity.add(Tags.SELECTED)

  return (
    <StyledTopicCellContainer onClick={openLearningGroup}>
      <StyledTopicCellWrapper backgroundColor={colorName || "blue"}>
        <IoPeople />
      </StyledTopicCellWrapper>

      <StyledTopicTitle>
        {title || displayAlertTexts(selectedLanguage).noTitle}
      </StyledTopicTitle>
      <StyledTopicDescription>
        {description || displayAlertTexts(selectedLanguage).noDescription}
      </StyledTopicDescription>
    </StyledTopicCellContainer>
  )
}

export default LearningGroupCell