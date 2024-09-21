import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useEntities } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoCreateOutline } from 'react-icons/io5';
import { TitleFacet } from '../../../../app/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../../base/enums';
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
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

const EditTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle, selectedTopicDescription, selectedTopicEntity, selectedTopicId } = useSelectedTopic();
  const [newTitle, setNewTitle] = useState(selectedTopicTitle);
  const [newDescription, setNewDescription] = useState(selectedTopicDescription);
  const [selectedImageEntities] = useEntities((e) => e.get(IdentifierFacet)?.props.guid === 'selectedImage');
  const selectedImageSrc = selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc;

  useEffect(() => {
    const updateTopicImage = async () => {
      selectedTopicEntity?.add(new ImageFacet({ imageSrc: selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc }));

      const { error } = await supabaseClient
        .from(SupabaseTable.TOPICS)
        .update({
          image_url: selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc,
        })
        .eq(SupabaseColumn.ID, selectedTopicId);

      if (error) {
        console.error('Error updating topic set', error);
      }

      selectedImageEntities.forEach((e) => lsc.engine.removeEntity(e));
    };

    if (selectedImageEntities.length) {
      updateTopicImage();
    }
  }, [selectedImageEntities.length]);

  useEffect(() => {
    setNewTitle(selectedTopicTitle);
    setNewDescription(selectedTopicDescription);
  }, [selectedTopicTitle, selectedTopicDescription]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);
  const openImageSelectorSheet = () => lsc.stories.transitTo(Story.SELECTING_IMAGE_FOR_TOPIC_STORY);

  const updateTopic = async () => {
    if (newTitle && newDescription) {
      navigateBack();
      selectedTopicEntity?.add(new TitleFacet({ title: newTitle }));
      selectedTopicEntity?.add(new DescriptionFacet({ description: newDescription }));

      const { error } = await supabaseClient
        .from(SupabaseTable.TOPICS)
        .update({
          title: newTitle,
          description: newDescription,
          image_url: selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc,
        })
        .eq(SupabaseColumn.ID, selectedTopicId);

      if (error) {
        console.error('Error updating topic set', error);
      }
    }
  };

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={navigateBack}>
        <FlexBox>
          <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
          {(newTitle !== selectedTopicTitle || newDescription !== selectedTopicDescription || selectedImageSrc) && (
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
        <Section>
          <SectionRow last role="button" onClick={openImageSelectorSheet} icon={<IoCreateOutline />}>
            {displayActionTexts(selectedLanguage).editImage}
          </SectionRow>
        </Section>

        <Spacer />
      </Sheet>
    </div>
  );
};

export default EditTopicSheet;
