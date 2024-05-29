import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { DescriptionProps, Tags } from "@leanscope/ecs-models";
import { IoBook, IoChevronForward } from "react-icons/io5";
import tw from "twin.macro";
import { TitleProps } from "../../../../app/additionalFacets";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts, displayButtonTexts } from "../../../../utils/displayText";
import { useAppState } from "../../hooks/useAppState";
import { useTopicColor } from "../../hooks/useTopicColor";

const StyledTopicCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-6 h-fit`}
`;

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`w-full h-40  rounded-xl flex justify-center items-center  md:hover:scale-105 transition-all  text-7xl font-bold p-2 `}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 dark:text-white text-primatyText font-bold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`;

const StyledMoreButtonWrapper = styled.div`
  ${tw`flex text-primaryColor  mt-3`}
`;

const StyledMoreButtonIcon = styled.div`
  ${tw`mt-1 ml-1`}
`;

const StyledMoreButtonText = styled.p`
  ${tw`hover:border-opacity-100 border-primaryColor border-b-2 border-opacity-0`}
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps) => {
  const { title, entity, description } = props;
  const { accentColor } = useTopicColor(entity);
  const { isSidebarVisible } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();

  const handleOpenTopic = () => {
    if (!isSidebarVisible) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledTopicCellContainer>
      <StyledTopicCellWrapper onClick={handleOpenTopic} color={accentColor} backgroundColor={accentColor + "90"}>
        <IoBook />
      </StyledTopicCellWrapper>
      <StyledTopicTitle>{title}</StyledTopicTitle>
      <StyledTopicDescription>
        {description || displayAlertTexts(selectedLanguage).noContentAddedTitle}
      </StyledTopicDescription>
      <StyledMoreButtonWrapper onClick={handleOpenTopic}>
        <StyledMoreButtonText>{displayButtonTexts(selectedLanguage).more}</StyledMoreButtonText>
        <StyledMoreButtonIcon>
          <IoChevronForward />
        </StyledMoreButtonIcon>
      </StyledMoreButtonWrapper>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
