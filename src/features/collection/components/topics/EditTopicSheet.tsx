import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { DescriptionFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoColorWandOutline } from 'react-icons/io5';
import { TitleFacet } from '../../../../app/additionalFacets';
import { AdditionalTags, Stories, SupabaseColumns, SupabaseTables } from '../../../../base/enums';
import {
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { generateImageForTopic } from '../../functions/generateImageForTopic';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

const EditTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.EDITING_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle, selectedTopicDescription, selectedTopicEntity, selectedTopicId } = useSelectedTopic();
  const [newTitle, setNewTitle] = useState(selectedTopicTitle);
  const [newDescription, setNewDescription] = useState(selectedTopicDescription);
  const [isGeneratingImage] = useEntityHasTags(selectedTopicEntity, AdditionalTags.GENERATING);

  useEffect(() => {
    setNewTitle(selectedTopicTitle);
    setNewDescription(selectedTopicDescription);
  }, [selectedTopicTitle, selectedTopicDescription]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);
  const handleRegenerateImage = async () =>
    selectedTopicEntity && (await generateImageForTopic(selectedTopicEntity, true));

  const updateTopic = async () => {
    if (newTitle && newDescription) {
      navigateBack();
      selectedTopicEntity?.add(new TitleFacet({ title: newTitle }));
      selectedTopicEntity?.add(new DescriptionFacet({ description: newDescription }));

      const { error } = await supabaseClient
        .from(SupabaseTables.TOPICS)
        .update({
          title: newTitle,
          description: newDescription,
        })
        .eq(SupabaseColumns.ID, selectedTopicId);

      if (error) {
        console.error('Error updating topic set', error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedTopicTitle || newDescription !== selectedTopicDescription) && (
          <PrimaryButton onClick={updateTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder={displayLabelTexts(selectedLanguage).description}
          />
        </SectionRow>
      </Section>
      <Spacer size={2} />
      {!isGeneratingImage && (
        <Section>
          <SectionRow last role="button" onClick={handleRegenerateImage} icon={<IoColorWandOutline />}>
            {displayActionTexts(selectedLanguage).regenerateImage}
          </SectionRow>
        </Section>
      )}
    </Sheet>
  );
};

export default EditTopicSheet;
