import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { useTopicColor } from "../../hooks/useTopicColor";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { DescriptionProps, Tags } from "@leanscope/ecs-models";
import { IoBook } from "react-icons/io5";
import { useAppState } from "../../hooks/useAppState";

const StyledTopicCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-6 h-fit`}
`;

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`w-full h-40 text-white text-opacity-40 rounded-xl flex justify-center items-center  hover:scale-105 transition-all  text-7xl font-bold p-2 `}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 dark:text-white text-primatyText font-bold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps) => {
  const { title, entity, description } = props;
  const { color, backgroundColor } = useTopicColor(entity);
  const { isSidebarVisible } = useAppState();

  const handleOpenTopic = () => {
    if (!isSidebarVisible) {
      entity.addTag(Tags.SELECTED);
    }
  };

  return (
    <StyledTopicCellContainer>
      <StyledTopicCellWrapper
        onClick={handleOpenTopic}
        color={color}
        backgroundColor={backgroundColor}
      >
        <IoBook />
      </StyledTopicCellWrapper>
      <StyledTopicTitle>{title}</StyledTopicTitle>
      <StyledTopicDescription>{description || "No description added"}</StyledTopicDescription>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
