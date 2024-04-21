import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, StoryGuid } from "../../../base/enums";
import {
  DateInput,
  FlexBox,
  SelectInput,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from "../../../components";
import { useContext, useState } from "react";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjectEntities";
import { IdentifierFacet, ParentFacet, TextFacet } from "@leanscope/ecs-models";
import {
  DueDateFacet,
  StatusFacet,
  TitleFacet,
} from "../../../app/AdditionalFacets";
import { Entity } from "@leanscope/ecs-engine";
import { v4 } from "uuid";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import SectionRow from "../../../components/layout/SectionRow";
import { useUserData } from "../../../hooks/useUserData";
import supabase from "../../../lib/supabase";

const AddHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(StoryGuid.ADD_NEW_HOMEWORK_STORY);
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
    lsc.stories.transitTo(StoryGuid.OBSERVING_HOMEWORKS_STORY);

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
    console.log("id", id);
    const { error } = await supabase.from("homeworks").insert([
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
        <button onClick={navigateBack}>Back</button>
       {newHomework.title && newHomework.dueDate && schooolSubjectEntities.length !== 0 &&  <button onClick={addHomework}>
          <strong>Add homework</strong>
        </button>}
      </FlexBox>
      <Spacer />
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
      <SectionRow>
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
      <Spacer />
      <TextAreaInput
        value={newHomework.description}
        onChange={(e) =>
          setNewHomework({ ...newHomework, description: e.target.value })
        }
        placeholder="Description"
      />
    </Sheet>
  );
};

export default AddHomeworkSheet;
