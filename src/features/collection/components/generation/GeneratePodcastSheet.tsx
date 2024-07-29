import styled from "@emotion/styled/macro";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntities } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import tw from "twin.macro";
import { v4 } from "uuid";
import {
  AnswerFacet,
  DateAddedFacet,
  QuestionFacet,
  SourceFacet,
  TitleFacet,
} from "../../../../app/additionalFacets";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  CloseButton,
  FlexBox,
  GeneratingIndecator,
  Sheet,
} from "../../../../components";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { addPodcast } from "../../../../functions/addPodcast";
import { useIsAnyStoryCurrent } from "../../../../hooks/useIsAnyStoryCurrent";
import { useUserData } from "../../../../hooks/useUserData";
import {
  getAudioFromText,
  getCompletion,
} from "../../../../utils/getCompletion";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { useSelectedFlashcardSet } from "../../hooks/useSelectedFlashcardSet";
import { useSelectedNote } from "../../hooks/useSelectedNote";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";
import { useVisibleText } from "../../hooks/useVisibleText";

function base64toBlob(base64Data: string, contentType: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

const StyledDoneIconWrapper = styled.div`
  ${tw`flex mt-40 lg:mt-48 text-[#00965F] items-center justify-center lg:text-[12rem] text-9xl`}
`;

const GeneratePodcastSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsAnyStoryCurrent([
    Stories.GENERATING_PODCAST_STORY,
    Stories.GENERATING_PODCAST_FROM_FLASHCARDS_STORY,
  ]);
  const generatePodcastFromFlashcards = useIsStoryCurrent(
    Stories.GENERATING_PODCAST_FROM_FLASHCARDS_STORY,
  );
  const { selectedSubtopicId, selectedSubtopicTitle } = useSelectedSubtopic();
  const { selectedNoteId, selectedNoteTitle } = useSelectedNote();
  const {
    selectedFlashcardSetEntity,
    selectedFlashcardSetId,
    selectedFlashcardSetTitle,
  } = useSelectedFlashcardSet();
  const [isGenerating, setIsGenerating] = useState(false);
  const { userId } = useUserData();
  const [flashcardEntities] = useEntities((e) =>
    dataTypeQuery(e, DataTypes.FLASHCARD),
  );
  const { visibleText } = useVisibleText();

  useEffect(() => {
    const handleGeneratePodcast = async () => {
      setIsGenerating(true);

      const text = generatePodcastFromFlashcards
        ? flashcardEntities
            .filter((e) => isChildOfQuery(e, selectedFlashcardSetEntity))
            .map((entity) => {
              const question = entity.get(QuestionFacet)?.props.question;
              const answer = entity.get(AnswerFacet)?.props.answer;
              return `${question} ${answer}` + "\n";
            })
            .join(" ")
        : visibleText;
      const title =
        selectedFlashcardSetTitle ||
        selectedNoteTitle ||
        selectedSubtopicTitle ||
        "";

      const generatinPodcastTranscriptPrompt = `
      Erstelle bitte einen Podcast, der auf dem folgenden Text basiert, um die Inhalte des Textes zu lernen:
       "${text}".   Der Podcast sollte informativ und leicht verständlich sein, um das Lernen zu erleichtern. Außerdem soll es Spaß machen, den Podcast zu hören. Sprachlich soll der Podcast locker gestaltet sein. Du bist der Moderator des Podcasts. Sprich den Zuhörer direkt und mit du an. Der Podcast sollte eine Länge von 2-3 Minuten haben.
      `;

      const transcript = await getCompletion(generatinPodcastTranscriptPrompt);
      const audioBase64 = await getAudioFromText(transcript);

      if (audioBase64) {
        const newPodcastId = v4();
        const parentId =
          selectedFlashcardSetId || selectedNoteId || selectedSubtopicId;

        const audioBlob = base64toBlob(audioBase64, "audio/mpeg");
        const audioUrl = URL.createObjectURL(audioBlob).toString();

        if (parentId && audioBase64) {
          const newPodcastEntity = new Entity();
          newPodcastEntity.add(new TitleFacet({ title: title }));
          newPodcastEntity.add(new IdentifierFacet({ guid: newPodcastId }));
          newPodcastEntity.add(new ParentFacet({ parentId: parentId }));
          newPodcastEntity.add(new SourceFacet({ source: audioUrl }));
          newPodcastEntity.add(new ParentFacet({ parentId: parentId }));
          newPodcastEntity.add(
            new DateAddedFacet({ dateAdded: new Date().toISOString() }),
          );
          newPodcastEntity.add(DataTypes.PODCAST);

          addPodcast(lsc, newPodcastEntity, userId, audioBase64);
        }
      }

      setIsGenerating(false);
    };

    if (isVisible && !isGenerating && visibleText !== "") {
      handleGeneratePodcast();
    }
  }, [isVisible]);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_SUBTOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      {isGenerating && <GeneratingIndecator />}
      {!isGenerating && visibleText == "" && (
        <SapientorConversationMessage
          message={{
            role: "gpt",
            message:
              "Bitte füge erst Text hinzu, um einen Podcast zu generieren.",
          }}
        />
      )}
      {!isGenerating && visibleText && (
        <StyledDoneIconWrapper>
          <IoCheckmarkCircle />
        </StyledDoneIconWrapper>
      )}
    </Sheet>
  );
};

export default GeneratePodcastSheet;
