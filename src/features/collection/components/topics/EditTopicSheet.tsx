import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useEntities } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoCreateOutline } from 'react-icons/io5';
import { DiscardUnsavedChangesAlert } from '../../../../common/components/others';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { TitleFacet } from '../../../../common/types/additionalFacets';
import { Story, SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
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
import supabaseClient from '../../../../lib/supabase';
import { useDiscardAlertState } from '../../hooks/useDiscardAlertState';
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
  const { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert } = useDiscardAlertState();
  const hasUnsavedChanges =
    newTitle !== selectedTopicTitle || newDescription !== selectedTopicDescription || selectedImageSrc;

  useEffect(() => {
    const updateTopicImage = async () => {
      const { error } = await supabaseClient
        .from(SupabaseTable.TOPICS)
        .update({
          image_url: selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc,
        })
        .eq(SupabaseColumn.ID, selectedTopicId);

      if (error) {
        console.error('Error updating topic set', error);
        addNotificationEntity(lsc, {
          title: 'Fehler beim Aktualisieren des Themenbildes',
          message: error.message,
          type: 'error',
        });
        return;
      }

      selectedTopicEntity?.add(new ImageFacet({ imageSrc: selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc }));

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

  const navigateBack = () => {
    closeDiscardAlert();
    lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);
  };
  const openImageSelectorSheet = () => lsc.stories.transitTo(Story.SELECTING_IMAGE_FOR_TOPIC_STORY);
  const handleBackClick = () => (hasUnsavedChanges ? openDiscardAlert() : navigateBack());

  const updateTopic = async () => {
    if (newTitle && newDescription) {
      navigateBack();

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
        addNotificationEntity(lsc, {
          title: 'Fehler beim Aktualisieren des Themas',
          message: error.message,
          type: 'error',
        });
        return;
      }
      selectedTopicEntity?.add(new TitleFacet({ title: newTitle }));
      selectedTopicEntity?.add(new DescriptionFacet({ description: newDescription }));
    }
  };

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={handleBackClick}>
        <FlexBox>
          <SecondaryButton onClick={handleBackClick}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
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

      <DiscardUnsavedChangesAlert isVisible={isDiscardAlertVisible} cancel={closeDiscardAlert} close={navigateBack} />
    </div>
  );
};

export default EditTopicSheet;
