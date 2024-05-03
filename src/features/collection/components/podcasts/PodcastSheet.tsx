import React, { useEffect, useRef, useState } from "react";
import { FlexBox, Sheet } from "../../../../components";
import { SourceProps, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { AdditionalTags } from "../../../../base/enums";
import { IoHeadset, IoPlayBack, IoPlay, IoPlayForward } from "react-icons/io5";
import LoadPodcastAudioSystem from "../../systems/LoadPodcastAudioSystem";
import tw from "twin.macro";
import styled from "@emotion/styled";
import { formatTime } from "../../../../utils/formatTime";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const StyledPodcastPlayerWrapper = styled.div`
  ${tw`h-full   text-primatyText dark:text-primaryTextDark px-4 lg:px-12 w-full`}
`;

const StyledPodcastIconContainer = styled.div`
  ${tw`h-[60%] flex items-center md:mt-6`}
`;

const StyledPodcastIconWrapper = styled.div<{ isPlaying: boolean; backgroundColor: string }>`
  ${tw` transition-all text-white mx-auto size-44 text-7xl flex items-center justify-center  rounded-2xl`}
  ${(props) => (props.isPlaying ? tw`scale-125` : tw` opacity-80`)}
  background-color: ${(props) => props.backgroundColor};
`;

const StyleldPodcastInfoWrapper = styled.div`
  ${tw`w-full mb-6 `}
`;

const StyledPodcastTitle = styled.p`
  ${tw`font-semibold line-clamp-2 text-lg`}
`;

const StyledPodcastSubTitle = styled.p`
  ${tw`text-seconderyText`}
`;

const StyledTimeBar = styled.input`
  ${tw`w-full outline-none`}
`;

const StyledTimeBarText = styled.div`
  ${tw`text-seconderyText text-sm`}
`;

const StyledButtonWrapper = styled.div<{color: string}>`
  ${tw` mt-4  items-center  space-x-12  py-4  rounded-full w-full flex justify-between mx-auto text-5xl`}
  color: ${(props) => props.color};
`;

const StyledPauseButtonWrapper = styled.div`
  ${tw`flex w-12 justify-center space-x-2 mx-auto`}
`;

const StyledPauseButtonStroke = styled.div<{ color: string }>`
  ${tw`h-9 w-3 bg-white rounded`}
   background-color: ${(props) => props.color};
`;

const PodcastSheet = (props: TitleProps & SourceProps & EntityProps) => {
  const { title, source, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  useEffect(() => {
    console.log("source", source);
    const audio = audioRef.current;

    if (audio) {
      audio.play();
      setIsPlaying(true);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
    }
  }, [source]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setCurrentTime(currentTime);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const currentTime = parseFloat(e.target.value);
      setCurrentTime(currentTime);
      audioRef.current.currentTime = currentTime;
    }
  };

  return (
    <>
      <LoadPodcastAudioSystem />
      <audio ref={audioRef} src={source} onTimeUpdate={handleTimeUpdate} />

      <Sheet navigateBack={navigateBack} visible={isVisible}>
        <StyledPodcastPlayerWrapper>
          <StyledPodcastIconContainer>
            <StyledPodcastIconWrapper backgroundColor={backgroundColor} isPlaying={isPlaying}>
              <IoHeadset />
            </StyledPodcastIconWrapper>
          </StyledPodcastIconContainer>

          <StyleldPodcastInfoWrapper>
            <StyledPodcastTitle>{title}</StyledPodcastTitle>
            <StyledPodcastSubTitle>Sapientor</StyledPodcastSubTitle>
          </StyleldPodcastInfoWrapper>

          <StyledTimeBar
            type="range"
            min={0}
            max={audioRef.current?.duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            onMouseDown={isPlaying ? togglePlay: () => {}}
            onMouseUp={togglePlay}
          />
          <FlexBox>
            <StyledTimeBarText>{formatTime(currentTime)}</StyledTimeBarText>
            <StyledTimeBarText>{formatTime(duration - currentTime)}</StyledTimeBarText>
          </FlexBox>

          <StyledButtonWrapper color={backgroundColor} >
            <IoPlayBack />

            <div onClick={togglePlay}>
              {isPlaying ? (
                <StyledPauseButtonWrapper>
                  <StyledPauseButtonStroke color={backgroundColor} />
                  <StyledPauseButtonStroke  color={backgroundColor}  />
                </StyledPauseButtonWrapper>
              ) : (
                <IoPlay />
              )}
            </div>

            <IoPlayForward />
          </StyledButtonWrapper>
        </StyledPodcastPlayerWrapper>
      </Sheet>
    </>
  );
};

export default PodcastSheet;
