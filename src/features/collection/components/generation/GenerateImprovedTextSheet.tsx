import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useSelectedLearningUnit } from '../../../../common/hooks/useSelectedLearningUnit';
import { Story, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayButtonTexts } from '../../../../common/utilities/displayText';
import { generateImprovedText } from '../../../../common/utilities/generateResources';
import {
  FlexBox,
  GeneratingIndicator,
  PrimaryButton,
  ScrollableBox,
  SecondaryButton,
  Sheet,
} from '../../../../components';
import SapientorConversationMessage from '../../../../components/content/SapientorConversationMessage';
import supabaseClient from '../../../../lib/supabase';

const GenerateImprovedTextSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_IMPROVED_TEXT_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedLearningUnitText, selectedLearningUnitEntity, selectedLearningUnitId } = useSelectedLearningUnit();

  useEffect(() => {
    const handleGenerateImprovedText = async () => {
      setIsGenerating(true);
      if (!selectedLearningUnitText || selectedLearningUnitText == '') {
        setGeneratedText('Bitte füge erst Text hinzu, um ihn zu verbessern.');
        setIsGenerating(false);
        return;
      }
      const improvedText = await generateImprovedText(lsc, selectedLearningUnitText);

      setGeneratedText(`Passt das so für dich?<br/> <br/>
      ${improvedText}
      <br/><br/>`);
      setIsGenerating(false);
    };

    if (isVisible && generatedText === '') {
      handleGenerateImprovedText();
    } else if (!isVisible) {
      setGeneratedText('');
      setIsGenerating(false);
    }
  }, [isVisible, selectedLearningUnitText]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_NOTE_STORY);

  const saveImprovedText = async () => {
    navigateBack();
    const newText = generatedText.replace(`Passt das so für dich?<br/> <br/>`, '');

    selectedLearningUnitEntity?.add(new TextFacet({ text: newText }));

    const { error } = await supabaseClient
      .from(SupabaseTable.TEXTS)
      .update({
        text: newText,
      })
      .eq('parent_id', selectedLearningUnitId);

    if (error) {
      console.error('Error updating text', error);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Speichern des verbesserten Textes',
        message: error.message + ' ' + error.details + ' ' + error.hint,
        type: 'error',
      });
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {generatedText !== '' && selectedLearningUnitText && (
          <PrimaryButton onClick={saveImprovedText}> {displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      {isGenerating && <GeneratingIndicator />}
      <ScrollableBox>
        {!isGenerating && (
          <SapientorConversationMessage
            message={{
              role: 'gpt',
              message: generatedText,
            }}
          />
        )}
      </ScrollableBox>
    </Sheet>
  );
};

export default GenerateImprovedTextSheet;
