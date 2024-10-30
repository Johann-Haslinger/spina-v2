import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { AnswerFacet, QuestionFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../../common/types/enums';
import { displayButtonTexts } from '../../../../common/utilities/displayText';
import { generateImprovedText } from '../../../../common/utilities/generateResources';
import { dataTypeQuery, isChildOfQuery } from '../../../../common/utilities/queries';
import {
  FlexBox,
  GeneratingIndicator,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Sheet,
  Spacer,
} from '../../../../components';
import SapientorConversationMessage from '../../../../components/content/SapientorConversationMessage';
import { addBlockEntitiesFromString } from '../../../blockeditor/functions/addBlockEntitiesFromString';
import { useSelectedFlashcardSet } from '../../hooks/useSelectedFlashcardSet';

const GenerateTextFromFlashcardsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const {
    selectedFlashcardSetId,
    selectedFlashcardSetEntity,
    selectedFlashcardSetParentId,
    selectedFlashcardSetTitle,
  } = useSelectedFlashcardSet();
  const { selectedLanguage } = useSelectedLanguage();
  const isVisible = useIsStoryCurrent(Story.GENERATING_TEXT_FROM_FLASHCARDS_STORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcardEntities] = useEntities((e) => dataTypeQuery(e, DataType.FLASHCARD));
  const [generatedText, setGeneratedText] = useState<string>('');

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_SET_STORY);

  useEffect(() => {
    const generateTextFromFlashcards = async () => {
      setIsGenerating(true);
      const textToImprove = flashcardEntities
        .filter((e) => isChildOfQuery(e, selectedFlashcardSetEntity))
        .map((entity) => {
          const question = entity.get(QuestionFacet)?.props.question;
          const answer = entity.get(AnswerFacet)?.props.answer;
          return `${question} ${answer}` + '\n';
        })
        .join(' ');

      if (textToImprove) {
        const imporvedText = await generateImprovedText(lsc, textToImprove);

        setGeneratedText(imporvedText);
      }

      setIsGenerating(false);
    };

    if (isVisible && selectedFlashcardSetId) {
      generateTextFromFlashcards();
    }
  }, [isVisible, flashcardEntities]);

  const saveText = async () => {
    navigateBack();

    selectedFlashcardSetEntity?.add(AdditionalTag.NAVIGATE_BACK);

    if (selectedFlashcardSetId) {
      setTimeout(async () => {
        const subtopicEntity = new Entity();
        subtopicEntity.add(new IdentifierFacet({ guid: selectedFlashcardSetId }));
        subtopicEntity.add(new ParentFacet({ parentId: selectedFlashcardSetParentId || '' }));
        subtopicEntity.add(new TitleFacet({ title: selectedFlashcardSetTitle || '' }));
        subtopicEntity.add(new TextFacet({ text: generatedText || '' }));
        subtopicEntity.add(DataType.SUBTOPIC);

        // addSubtopic(lsc, subtopicEntity, userId);

        addBlockEntitiesFromString(lsc, generatedText, selectedFlashcardSetId, '');
      }, 200);
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {!isGenerating && generatedText !== '' && (
          <PrimaryButton onClick={saveText}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      {isGenerating ? (
        <GeneratingIndicator />
      ) : (
        <ScrollableBox>
          <SapientorConversationMessage
            message={{
              role: 'gpt',
              message: `Passt das so für dich?<br/> <br/>
           ${generatedText}
           <br/><br/>`,
            }}
          />
        </ScrollableBox>
      )}
    </Sheet>
  );
};

export default GenerateTextFromFlashcardsSheet;
