import styled from "@emotion/styled/macro";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity, useEntity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import tw from "twin.macro";
import { v4 } from "uuid";
import { AnswerFacet, DateAddedFacet, QuestionFacet, SourceFacet, TitleFacet } from "../../../../app/additionalFacets";
import { COLOR_ITEMS } from "../../../../base/constants";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { CloseButton, FlexBox, ScrollableBox, Sheet } from "../../../../components";
import SapientorConversationMessage from "../../../../components/content/SapientorConversationMessage";
import { addBlocks } from "../../../../functions/addBlocks";
import { addFlashcards } from "../../../../functions/addFlashcards";
import { addFlashcardSet } from "../../../../functions/addFlashcardSet";
import { addNote } from "../../../../functions/addNote";
import { addSubtopic } from "../../../../functions/addSubtopic";
import { useUserData } from "../../../../hooks/useUserData";
import supabaseClient from "../../../../lib/supabase";
import { getCompletion } from "../../../../utils/getCompletion";
import { getBlockEntitiesFromText } from "../../../blockeditor/functions/getBlockEntitiesFromString";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import PreviewFlashcard from "../flashcard-sets/PreviewFlashcard";

interface SapientorMessage {
  role: "gpt" | "user";
  message: string;
  specialContent?: React.ReactNode;
}

enum GenerationState {
  GENERATING_NOTE,
  GENERATED_NOTE,
  GENERATING_FLASHCARDS,
  GENERATED_FLASHCARDS,
  GENERATING_PODCAST,
  GENERATED_PODCAST,
  DONE,
}

const useConversation = () => {
  const [conversation, setConversation] = useState<SapientorMessage[]>([
    {
      role: "gpt",
      message: `Hey! Möchtest du, dass ich dir eine verbesserte Erklärung oder Karteikarten zu diesem Bild erstelle?`,
    },
  ]);

  const addMessage = (message: SapientorMessage) => {
    setConversation((prev) => [...prev, message]);
  };

  return {
    conversation,
    addMessage,
    setConversation,
  };
};

const StyledSugesstionsWrapper = styled.div`
  ${tw`px-4 mt-4`}
`;

const StyledSugesstionWrapper = styled.div`
  ${tw`  border w-fit  rounded-lg py-1 md:hover:opacity-50 transition-all mt-2 px-4`}
  color: ${COLOR_ITEMS[0].color};
  border-color: ${COLOR_ITEMS[0].color};
`;

interface Suggestion {
  answer: string;
  func?: () => void;
}

const AnswerSugesstion = (props: { sugesstion: string; onClick: () => void }) => {
  const { sugesstion, onClick } = props;
  return <StyledSugesstionWrapper onClick={onClick}>{sugesstion}</StyledSugesstionWrapper>;
};

interface Podcast {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  parentId: string;
  base64Audio: string;
  transcript: string;
  date_added: string;
}

const GenerateResourcesFromImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [generationState, setGenerationState] = useState<GenerationState | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [podcast, setPodcast] = useState<Podcast | undefined>(undefined);
  const [readyToSave, setReadyToSave] = useState(false);
  const [title, setTitle] = useState("");
  const [displayEndMessage, setDisplayEndMessage] = useState(false);
  const { conversation, addMessage } = useConversation();
  const { userId } = useUserData();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { selectedTopicId } = useSelectedTopic();
  const [isTypingAnimationPlaying, setIsTypingAnimationPlaying] = useState(true);
  const isVisible = useIsStoryCurrent(Stories.GENERATING_RESOURCES_FROM_IMAGE);
  const [imagePromptEntity] = useEntity((e) => e.has(AdditionalTags.GENERATE_FROM_IMAGE_PROMPT));
  const imageSrc = imagePromptEntity?.get(SourceFacet)?.props.source;

  console.log(podcast);

  useEffect(() => {
    setGenerationState(undefined);
    setNote(undefined);
    setFlashcards([]);
    setPodcast(undefined);
    setReadyToSave(false);
    setTitle("");
    setDisplayEndMessage(false);
    setIsTypingAnimationPlaying(true);
    setSuggestions([]);
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_COLLECTION_STORY);

  useEffect(() => {
    if (!isTypingAnimationPlaying && conversation.length == 1) {
      setSuggestions([
        {
          answer: "Kannst du mir eine verbesserte Erklärung zu diesem Bild erstellen?",
          func: () => handleSelectGenerateNoteFromImageOption(),
        },
        {
          answer: "Kannst du mir ein paar Karteikarten dazu erstellen?",
          func: () => handleSelectGenerateFlashcardsFromImageOption(),
        },
      ]);
    }
  }, [isTypingAnimationPlaying, conversation, imageSrc]);

  const handleSelectGenerateFlashcardsFromImageOption = async () => {
    const session = await supabaseClient.auth.getSession();
    setGenerationState(GenerationState.GENERATING_FLASHCARDS);
    setSuggestions([]);

    console.log(imageSrc);

    const { data: flashcardsData, error } = await supabaseClient.functions.invoke("generate-flashcards", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { base64_image: imageSrc },
    });

    if (error) {
      console.error("Error generating completion:", error.message);
    }

    const generatedFlashcards: { answer: string; question: string }[] = JSON.parse(flashcardsData).cards;
    const flashcardText = generatedFlashcards
      .map((flashcard) => `${flashcard.question} - ${flashcard.answer}`)
      .join("\n");
    const newTitelInstruction = `Schreibe passend zu den folgenden Karteikarten eine Kurze Überschrift: ${flashcardText} `;
    const newTitel = await getCompletion(newTitelInstruction);

    setTitle(newTitel);
    setFlashcards(generatedFlashcards);

    setGenerationState(GenerationState.GENERATED_FLASHCARDS);
    setIsTypingAnimationPlaying(true);
    setFlashcards(generatedFlashcards);
    addMessage({
      role: "gpt",
      message: `Hier sind die Karteikarten! passen die so? <br/> <br/>`,
      specialContent: (
        <div className="px-4">
          {generatedFlashcards.map((flashcard, index) => (
            <PreviewFlashcard key={index} flashcard={flashcard} updateFlashcard={() => {}} />
          ))}
        </div>
      ),
    }),
      setSuggestions([
        {
          answer: "Ja, passt so!",
          func: () => {
            setSuggestions([]);
            setTimeout(() => {
              setIsTypingAnimationPlaying(true);
              setDisplayEndMessage(true);
              setReadyToSave(true);
            }, 200);
          },
        },

        {
          answer: "Nein, kannst du's nochmal machen?",
          func: () => {
            handleSelectGenerateFlashcardsFromImageOption();
          },
        },
      ]);
  };

  const handleSelectGenerateNoteFromImageOption = async () => {
    const session = await supabaseClient.auth.getSession();

    setGenerationState(GenerationState.GENERATING_NOTE);
    setSuggestions([]);

    const { data: noteData, error } = await supabaseClient.functions.invoke("generate-note-from-image", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { base64_image: imageSrc },
    });
    const note = JSON.parse(noteData);

    console.log(note);

    if (error) {
      console.error("Error generating completion:", error.message);
    }

    const title = note.title;
    const text = note.text;

    setTitle(title);
    setNote(text);

    setGenerationState(GenerationState.GENERATED_NOTE);
    setIsTypingAnimationPlaying(true);
    addMessage({
      role: "gpt",
      message: ` Passt das so für dich?<br/> <br/> ${text} <br/>`,
    });

    setSuggestions([
      {
        answer: "Ja, passt so!",
        func: () => {
          setSuggestions([]);
          setTimeout(() => {
            setIsTypingAnimationPlaying(true);
            addMessage({
              role: "gpt",
              message: `Okay super! Soll ich dir noch ein paar Karteikarten oder einen Podcast zum bessern einprägen dazu erstellen?<br/> `,
            });
          }, 200);
          setSuggestions([
            {
              answer: "Könntest du mir Karteikarten dazu erstellen?",
              func: () => handleSelectGenerateFlashcardsOption(false, text),
            },
            {
              answer: "Könntest du mir einen Podcast dazu erstellen?",
              func: () => handleGeneratePodcast(false, text),
            },
            {
              answer: "Nein, danke!",
              func: () => {
                setDisplayEndMessage(true);
                setReadyToSave(true);
              },
            },
          ]);
        },
      },

      {
        answer: "Nein, kannst du's nochmal machen?",
        func: () => {
          handleSelectGenerateNoteFromImageOption();
        },
      },
    ]);
  };

  const handleSelectGenerateFlashcardsOption = async (hasGeneratedPodcast: boolean, text: string) => {
    const session = await supabaseClient.auth.getSession();

    setSuggestions([]);
    setIsTypingAnimationPlaying(true);
    setTimeout(() => {
      setGenerationState(GenerationState.GENERATING_FLASHCARDS);
    }, 200);

    const { data: flashcardsData, error } = await supabaseClient.functions.invoke("generate-flashcards", {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { text: text },
    });

    const generatedFlashcards: { answer: string; question: string }[] = JSON.parse(flashcardsData).cards;

    console.log(generatedFlashcards);
    if (error) {
      console.error("Error generating completion:", error.message);
    }

    if (generatedFlashcards) {
      setFlashcards(generatedFlashcards);
      addMessage({
        role: "gpt",
        message: `Hier sind die Karteikarten! passen die so? <br/> <br/>`,
        specialContent: (
          <div className="px-4">
            {generatedFlashcards.map((flashcard, idx) => (
              <PreviewFlashcard updateFlashcard={() => {}} key={idx} flashcard={flashcard} />
            ))}
          </div>
        ),
      }),
        setSuggestions([
          {
            answer: "Ja, die passen so!",
            func: () => {
              setSuggestions([]);
              setTimeout(() => {
                if (hasGeneratedPodcast) {
                  setDisplayEndMessage(true);
                  setReadyToSave(true);
                } else {
                  setIsTypingAnimationPlaying(true);
                  addMessage({
                    role: "gpt",
                    message: `Okay super! Soll ich dir noch einen Podcast zum bessern einprägen dazu erstellen?<br/> `,
                  });
                  setSuggestions([
                    {
                      answer: "Ja, ein Podcast darüber wäre hilfreich.",
                      func: () => handleGeneratePodcast(true, text),
                    },
                    {
                      answer: "Nein, danke!",
                      func: () => {
                        setDisplayEndMessage(true);
                        setReadyToSave(true);
                      },
                    },
                  ]);
                }
              }, 200);
            },
          },

          {
            answer: "Nein, kannst du die nochmal machen?",
            func: () => handleSelectGenerateFlashcardsOption(hasGeneratedPodcast, text),
          },
        ]);
      setGenerationState(GenerationState.GENERATED_FLASHCARDS);
    }
  };
  const handleGeneratePodcast = async (generatedFlashcards: boolean, text: string) => {
    setGenerationState(GenerationState.GENERATING_PODCAST);
    setSuggestions([]);

    // TODO: edge function for this
    // const generatinPodcastTranscriptPrompt = `
    // Erstelle bitte einen Podcast, der auf dem folgenden Text basiert, um die Inhalte des Textes zu lernen:
    //  "${note}".   Der Podcast sollte informativ und leicht verständlich sein, um das Lernen zu erleichtern. Außerdem soll es Spaß machen, den Podcast zu hören. Sprachlich soll der Podcast locker gestaltet sein. Du bist der Moderator des Podcasts. Sprich den Zuhörer direkt und mit du an. Der Podcast sollte eine Länge von 2-3 Minuten haben.
    // `;

    // const transcript = await getCompletion(generatinPodcastTranscriptPrompt);

    // const base64Audio = await getAudioFromText(transcript);
    const transcript = "";
    const base64Audio = "";

    if (base64Audio) {
      setPodcast({
        id: v4(),
        user_id: "",
        title: title,
        duration: 0,
        parentId: selectedTopicId || "",
        base64Audio: base64Audio || "",
        transcript: transcript,
        date_added: new Date().toISOString(),
      });

      setGenerationState(GenerationState.GENERATED_PODCAST);
      addMessage({
        role: "gpt",
        message:
          `Ich habe den Podcast für dich erstellt! ` +
          (generatedFlashcards
            ? "Ich speichere dann alles für dich ab. Ich hoffe, ich konnte dir beim Lernen helfen!  <br/>"
            : "Soll ich dir noch Karteikarten dazu erstellen?  <br/>"),
      }),
        setTimeout(() => {
          setSuggestions(
            generatedFlashcards
              ? []
              : [
                  {
                    answer: "Ja, Karteikarten darüber wären hilfreich.",
                    func: () => handleSelectGenerateFlashcardsOption(true, text),
                  },
                  {
                    answer: "Nein, danke!",
                    func: () => {
                      setDisplayEndMessage(true);
                      setReadyToSave(true);
                    },
                  },
                ]
          );
          if (generatedFlashcards) {
            setDisplayEndMessage(true);
          }
        }, 200);
      setGenerationState(GenerationState.GENERATED_FLASHCARDS);
    }
  };

  const handleSave = async (addEndingMessage?: boolean) => {
    setSuggestions([]);
    setIsTypingAnimationPlaying(true);
    setTimeout(() => {
      addEndingMessage &&
        addMessage({
          role: "gpt",
          message: `Okay super! Ich habe das für dich abgespeichert, ich hoffe ich konnte dir bim lernen helfen! <br/> <br/>`,
        });
    }, 200);

    if (flashcards.length > 0) {
      if (note) {
        const subTopicId = v4();

        const newSubtopicEntity = new Entity();
        newSubtopicEntity.add(new IdentifierFacet({ guid: subTopicId }));
        newSubtopicEntity.add(new TitleFacet({ title: title }));
        newSubtopicEntity.add(new ParentFacet({ parentId: selectedTopicId || "" }));
        newSubtopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
        newSubtopicEntity.add(DataTypes.SUBTOPIC);

        addSubtopic(lsc, newSubtopicEntity, userId);

        const flashcardEntities = flashcards.map((flashcard) => {
          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
          newFlashcardEntity.add(new ParentFacet({ parentId: subTopicId || "" }));
          newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          newFlashcardEntity.add(DataTypes.FLASHCARD);

          return newFlashcardEntity;
        });

        addFlashcards(lsc, flashcardEntities, userId);

        // if (podcast?.base64Audio !== "") {
        //   const newPodcastEntity = new Entity();
        //   newPodcastEntity.add(new IdentifierFacet({ guid: v4() }));
        //   newPodcastEntity.add(new SourceFacet({ source: podcast?.base64Audio || "" }));
        //   newPodcastEntity.add(new ParentFacet({ parentId: subTopicId }));
        //   newPodcastEntity.add(new TitleFacet({ title: title }));
        //   newPodcastEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
        //   newPodcastEntity.add(DataTypes.PODCAST);

        //   addPodcast(lsc, newPodcastEntity, userId);
        // }

        const newBlockEntites = getBlockEntitiesFromText(note, subTopicId);
        addBlocks(lsc, newBlockEntites, userId);
      } else {
        const flashcardSetId = v4();

        const newFlashcardSetEntity = new Entity();
        newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
        newFlashcardSetEntity.add(new TitleFacet({ title: title }));
        newFlashcardSetEntity.add(new ParentFacet({ parentId: selectedTopicId || "" }));
        newFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
        newFlashcardSetEntity.add(DataTypes.FLASHCARD_SET);

        addFlashcardSet(lsc, newFlashcardSetEntity, userId);

        const flashcardEntities = flashcards.map((flashcard) => {
          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
          newFlashcardEntity.add(new ParentFacet({ parentId: flashcardSetId }));
          newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          newFlashcardEntity.add(DataTypes.FLASHCARD);

          return newFlashcardEntity;
        });

        addFlashcards(lsc, flashcardEntities, userId);
      }
    } else {
      const noteId = v4();

      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: noteId }));
      newNoteEntity.add(new TitleFacet({ title: title }));
      newNoteEntity.add(new ParentFacet({ parentId: selectedTopicId || "" }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(DataTypes.NOTE);

      addNote(lsc, newNoteEntity, userId);

      if (note) {
        const newBlockEntites = getBlockEntitiesFromText(note, noteId);
        addBlocks(lsc, newBlockEntites, userId);
      }
    }
  };

  useEffect(() => {
    if (readyToSave) {
      handleSave(displayEndMessage);
      setReadyToSave(false);
    }
  }, [readyToSave]);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <ScrollableBox>
        {generationState !== GenerationState.DONE ? (
          <div>
            {conversation.map((message, index) => (
              <SapientorConversationMessage
                onWritingAnimationPlayed={() => setIsTypingAnimationPlaying(false)}
                key={index}
                message={message}
              />
            ))}
            {!isTypingAnimationPlaying && conversation.length >= 1 && (
              <StyledSugesstionsWrapper>
                {suggestions.map((suggestion, index) => (
                  <AnswerSugesstion
                    key={index}
                    sugesstion={suggestion.answer}
                    onClick={() => {
                      addMessage({
                        role: "user",
                        message: suggestion.answer,
                      });
                      suggestion.func && suggestion.func();
                    }}
                  />
                ))}
              </StyledSugesstionsWrapper>
            )}
            {(generationState === GenerationState.GENERATING_FLASHCARDS ||
              generationState == GenerationState.GENERATING_PODCAST ||
              generationState == GenerationState.GENERATING_NOTE) && (
              <SapientorConversationMessage isLoading={true} message={{ role: "gpt", message: "..." }} />
            )}
          </div>
        ) : null}
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateResourcesFromImageSheet;

