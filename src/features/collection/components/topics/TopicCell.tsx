import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { DescriptionProps, ImageProps, Tags } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { IoBook, IoColorWand } from "react-icons/io5";
import tw from "twin.macro";
import { TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags } from "../../../../base/enums";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts } from "../../../../utils/displayText";
import { generateImageForTopic } from "../../functions/generateImageForTopic";
import { useAppState } from "../../hooks/useAppState";
import { useTopicColor } from "../../hooks/useTopicColor";

const StyledGeneratingIndecatorWrapper = styled.div`
  ${tw`flex w-full mt-14  items-center justify-center`}
`;

const GeneratingIndecator = (props: { color: string }) => {
  const { color } = props;

  return (
    <StyledGeneratingIndecatorWrapper>
      <motion.div
        style={{
          backgroundColor: color,
          width: "2rem",
          height: "2rem",
          margin: "0.5rem",
          borderRadius: "50%",
        }}
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.div
        style={{
          backgroundColor: color,
          width: "2rem",
          height: "2rem",
          margin: "0.5rem",
          borderRadius: "50%",
        }}
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        style={{
          backgroundColor: color,
          width: "2rem",
          height: "2rem",
          margin: "0.5rem",
          borderRadius: "50%",
        }}
        animate={{ y: [-20, 10, -20] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </StyledGeneratingIndecatorWrapper>
  );
};

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
  ${tw`p-4 px-6 w-full hover:pl-12 transition-all h-full  backdrop-blur-2xl hover:bg-opacity-15  bg-black bg-opacity-10`}
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
  ${tw`w-1/2 bg-cover flex flex-col items-end bg-center transition-all h-full text-white `}
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledLeftSideImageBackground = styled.div<{ image: string }>`
  ${tw`w-3/5 hover:w-10/12  transition-all bg-contain h-full text-white flex`}
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledTopicIcon = styled.div<{ color: string }>`
  ${tw`w-full relative bottom-2  flex justify-center items-center text-8xl`}
  color: ${({ color }) => color};
`;

const StyledRegenerateButton = styled.div<{ color: string }>`
  ${tw` size-7 m-2 text-opacity-70 rounded-full flex justify-center items-center cursor-pointer hover:scale-110  text-base transition-all text-white`}
  background-color: ${({ color }) => color};
`;

const TopicCell = (props: TitleProps & EntityProps & DescriptionProps & ImageProps) => {
  const { title, entity, description, imageSrc } = props;
  const { accentColor } = useTopicColor(entity);
  const { isSidebarVisible } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const [isGeneratingImage] = useEntityHasTags(entity, AdditionalTags.GENERATING);

  const handleOpenTopic = () => {
    if (!isSidebarVisible && !isGeneratingImage) {
      entity.addTag(Tags.SELECTED);
    }
  };

  const handleGenerateImage = async () => await generateImageForTopic(entity);

  return (
    <StyledTopicCellContainer>
      <StyledTopicCellWrapper
        onClick={imageSrc ? handleOpenTopic : () => {}}
        color={accentColor}
        backgroundColor={accentColor + "90"}
      >
        <StyledLeftSideImageBackground onClick={handleOpenTopic} image={imageSrc || ""}>
          <StyledTopicInfoWrapper color={!imageSrc ? accentColor : ""}>
            <StyledTopicTitle>{title}</StyledTopicTitle>
            <StyledTopicDescription>
              {description || displayAlertTexts(selectedLanguage).noDescription}
            </StyledTopicDescription>
          </StyledTopicInfoWrapper>
        </StyledLeftSideImageBackground>

        <StyledImageBackground image={imageSrc || ""}>
          {!imageSrc && !isGeneratingImage && (
            <StyledRegenerateButton onClick={handleGenerateImage} color={accentColor}>
              <IoColorWand />
            </StyledRegenerateButton>
          )}
          {!imageSrc &&
            (!isGeneratingImage ? (
              <StyledTopicIcon color={accentColor}>
                <IoBook />
              </StyledTopicIcon>
            ) : (
              <GeneratingIndecator color={accentColor} />
            ))}
        </StyledImageBackground>
      </StyledTopicCellWrapper>
    </StyledTopicCellContainer>
  );
};

export default TopicCell;
