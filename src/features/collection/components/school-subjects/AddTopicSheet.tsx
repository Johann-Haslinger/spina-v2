import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { v4 } from 'uuid';
import { DateAddedFacet, TitleFacet } from '../../../../app/additionalFacets';
import { AdditionalTags, DataTypes, Stories } from '../../../../base/enums';
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
import { displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { generateImageForTopic } from '../../functions/generateImageForTopic';
import { useSelectedSchoolSubject } from '../../hooks/useSelectedSchoolSubject';

const AddTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_TOPIC_STORY);
  const { selectedSchoolSubjectId } = useSelectedSchoolSubject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_SCHOOL_SUBJECT_STORY);

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
      newTopicEntity.add(DataTypes.TOPIC);
      newTopicEntity.add(AdditionalTags.GENERATING);
      navigateBack();

      await generateImageForTopic(newTopicEntity);

      addTopic(lsc, newTopicEntity, userId);
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {title !== '' && <PrimaryButton onClick={saveTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>}
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
    </Sheet>
  );
};

export default AddTopicSheet;
