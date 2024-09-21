import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { v4 } from 'uuid';
import { DateAddedFacet, TitleFacet } from '../../../../app/additionalFacets';
import { DataType, Story, SupabaseTable } from '../../../../base/enums';
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
import { useUserData } from '../../../../hooks/useUserData';
import supabaseClient from '../../../../lib/supabase';
import { displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { getCompletion } from '../../../../utils/getCompletion';
import { useSelectedGroupSchoolSubject } from '../../hooks/useSelectedGroupSchoolSubject';
import { useSelectedLearningGroup } from '../../hooks/useSelectedLearningGroup';

const AddGroupTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_GROUP_TOPIC_STORY);
  const { selectedGroupSchoolSubjectId } = useSelectedGroupSchoolSubject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();
  const { selectedLearningGroupId } = useSelectedLearningGroup();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SCHOOL_SUBJECT_STORY);

  const addTopic = async () => {
    if (selectedGroupSchoolSubjectId) {
      const topicId = v4();
      let topicDescription = description;

      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: topicId }));
      newTopicEntity.add(new ParentFacet({ parentId: selectedGroupSchoolSubjectId }));
      newTopicEntity.add(new DescriptionFacet({ description: topicDescription }));
      newTopicEntity.add(new TitleFacet({ title: title }));
      newTopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newTopicEntity.add(DataType.GROUP_TOPIC);

      navigateBack();

      if (description === '') {
        const generatingDescriptionPrompt =
          'Bitte schreibe einen sehr kurzen Beschreibungssatz zu folgendem Thema:' + title;

        topicDescription = await getCompletion(generatingDescriptionPrompt);
        newTopicEntity.add(new DescriptionFacet({ description: topicDescription }));
      }

      const { error } = await supabaseClient.from(SupabaseTable.GROUP_TOPICS).insert([
        {
          id: topicId,
          creator_id: userId,
          group_id: selectedLearningGroupId,
          parent_id: selectedGroupSchoolSubjectId,
          title: title,
          description: topicDescription,
        },
      ]);
      if (error) {
        console.error('Error adding group topic: ', error);
      }
    }
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {title !== '' && <PrimaryButton onClick={addTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>}
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

export default AddGroupTopicSheet;
