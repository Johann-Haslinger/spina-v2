import styled from "@emotion/styled";
import { Entity, EntityProps } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import {
  DescriptionFacet,
  DescriptionProps,
  IdentifierFacet,
  ImageFacet,
  ImageProps,
  Tags,
} from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { IoBook, IoColorWand } from "react-icons/io5";
import tw from "twin.macro";
import { TitleFacet, TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags, SupabaseTables } from "../../../../base/enums";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../../lib/supabase";
import { displayAlertTexts } from "../../../../utils/displayText";
import { getCompletion, getImageFromText } from "../../../../utils/getCompletion";
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
  ${tw`w-1/2 bg-cover flex flex-col items-end transition-all h-full text-white `}
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledLeftSideImageBackground = styled.div<{ image: string }>`
  ${tw`w-1/2 hover:w-2/3  transition-all bg-cover h-full text-white flex`}
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

const generateImageForTopic = async (entity: Entity) => {
  const description = entity.get(DescriptionFacet)?.props.description;
  const image = entity?.get(ImageFacet)?.props.imageSrc;
  const title = entity?.get(TitleFacet)?.props.title;
  const id = entity.get(IdentifierFacet)?.props.guid;
  let topicDescription = description;
  let topicImage = image;

  const generatingDescriptionPrompt = "Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:" + title;
  const generatingImagePrompt =
    "Bitte generiere ein passendes Bild zu folgendem Thema: '" +
    title +
    "' Das Bild soll im Malstyle des Expressionismus sein.";

  entity.addTag(AdditionalTags.GENERATING);
  if (!description) {
    topicDescription = await getCompletion(generatingDescriptionPrompt);
    entity.add(new DescriptionFacet({ description: topicDescription }));
  }
  if (!image) {
    topicImage = await getImageFromText(generatingImagePrompt);
    console.log("topicImage", topicImage);
    entity.add(new ImageFacet({ imageSrc: topicImage }));
  }

  const { error } = await supabaseClient
    .from(SupabaseTables.TOPICS)
    .update({
      image_url: topicImage,
      description: topicDescription,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating topic:", error);
  }

  entity.remove(AdditionalTags.GENERATING);
};

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
      <StyledTopicCellWrapper onClick={imageSrc ? handleOpenTopic: ()=> {}}  color={accentColor} backgroundColor={accentColor + "90"}>
        <StyledLeftSideImageBackground onClick={handleOpenTopic} image={imageSrc || ""}>
          <StyledTopicInfoWrapper color={!imageSrc ? accentColor : ""}>
            <StyledTopicTitle>{title}</StyledTopicTitle>
            <StyledTopicDescription>
              {description || displayAlertTexts(selectedLanguage).noContentAddedTitle}
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
