import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import {
  AnswerFacet,
  DateAddedFacet,
  LearningUnitTypeFacet,
  QuestionFacet,
  SourceFacet,
  TitleFacet,
} from '../../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../../base/constants';
import { AdditionalTag, DataType, LearningUnitType, Story } from '../../../../base/enums';
import { CloseButton, FlexBox, ScrollableBox, Sheet } from '../../../../components';
import SapientorConversationMessage from '../../../../components/content/SapientorConversationMessage';
import { addBlocks } from '../../../../functions/addBlocks';
import { addFlashcards } from '../../../../functions/addFlashcards';
import { addLearningUnit } from '../../../../functions/addLeaningUnit';
import { addText } from '../../../../functions/addText';
import { useUserData } from '../../../../hooks/useUserData';
import supabaseClient from '../../../../lib/supabase';
import { getBlockEntitiesFromText } from '../../../blockeditor/functions/getBlockEntitiesFromString';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import PreviewFlashcard from '../flashcard-sets/PreviewFlashcard';

interface SapientorMessage {
  role: 'gpt' | 'user';
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
      role: 'gpt',
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

const GenerateResourcesFromImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const [generationState, setGenerationState] = useState<GenerationState | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>([]);
  const [readyToSave, setReadyToSave] = useState(false);
  const [title, setTitle] = useState('');
  const [displayEndMessage, setDisplayEndMessage] = useState(false);
  const { conversation, addMessage } = useConversation();
  const { userId } = useUserData();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { selectedTopicId } = useSelectedTopic();
  const [isTypingAnimationPlaying, setIsTypingAnimationPlaying] = useState(true);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const [imagePromptEntity] = useEntity((e) => e.has(AdditionalTag.GENERATE_FROM_IMAGE_PROMPT));
  const imageSrc = imagePromptEntity?.get(SourceFacet)?.props.source;

  useEffect(() => {
    setGenerationState(undefined);
    setNote(undefined);
    setFlashcards([]);

    setReadyToSave(false);
    setTitle('');
    setDisplayEndMessage(false);
    setIsTypingAnimationPlaying(true);
    setSuggestions([]);
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  useEffect(() => {
    if (!isTypingAnimationPlaying && conversation.length == 1) {
      setSuggestions([
        {
          answer: 'Kannst du mir eine verbesserte Erklärung zu diesem Bild erstellen?',
          func: () => handleSelectGenerateNoteFromImageOption(),
        },
        {
          answer: 'Kannst du mir Lernkarten dazu erstellen?',
          func: () => handleSelectGenerateFlashcardsFromImageOption('knowlegde'),
        },
        {
          answer: 'Kannst du mir Vokabelkarten dazu erstellen?',
          func: () => handleSelectGenerateFlashcardsFromImageOption('vocabulary'),
        },
      ]);
    }
  }, [isTypingAnimationPlaying, conversation, imageSrc]);

  const handleSelectGenerateFlashcardsFromImageOption = async (flashcardType: 'vocabulary' | 'knowlegde') => {
    const session = await supabaseClient.auth.getSession();
    setGenerationState(GenerationState.GENERATING_FLASHCARDS);
    setSuggestions([]);

    const { data: flashcardsData, error } = await supabaseClient.functions.invoke('generate-flashcards', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { base64_image: imageSrc, flashcardType: flashcardType },
    });

    if (error) {
      console.error('Error generating completion:', error.message);
    }

    const generatedFlashcards: { answer: string; question: string }[] = JSON.parse(flashcardsData).cards;

    const newTitel = 'Neuer Kartensatz';

    setTitle(newTitel);
    setFlashcards(generatedFlashcards);

    setGenerationState(GenerationState.GENERATED_FLASHCARDS);
    setIsTypingAnimationPlaying(true);
    setFlashcards(generatedFlashcards);
    addMessage({
      role: 'gpt',
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
          answer: 'Ja, passt so!',
          func: () => {
            setSuggestions([]);
            setTimeout(() => {
              setIsTypingAnimationPlaying(true);
              setDisplayEndMessage(true);
              setReadyToSave(true);
            }, 200);
          },
        },

        // {
        //   answer: "Nein, kannst du's nochmal machen?",
        //   func: () => {
        //     handleSelectGenerateFlashcardsFromImageOption();
        //   },
        // },
      ]);
  };

  const handleSelectGenerateNoteFromImageOption = async () => {
    const session = await supabaseClient.auth.getSession();

    setGenerationState(GenerationState.GENERATING_NOTE);
    setSuggestions([]);

    const { data: noteData, error } = await supabaseClient.functions.invoke('generate-note-from-image', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { base64_image: imageSrc },
    });
    const note = JSON.parse(noteData);

    if (error) {
      console.error('Error generating completion:', error.message);
    }

    const title = note.title;
    const text = note.text;

    setTitle(title);
    setNote(text);

    setGenerationState(GenerationState.GENERATED_NOTE);
    setIsTypingAnimationPlaying(true);
    addMessage({
      role: 'gpt',
      message: ` Passt das so für dich?<br/> <br/> ${text} <br/>`,
    });

