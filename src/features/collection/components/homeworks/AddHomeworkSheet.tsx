import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  CancelButton,
  DateInput,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  SelectInput,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from "../../../../components";
import { useContext, useState } from "react";
import { useSchoolSubjectEntities } from "../../../../hooks/useSchoolSubjects";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import {
  DueDateFacet,
  StatusFacet,
  TitleFacet,
} from "../../../../app/AdditionalFacets";
import { Entity } from "@leanscope/ecs-engine";
import { v4 } from "uuid";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useUserData } from "../../../../hooks/useUserData";
import supabaseClient from "../../../../lib/supabase";
import { displayButtonTexts } from "../../../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const AddHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const [newHomework, setNewHomework] = useState({
    id: v4(),
    title: "",
    dueDate: "",
    parent: "",
    description: "",
  });
  const { userId } = useUserData();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_HOMEWORKS_STORY);

  const addHomework = async () => {
    const { title, dueDate, parent, description, id } = newHomework;
    const newHomeworkEntity = new Entity();
    lsc.engine.addEntity(newHomeworkEntity);
    newHomeworkEntity.add(new IdentifierFacet({ guid: id }));
    newHomeworkEntity.add(
      new ParentFacet({
        parentId:
          parent || schooolSubjectEntities[0].get(IdentifierFacet)?.props.guid!,
      })
    );
    newHomeworkEntity.add(new TitleFacet({ title: title }));
    newHomeworkEntity.add(new DueDateFacet({ dueDate: dueDate }));
    newHomeworkEntity.add(
      new TextFacet({
        text: description,
      })
    );
    newHomeworkEntity.add(new StatusFacet({ status: 1 }));
    newHomeworkEntity.add(DataTypes.HOMEWORK);

    const { error } = await supabaseClient.from("homeworks").insert([
      {
        id: id,
        user_id: userId,
        title: title,
        parentId:
          parent || schooolSubjectEntities[0].get(IdentifierFacet)?.props.guid!,
        text: description,
        dueDate: dueDate,
        status: 1,
      },
    ]);

    if (error) {
      console.error(error);
    }

    navigateBack();
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).cancel}
        </CancelButton>

        {newHomework.title &&
          newHomework.dueDate &&
          schooolSubjectEntities.length !== 0 && (
            <SaveButton onClick={addHomework}>
              {displayButtonTexts(selectedLanguage).save}
            </SaveButton>
          )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newHomework.title}
            onChange={(e) =>
              setNewHomework({ ...newHomework, title: e.target.value })
            }
            placeholder="Title"
          />
        </SectionRow>
        <SectionRow>
          <FlexBox>
            <p>Due Date</p>
            <DateInput
              value={newHomework.dueDate}
              onChange={(e) =>
                setNewHomework({ ...newHomework, dueDate: e.target.value })
              }
              type="date"
              placeholder="Due date"
            />
          </FlexBox>
        </SectionRow>
        <SectionRow type="last">
          <FlexBox>
            <p>School Subject</p>
            <SelectInput
              value={newHomework.parent}
              onChange={(e) =>
                setNewHomework({ ...newHomework, parent: e.target.value })
              }
            >
              {schooolSubjectEntities.map((entity, idx) => {
                const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid;
                const schoolSubjectTitle = entity.get(TitleFacet)?.props.title;
                return (
                  <option key={idx} value={schoolSubjectId}>
                    {schoolSubjectTitle}
                  </option>
                );
              })}
            </SelectInput>
          </FlexBox>
        </SectionRow>
      </Section>
        <Spacer size={2} />
      <Section>
        <SectionRow type="last">
        <TextAreaInput
          value={newHomework.description}
          onChange={(e) =>
            setNewHomework({ ...newHomework, description: e.target.value })
          }
          placeholder="Description"
        />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddHomeworkSheet;
