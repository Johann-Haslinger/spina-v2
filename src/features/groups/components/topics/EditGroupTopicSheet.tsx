import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { DescriptionFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { TitleFacet } from '../../../../base/additionalFacets';
import { Story, SupabaseColumn } from '../../../../base/enums';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
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
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';
const EditGroupGroupTopicSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.EDITING_GROUP_TOPIC_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicTitle, selectedGroupTopicDescription, selectedGroupTopicEntity, selectedGroupTopicId } =
    useSelectedGroupTopic();
  const [newTitle, setNewTitle] = useState(selectedGroupTopicTitle);
  const [newDescription, setNewDescription] = useState(selectedGroupTopicDescription);

  useEffect(() => {
    setNewTitle(selectedGroupTopicTitle);
    setNewDescription(selectedGroupTopicDescription);
  }, [selectedGroupTopicTitle, selectedGroupTopicDescription]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_GROUP_TOPIC_STORY);

  const updateGroupTopic = async () => {
    if (newTitle && newDescription) {
      navigateBack();
      selectedGroupTopicEntity?.add(new TitleFacet({ title: newTitle }));
      selectedGroupTopicEntity?.add(new DescriptionFacet({ description: newDescription }));

      const { error } = await supabaseClient
        .from('learning_group_topics')
        .update({
          title: newTitle,
          description: newDescription,
        })
        .eq(SupabaseColumn.ID, selectedGroupTopicId);

      if (error) {
        console.error('Error updating learning group topic', error);
      }
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {(newTitle !== selectedGroupTopicTitle || newDescription !== selectedGroupTopicDescription) && (
          <PrimaryButton onClick={updateGroupTopic}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
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
    </Sheet>
  );
};

export default EditGroupGroupTopicSheet;
