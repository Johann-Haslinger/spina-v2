import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { DescriptionProps, ImageProps, Tags } from "@leanscope/ecs-models";
import { IoBook } from "react-icons/io5";
import tw from "twin.macro";
import { TitleProps } from "../../../../app/additionalFacets";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../../utils/displayText";
import { useAppState } from "../../hooks/useAppState";
import { useTopicColor } from "../../hooks/useTopicColor";

const StyledTopicCellContainer = styled.div`
  ${tw` w-full cursor-pointer pb-4 h-fit`}
`;

const StyledTopicCellWrapper = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`w-full h-40 overflow-hidden rounded-xl flex  items-center transition-all  text-7xl font-bold`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledTopicInfoWrapper = styled.div<{ color?: string }>`
  ${tw`p-4 px-6 w-1/2 hover:w-7/12 hover:pl-12 transition-all h-full  backdrop-blur-lg hover:bg-opacity-15 hover:backdrop-blur-2xl bg-black bg-opacity-10`}
  background-color: ${({ color }) => color};
  ${({ color }) => !color && tw`shadow-xl  hover:shadow-2xl `}
`;

const StyledTopicTitle = styled.p`
  ${tw`mt-4 text-white font-bold text-xl line-clamp-2 `}
`;
const StyledTopicDescription = styled.p`
  ${tw` text-white text-sm w-5/6 font-normal line-clamp-2 mt-1`}
`;

const StyledImageBackground = styled.div<{ image: string }>`
  ${tw`w-full bg-cover h-full text-white flex`}
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledTopicIcon = styled.div<{ color: string }>`
  ${tw`w-1/2 flex justify-center items-center text-8xl`}
  color: ${({ color }) => color};
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const { title, entity, description, imageSrc } = props;
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
        <StyledImageBackground image={imageSrc || ""}>
          <StyledTopicInfoWrapper color={!imageSrc ? accentColor : ""}>
            <StyledTopicTitle>{title}</StyledTopicTitle>
            <StyledTopicDescription>
              {description || displayAlertTexts(selectedLanguage).noContentAddedTitle}
            </StyledTopicDescription>
          </StyledTopicInfoWrapper>

          {!imageSrc && (
            <StyledTopicIcon color={accentColor}>
              <IoBook />
            </StyledTopicIcon>
          )}
        </StyledImageBackground>
      </StyledTopicCellWrapper>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
