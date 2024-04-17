import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { useTopicColor } from "../../hooks/useTopicColor";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { Tags } from "@leanscope/ecs-models";
import { LuBookOpen } from "react-icons/lu";
import { IoBook } from "react-icons/io5";

const StyledTopicCellContainer = styled.div`
  ${tw` w-full md:w-1/2 lg:w-1/3 p-2 h-40`}
`;

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`w-full flex justify-center items-center  hover:scale-105 transition-all rounded-2xl text-7xl font-bold p-2 h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 font-semibold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-seconderyText line-clamp-2 mt-1`}
`

const StyledTopicIcon = styled.div<{ color: string }>`
  ${tw`  size-16 mx-auto mt-8 `}
  background-color: ${({ color }) => color};
`;


const TopicCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { color, backgroundColor } = useTopicColor(entity);
 

  const handleOpenTopic = () => {
    entity.addTag(Tags.SELECTED);
  };

  return (
    <StyledTopicCellContainer>
      <StyledTopicCellWrapper
        onClick={handleOpenTopic}
        color={color}
        backgroundColor={backgroundColor}
      >
       {/* <StyledTopicIcon color={color} /> */}
       <IoBook />
      </StyledTopicCellWrapper>
      <StyledTopicTitle>{title}</StyledTopicTitle>
      <StyledTopicDescription>Lorem ipsum dolor sit amet etum non situm.</StyledTopicDescription>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