    setSuggestions([
      {
        answer: 'Ja, passt so!',
        func: () => {
          setSuggestions([]);
          setTimeout(() => {
            setIsTypingAnimationPlaying(true);
            addMessage({
              role: 'gpt',
              message: `Okay super! Soll ich dir noch ein paar Karteikarten oder einen Podcast zum bessern einprägen dazu erstellen?<br/> `,
            });
          }, 200);
          setSuggestions([
            {
              answer: 'Könntest du mir Karteikarten dazu erstellen?',
              func: () => handleSelectGenerateFlashcardsOption(false, text),
            },
            {
              answer: 'Könntest du mir einen Podcast dazu erstellen?',
              func: () => handleGeneratePodcast(false, text),
            },
            {
              answer: 'Nein, danke!',
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

    const { data: flashcardsData, error } = await supabaseClient.functions.invoke('generate-flashcards', {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { text: text },
    });

    const generatedFlashcards: { answer: string; question: string }[] = JSON.parse(flashcardsData).cards;

    if (error) {
      console.error('Error generating completion:', error.message);
    }

    if (generatedFlashcards) {
      setFlashcards(generatedFlashcards);
      addMessage({
        role: 'gpt',
        message: `Hier sind die Karteikarten! passen die so? <br/> <br/>`,
        specialContent: (
          <div className="px-4">
            {generatedFlashcards.map((flashcard, idx) => (
              <PreviewFlashcard  updateFlashcard={() => {}} key={idx} flashcard={flashcard} />
            ))}
          </div>
        ),
      }),
        setSuggestions([
          {
            answer: 'Ja, die passen so!',
            func: () => {
              setSuggestions([]);
              setTimeout(() => {
                if (hasGeneratedPodcast) {
                  setDisplayEndMessage(true);
                  setReadyToSave(true);
                } else {
                  setIsTypingAnimationPlaying(true);
                  addMessage({
                    role: 'gpt',
                    message: `Okay super! Soll ich dir noch einen Podcast zum bessern einprägen dazu erstellen?<br/> `,
                  });
                  setSuggestions([
                    {
                      answer: 'Ja, ein Podcast darüber wäre hilfreich.',
                      func: () => handleGeneratePodcast(true, text),
                    },
                    {
                      answer: 'Nein, danke!',
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
            answer: 'Nein, kannst du die nochmal machen?',
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
    // const base64Audio = await getAudioFromText(transcript)

    const base64Audio = '';

    if (base64Audio) {
      setGenerationState(GenerationState.GENERATED_PODCAST);
      addMessage({
        role: 'gpt',
        message:
          `Ich habe den Podcast für dich erstellt! ` +
          (generatedFlashcards
            ? 'Ich speichere dann alles für dich ab. Ich hoffe, ich konnte dir beim Lernen helfen!  <br/>'
            : 'Soll ich dir noch Karteikarten dazu erstellen?  <br/>'),
      }),
        setTimeout(() => {
          setSuggestions(
            generatedFlashcards
              ? []
              : [
                  {
                    answer: 'Ja, Karteikarten darüber wären hilfreich.',
                    func: () => handleSelectGenerateFlashcardsOption(true, text),
                  },
                  {
                    answer: 'Nein, danke!',
                    func: () => {
                      setDisplayEndMessage(true);
                      setReadyToSave(true);
                    },
                  },
                ],
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
          role: 'gpt',
          message: `Okay super! Ich habe das für dich abgespeichert, ich hoffe ich konnte dir bim lernen helfen! <br/> <br/>`,
        });
    }, 200);

    if (flashcards.length > 0) {
      if (note) {
        const subTopicId = v4();

        const newSubtopicEntity = new Entity();
        newSubtopicEntity.add(new IdentifierFacet({ guid: subTopicId }));
        newSubtopicEntity.add(new TitleFacet({ title: title }));
        newSubtopicEntity.add(new ParentFacet({ parentId: selectedTopicId || '' }));
        newSubtopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
        newSubtopicEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.MIXED }));
        newSubtopicEntity.add(DataType.LEARNING_UNIT);

        addLearningUnit(lsc, newSubtopicEntity, userId);

        const flashcardEntities = flashcards.map((flashcard) => {
          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
          newFlashcardEntity.add(new ParentFacet({ parentId: subTopicId || '' }));
          newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          newFlashcardEntity.add(DataType.FLASHCARD);

          return newFlashcardEntity;
        });

        addFlashcards(lsc, flashcardEntities, userId);

        // TODO: addd podcast to supabase

        const newTextEntity = new Entity();
        newTextEntity.add(new IdentifierFacet({ guid: v4() }));
        newTextEntity.add(new ParentFacet({ parentId: subTopicId }));
        newTextEntity.add(new TextFacet({ text: note }));

        addText(newTextEntity, userId);
      } else {
        const flashcardSetId = v4();

        const newFlashcardSetEntity = new Entity();
        newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
        newFlashcardSetEntity.add(new TitleFacet({ title: title }));
        newFlashcardSetEntity.add(new ParentFacet({ parentId: selectedTopicId || '' }));
        newFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
        newFlashcardSetEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.FLASHCARD_SET }));
        newFlashcardSetEntity.add(DataType.LEARNING_UNIT);

        addLearningUnit(lsc, newFlashcardSetEntity, userId);

        const flashcardEntities = flashcards.map((flashcard) => {
          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
          newFlashcardEntity.add(new ParentFacet({ parentId: flashcardSetId }));
          newFlashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          newFlashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          newFlashcardEntity.add(DataType.FLASHCARD);

          return newFlashcardEntity;
        });

        addFlashcards(lsc, flashcardEntities, userId);
      }
    } else {
      const noteId = v4();

      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: noteId }));
      newNoteEntity.add(new TitleFacet({ title: title || 'Lernkarten' }));
      newNoteEntity.add(new ParentFacet({ parentId: selectedTopicId || '' }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.NOTE }));
      newNoteEntity.add(DataType.LEARNING_UNIT);

      addLearningUnit(lsc, newNoteEntity, userId);

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
                        role: 'user',
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
              <SapientorConversationMessage isLoading={true} message={{ role: 'gpt', message: '...' }} />
            )}
          </div>
        ) : null}
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateResourcesFromImageSheet;
