import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useRef, useState } from 'react';
import { IoAdd, IoCreateOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { DateAddedFacet, TitleFacet } from '../../../../base/additionalFacets';
import { DataType, Story } from '../../../../base/enums';
import { useInputFocus } from '../../../../common/hooks';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { addTopic } from '../../../../common/utilities/addTopic';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useInputFocus(inputRef, isVisible);

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
              ref={inputRef}
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
