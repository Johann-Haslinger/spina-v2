import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import React, { useEffect, useRef, useState } from 'react';
import { IoHeadset, IoPlay, IoPlayBack, IoPlayForward } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateAddedProps, SourceProps, TitleProps } from '../../../../base/additionalFacets';
import { AdditionalTag } from '../../../../base/enums';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { formatCounterTime } from '../../../../common/utilities/formatTime';
import { FlexBox, Sheet } from '../../../../components';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import LoadPodcastAudioSystem from '../../systems/LoadPodcastAudioSystem';

const StyledPodcastPlayerWrapper = styled.div`
  ${tw`h-full   text-primary-text dark:text-primary-text-dark px-4 lg:px-12 w-full`}
`;

const StyledPodcastIconContainer = styled.div`
  ${tw`h-[55%] flex items-center md:mt-6`}
`;

const StyledPodcastIconWrapper = styled.div<{
  isPlaying: boolean;
  backgroundColor: string;
  color: string;
}>`
  ${tw` transition-all bg-white bg-opacity-60 text-white mx-auto size-44 text-7xl flex items-center justify-center  rounded-2xl`}
  ${(props) => (props.isPlaying ? tw`scale-125` : tw` bg-opacity-45`)}
 
  color: ${(props) => props.color};
`;

const StyleldPodcastInfoWrapper = styled.div`
  ${tw`w-full mb-6 `}
`;

const StyledPodcastTitle = styled.p`
  ${tw`font-semibold  text-white line-clamp-2 text-xl`}
`;

const StyledPodcastSubTitle = styled.p`
  ${tw` text-white text-opacity-50 text-lg `}
`;

const StyledTimeBar = styled.input`
  ${tw`w-full outline-none`}
`;

const StyledTimeBarText = styled.div`
  ${tw` text-white text-opacity-50 text-sm`}
`;

const StyledButtonWrapper = styled.div<{ color: string }>`
  ${tw` mt-4 text-white text-opacity-80 dark:text-white  items-center  space-x-12  py-4  rounded-full w-full flex justify-between mx-auto text-5xl`}
`;

const StyledPauseButtonWrapper = styled.div`
  ${tw`flex w-12 justify-center space-x-2 mx-auto`}
`;

const StyledPauseButtonStroke = styled.div<{ color: string }>`
  ${tw`h-9 w-3 bg-white bg-opacity-80 dark:bg-white rounded`}/* background-color: ${(props) => props.color}; */
`;

const PodcastSheet = (props: TitleProps & SourceProps & EntityProps & DateAddedProps) => {
  const { title, source, entity, dateAdded } = props;
  const isVisible = useIsViewVisible(entity);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { color: accentColor, backgroundColor } = useSelectedSchoolSubjectColor();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');

  // TODO: managing playing podcast trough tag
  // useEffect(() => {
  //   if (selectedPodcastEntity) {
  //     playingPodcastEntities.forEach((playingPodcastEntity) => {
  //       playingPodcastEntity.remove(AdditionalTags.PLAYING);
  //       playingPodcastEntity.remove(AdditionalTags.PAUSED);
  //     });
  //   }
  // }, [selectedPodcastEntity]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    setAudioUrl(source);

    if (audio && source) {
      setIsPlaying(true);

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
    }
  }, [source]);

  useEffect(() => {
    if (audioRef.current?.paused && isPlaying) {
      setIsPlaying(false);
    }
  }, [audioRef.current?.paused]);

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);

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
      <audio src={audioUrl} ref={audioRef} onTimeUpdate={handleTimeUpdate} />

      <Sheet backgroundColor={accentColor} navigateBack={navigateBack} visible={isVisible}>
        <StyledPodcastPlayerWrapper>
          <StyledPodcastIconContainer>
            <StyledPodcastIconWrapper color={accentColor} backgroundColor={backgroundColor} isPlaying={isPlaying}>
              <IoHeadset />
            </StyledPodcastIconWrapper>
          </StyledPodcastIconContainer>

          <StyleldPodcastInfoWrapper>
            <StyledPodcastTitle>{title}</StyledPodcastTitle>
            <StyledPodcastSubTitle>
              {new Date(dateAdded).toLocaleDateString('de', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </StyledPodcastSubTitle>
          </StyleldPodcastInfoWrapper>

          <StyledTimeBar
            type="range"
            min={0}
            max={audioRef.current?.duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            onMouseDown={() => setIsPlaying(false)}
            onMouseUp={() => setIsPlaying(true)}
          />
          <FlexBox>
            <StyledTimeBarText>{formatCounterTime(currentTime)}</StyledTimeBarText>
            <StyledTimeBarText>{formatCounterTime(duration - currentTime)}</StyledTimeBarText>
          </FlexBox>

          <StyledButtonWrapper color={accentColor}>
            <IoPlayBack />

            <div onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <StyledPauseButtonWrapper>
                  <StyledPauseButtonStroke color={accentColor} />
                  <StyledPauseButtonStroke color={accentColor} />
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