// TODO: edge function for this
// const generateNoteFromImage = async (imageSrc: File | null): Promise<{ title: string; text: string }> => {
//   if (imageSrc) {
//     console.log(imageSrc);

//     // const output = await getVisionCompletion(
//     //   `Schreibe bitte basierend auf dem folgenden Bild eine Erklärung des in ihm behandelten Themas, die gut nachvollziehbar ist. Formatieren den Text und nutze dafür <b> für Unterüberschriften, <i> für Fachbegriffe, <u> für wichtige Stellen und <br/><br/> für den Abstand zwischen Absätzen. Erzeuge eine neue Zeile mit <br/><br/>, anstelle von \n.
//     //   `,
//     //   imageSrc,
//     // );
//     const output = dummyText;

//     // const title = await getCompletion(
//     //   `Schreibe passened zu diesem Text eine Kurze Überschrift: ${output} `,
//     // );

//     const title = "hallo";

//     return { title: title, text: output };
//   }
//   return { title: "Kein Bild", text: "" };
// };

// // TODO: edge function for this
// const handleFlashcardsFromImage = async (
//   imageSrc: File | null
// ): Promise<{
//   flashcards: { question: string; answer: string }[];
//   title: string;
// }> => {
//   if (imageSrc) {
//     const generatedFlashcards = dummyFlashcards;
//     const title = "hallo";
//     // const output = await getVisionCompletion(
//     //   ' Schreibe genau das was auf dem folgenden Blatt steht auf. ',
//     //   imageSrc,
//     // );
//     // const generatedFlashcards = await generateFlashCards(output);
//     // const title = await getCompletion(
//     //   `Schreibe passened zu diesem Text eine Kurze Überschrift: ${output} `,
//     // );

//     return { flashcards: generatedFlashcards, title };
//   }
//   return { flashcards: [], title: "Kein Bild" };
// };
