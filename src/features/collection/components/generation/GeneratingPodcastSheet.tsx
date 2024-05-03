import { useContext, useEffect, useState } from "react";
import { CancelButton, FlexBox, GeneratingIndecator, SaveButton, Sheet } from "../../../../components";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";
import { Entity } from "@leanscope/ecs-engine";
import { v4 } from "uuid";
import { useSelectedNote } from "../../hooks/useSelectedNote";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { IoCheckmarkCircle } from "react-icons/io5";

const StyledDoneIconWrapper = styled.div`
  ${tw`flex mt-40 lg:mt-48 text-[#00965F] items-center justify-center lg:text-[12rem] text-9xl`}
`;

const GeneratingPodcastSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.GENERATE_PODCAST_STORY);
  const { selectedSubtopicText, selectedSubtopicId } = useSelectedSubtopic();
  const { selectedNoteText, selectedNoteId } = useSelectedNote();
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    const handleGeneratePodcast = async () => {
      setIsGenerating(true);
      const podcastTranscript = await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Podcast transcript", podcastTranscript);
      const podcastAudio = await new Promise((resolve) => setTimeout(resolve, 500));

      const newPodcastId = v4();
      const parentId = selectedNoteId || selectedSubtopicId;

      if (parentId && podcastAudio) {
        const newPodcastEntity = new Entity();
        lsc.engine.addEntity(newPodcastEntity);
        newPodcastEntity.add(new IdentifierFacet({ guid: newPodcastId }));
        newPodcastEntity.add(new ParentFacet({ parentId: parentId }));
        // newPodcastEntity.add(new SourceFacet({ source: podcastAudio }));

        const { error } = await supabaseClient
          .from("podcasts")
          .insert({ id: newPodcastId, text: selectedNoteText || selectedSubtopicText, parentId });

        if (error) {
          console.error("Error inserting podcast", error);
        }
      }

      setIsGenerating(false);
    };

    if (isVisible) {
      handleGeneratePodcast();
    }
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_SUBTOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        {isGenerating && (
          <CancelButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</CancelButton>
        )}
        {!isGenerating && <SaveButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).done}</SaveButton>}
      </FlexBox>
      {isGenerating && <GeneratingIndecator />}
      {!isGenerating && (
        <StyledDoneIconWrapper>
          <IoCheckmarkCircle />
        </StyledDoneIconWrapper>
      )}
    </Sheet>
  );
};

export default GeneratingPodcastSheet;
