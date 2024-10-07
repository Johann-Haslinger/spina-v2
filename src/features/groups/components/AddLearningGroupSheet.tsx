import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { ColorFacet, DescriptionFacet, IdentifierFacet, OrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { TitleFacet } from '../../../base/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataType, Story, SupabaseTable } from '../../../base/enums';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useSchoolSubjectEntities } from '../../../common/hooks/useSchoolSubjects';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../common/hooks/useUserData';
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from '../../../common/utilities/displayText';
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
} from '../../../components';
import supabaseClient from '../../../lib/supabase';

const StyledColorSelect = styled.select<{ color: string }>`
  ${tw`rounded-md text-white px-2 outline-none py-0.5`}
  background-color: ${({ color }) => color};
`;

const useNewLearningGroup = () => {
  const isVisible = useIsStoryCurrent(Story.ADDING_LERNING_GROUP_STORY);
  const [newLearningGroup, setNewLearningGroup] = useState({
    title: '',
    color: COLOR_ITEMS[2].color,
    description: '',
  });

  useEffect(() => {
    setNewLearningGroup({
      title: '',
      color: COLOR_ITEMS[2].color,
      description: '',
    });
  }, [isVisible]);

  return {
    newLearningGroup,
    setNewLearningGroup,
  };
};

const AddLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_LERNING_GROUP_STORY);
  const { newLearningGroup, setNewLearningGroup } = useNewLearningGroup();
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();
  const { isUsingSupabaseData: shouldFetchFromSupabase } = useCurrentDataSource();
  const schoolSubjectEntities = useSchoolSubjectEntities();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_LERNING_GROUPS_STORY);

  const saveLearningGroup = async () => {
    navigateBack();

    const newLearningGroupId = v4();

    const newLearningGroupEntity = new Entity();
    lsc.engine.addEntity(newLearningGroupEntity);
    newLearningGroupEntity.add(new IdentifierFacet({ guid: newLearningGroupId }));
    newLearningGroupEntity.add(new TitleFacet({ title: newLearningGroup.title }));
    newLearningGroupEntity.add(new ColorFacet({ colorName: newLearningGroup.color }));
    newLearningGroupEntity.add(new DescriptionFacet({ description: newLearningGroup.description }));
    newLearningGroupEntity.add(DataType.LEARNING_GROUP);

    if (shouldFetchFromSupabase) {
      const { error } = await supabaseClient.from(SupabaseTable.LEARNING_GROUPS).insert([
        {
          id: newLearningGroupId,
          title: newLearningGroup.title,
          color: newLearningGroup.color,
          description: newLearningGroup.description,
          owner_id: userId,
          members: [userId],
        },
      ]);

      if (error) {
        console.error('Error inserting new learning group', error);
      }

      schoolSubjectEntities.forEach(async (schoolSubjectEntity, idx) => {
        const newLearningGroupSchoolSubjectId = v4();
        const newLearningGroupSchoolSubjectTitle =
          schoolSubjectEntity.get(TitleFacet)?.props.title || displayAlertTexts(selectedLanguage).noTitle;

        const newLearningGroupSchoolSubjectEntity = new Entity();
        lsc.engine.addEntity(newLearningGroupSchoolSubjectEntity);
        newLearningGroupSchoolSubjectEntity.add(new IdentifierFacet({ guid: newLearningGroupSchoolSubjectId }));
        newLearningGroupSchoolSubjectEntity.add(new TitleFacet({ title: newLearningGroupSchoolSubjectTitle }));
        newLearningGroupSchoolSubjectEntity.add(new ParentFacet({ parentId: newLearningGroupId }));
        newLearningGroupSchoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));
        newLearningGroupSchoolSubjectEntity.add(DataType.GROUP_SCHOOL_SUBJECT);

        const { error } = await supabaseClient.from(SupabaseTable.GROUP_SCHOOL_SUBJECTS).insert([
          {
            id: newLearningGroupSchoolSubjectId,
            group_id: newLearningGroupId,
            title: newLearningGroupSchoolSubjectTitle,
          },
        ]);

        if (error) {
          console.error('Error inserting new learning group school subject', error);
        }
      });
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {newLearningGroup.title && (
          <PrimaryButton onClick={saveLearningGroup}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            placeholder={displayLabelTexts(selectedLanguage).title}
            onChange={(e) =>
              setNewLearningGroup({
                ...newLearningGroup,
                title: e.target.value,
              })
            }
          />
        </SectionRow>
        <SectionRow>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).color}</p>
            <StyledColorSelect
              onChange={(e) =>
                setNewLearningGroup({
                  ...newLearningGroup,
                  color: e.target.value,
                })
              }
              color={newLearningGroup.color}
              value={newLearningGroup.color}
            >
              {COLOR_ITEMS.map((colorItem, idx) => (
                <option key={idx} value={colorItem.color}>
                  {colorItem.name}
                </option>
              ))}
            </StyledColorSelect>
          </FlexBox>
        </SectionRow>
        <SectionRow last>
          <TextAreaInput
            placeholder={displayLabelTexts(selectedLanguage).description}
            onChange={(e) =>
              setNewLearningGroup({
                ...newLearningGroup,
                description: e.target.value,
              })
            }
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddLearningGroupSheet;
