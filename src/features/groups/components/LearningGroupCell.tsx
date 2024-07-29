import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { ColorProps, DescriptionProps, Tags } from "@leanscope/ecs-models";
import { IoPeople } from "react-icons/io5";
import tw from "twin.macro";
import { TitleProps } from "../../../app/additionalFacets";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../utils/displayText";

const StyledLearningGroupCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-6 h-fit`}
`;

const StyledLearningGroupCellWrapper = styled.div<{
  backgroundColor: string;
  color?: string;
}>`
  ${tw`w-full h-40 rounded-xl flex justify-center items-center  md:hover:scale-105 md:hover:text-[8.5rem] transition-all  text-8xl font-bold p-2 `}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color || "white"};
`;

const StyledLearningGroupTitle = styled.p`
  ${tw`mt-4 dark:text-white text-primatyText font-bold text-xl line-clamp-2 `}
`;
const StyledLearningGroupDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`;

const LearningGroupCell = (
  props: TitleProps & ColorProps & DescriptionProps & EntityProps,
) => {
  const { colorName, title, entity, description } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const openLearningGroup = () => entity.add(Tags.SELECTED);

  return (
    <StyledLearningGroupCellContainer onClick={openLearningGroup}>
      <StyledLearningGroupCellWrapper
        color={colorName}
        backgroundColor={colorName + "90"}
      >
        <IoPeople />
      </StyledLearningGroupCellWrapper>

      <StyledLearningGroupTitle>
        {title || displayAlertTexts(selectedLanguage).noTitle}
      </StyledLearningGroupTitle>
      <StyledLearningGroupDescription>
        {description || displayAlertTexts(selectedLanguage).noDescription}
      </StyledLearningGroupDescription>
    </StyledLearningGroupCellContainer>
  );
};

export default LearningGroupCell;
