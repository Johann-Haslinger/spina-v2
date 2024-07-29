import styled from "@emotion/styled/macro";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  ColorFacet,
  DescriptionFacet,
  IdentifierFacet,
  OrderFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { useContext, useEffect, useState } from "react";
import tw from "twin.macro";
import { v4 } from "uuid";
import { TitleFacet } from "../../../app/additionalFacets";
import { COLOR_ITEMS } from "../../../base/constants";
import { DataTypes, Stories, SupabaseTables } from "../../../base/enums";
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
} from "../../../components";
import { useMockupData } from "../../../hooks/useMockupData";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjects";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import {
  displayAlertTexts,
  displayButtonTexts,
  displayLabelTexts,
} from "../../../utils/displayText";

const StyledColorSelect = styled.select<{ color: string }>`
  ${tw`rounded-md text-white px-2 outline-none py-0.5`}
  background-color: ${({ color }) => color};
`;

const useNewLearningGroup = () => {
  const isVisible = useIsStoryCurrent(Stories.ADDING_LERNING_GROUP_STORY);
  const [newLearningGroup, setNewLearningGroup] = useState({
    title: "",
    color: COLOR_ITEMS[2].accentColor,
    description: "",
  });

  useEffect(() => {
    setNewLearningGroup({
      title: "",
      color: COLOR_ITEMS[2].accentColor,
      description: "",
    });
  }, [isVisible]);

  return {
    newLearningGroup,
    setNewLearningGroup,
  };
};

const AddLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_LERNING_GROUP_STORY);
  const { newLearningGroup, setNewLearningGroup } = useNewLearningGroup();
  const { selectedLanguage } = useSelectedLanguage();
  const { userId } = useUserData();
  const { shouldFetchFromSupabase } = useMockupData();
  const schoolSubjectEntities = useSchoolSubjectEntities();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_LERNING_GROUPS_STORY);

  const saveLearningGroup = async () => {
    navigateBack();

    const newLearningGroupId = v4();

    const newLearningGroupEntity = new Entity();
    lsc.engine.addEntity(newLearningGroupEntity);
    newLearningGroupEntity.add(
      new IdentifierFacet({ guid: newLearningGroupId }),
    );
    newLearningGroupEntity.add(
      new TitleFacet({ title: newLearningGroup.title }),
    );
    newLearningGroupEntity.add(
      new ColorFacet({ colorName: newLearningGroup.color }),
    );
    newLearningGroupEntity.add(
      new DescriptionFacet({ description: newLearningGroup.description }),
    );
    newLearningGroupEntity.add(DataTypes.LEARNING_GROUP);

    if (shouldFetchFromSupabase) {
      const { error } = await supabaseClient
        .from(SupabaseTables.LEARNING_GROUPS)
        .insert([
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
        console.error("Error inserting new learning group", error);
      }

      schoolSubjectEntities.forEach(async (schoolSubjectEntity, idx) => {
        const newLearningGroupSchoolSubjectId = v4();
        const newLearningGroupSchoolSubjectTitle =
          schoolSubjectEntity.get(TitleFacet)?.props.title ||
          displayAlertTexts(selectedLanguage).noTitle;

        const newLearningGroupSchoolSubjectEntity = new Entity();
        lsc.engine.addEntity(newLearningGroupSchoolSubjectEntity);
        newLearningGroupSchoolSubjectEntity.add(
          new IdentifierFacet({ guid: newLearningGroupSchoolSubjectId }),
        );
        newLearningGroupSchoolSubjectEntity.add(
          new TitleFacet({ title: newLearningGroupSchoolSubjectTitle }),
        );
        newLearningGroupSchoolSubjectEntity.add(
          new ParentFacet({ parentId: newLearningGroupId }),
        );
        newLearningGroupSchoolSubjectEntity.add(
          new OrderFacet({ orderIndex: idx }),
        );
        newLearningGroupSchoolSubjectEntity.add(DataTypes.GROUP_SCHOOL_SUBJECT);

        const { error } = await supabaseClient
          .from(SupabaseTables.GROUP_SCHOOL_SUBJECTS)
          .insert([
            {
              id: newLearningGroupSchoolSubjectId,
              group_id: newLearningGroupId,
              title: newLearningGroupSchoolSubjectTitle,
            },
          ]);

        if (error) {
          console.error(
            "Error inserting new learning group school subject",
            error,
          );
        }
      });
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </SecondaryButton>
        {newLearningGroup.title && (
          <PrimaryButton onClick={saveLearningGroup}>
            {displayButtonTexts(selectedLanguage).save}
          </PrimaryButton>
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
                <option key={idx} value={colorItem.accentColor}>
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
