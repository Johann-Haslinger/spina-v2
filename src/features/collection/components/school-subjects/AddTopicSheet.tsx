import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { IoAdd, IoCreateOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { DateAddedFacet, TitleFacet } from '../../../../app/additionalFacets';
import { DataType, Story } from '../../../../base/enums';
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
import { addTopic } from '../../../../functions/addTopic';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../../hooks/useUserData';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { generateDescriptionForTopic } from '../../functions/generateDescriptionForTopic';
import { useSelectedSchoolSubject } from '../../hooks/useSelectedSchoolSubject';
import SelectTopicImageSheet from '../topics/SelectTopicImageSheet';

const AddTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_TOPIC_STORY);
  const { selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();
  const [selectedImageEntities] = useEntities((e) => e.get(IdentifierFacet)?.props.guid === 'selectedImage');
  const selectedImageSrc = selectedImageEntities[0]?.get(ImageFacet)?.props.imageSrc;

  const navigateBack = () => {
    lsc.stories.transitTo(Story.OBSERVING_SCHOOL_SUBJECT_STORY);
    setTitle('');
    setDescription('');
    selectedImageEntities.forEach((e) => lsc.engine.removeEntity(e));
  };
  const openImageSelectorSheet = () => lsc.stories.transitTo(Story.SELECTING_IMAGE_FOR_TOPIC_STORY);

  const saveTopic = async () => {
    if (selectedSchoolSubjectId) {
      const topicId = v4();
      const topicDescription = description;

      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: topicId }));
      newTopicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
      newTopicEntity.add(new DescriptionFacet({ description: topicDescription }));
      newTopicEntity.add(new TitleFacet({ title: title }));
      newTopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newTopicEntity.add(new ImageFacet({ imageSrc: selectedImageSrc }));
      newTopicEntity.add(DataType.TOPIC);
      navigateBack();

      await generateDescriptionForTopic(newTopicEntity);

      addTopic(lsc, newTopicEntity, userId);
    }
  };

  return (
    <div>
      <Sheet navigateBack={navigateBack} visible={isVisible}>
        <FlexBox>
          <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
          {title !== '' && (
            <PrimaryButton onClick={saveTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
          )}
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder={displayLabelTexts(selectedLanguage).title}
            />
          </SectionRow>
          <SectionRow last>
            <TextAreaInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={displayLabelTexts(selectedLanguage).description}
            />
          </SectionRow>
        </Section>
        <Spacer size={2} />
        {title && (
          <Section>
            <SectionRow
              last
              role="button"
              onClick={openImageSelectorSheet}
              icon={selectedImageSrc ? <IoCreateOutline /> : <IoAdd />}
            >
              {selectedImageSrc
                ? displayActionTexts(selectedLanguage).editImage
                : displayActionTexts(selectedLanguage).addImage}
            </SectionRow>
          </Section>
        )}
        <Spacer />
      </Sheet>

      <SelectTopicImageSheet topicTitle={title} />
    </div>
  );
};

export default AddTopicSheet;
