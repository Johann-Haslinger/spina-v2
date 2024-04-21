import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, StoryGuid } from "../../../base/enums";
import { FlexBox, Sheet, Spacer, TextInput } from "../../../components";
import { useContext, useRef } from "react";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjectEntities";
import {
  DescriptionFacet,
  IdentifierFacet,
  ParentFacet,
} from "@leanscope/ecs-models";
import {
  DueDateFacet,
  StatusFacet,
  TitleFacet,
} from "../../../app/AdditionalFacets";
import { Entity } from "@leanscope/ecs-engine";
import { v4 } from "uuid";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import SectionRow from "../../../components/layout/SectionRow";

const AddHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(StoryGuid.ADD_NEW_HOMEWORK_STORY);
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const homeworkTitleRef = useRef<HTMLInputElement>(null);
  const homeworkDueDateRef = useRef<HTMLInputElement>(null);
  const homeworkParentRef = useRef<HTMLSelectElement>(null);
  const homeworkDescriptionRef = useRef<HTMLTextAreaElement>(null);

  const navigateBack = () =>
    lsc.stories.transitTo(StoryGuid.OBSERVING_HOMEWORKS_STORY);

  const addHomework = () => {
    if (
      homeworkTitleRef.current &&
      homeworkDueDateRef.current &&
      homeworkParentRef.current &&
      homeworkDescriptionRef.current
    ) {
      console.log("Adding homework");
      const newHomeworkEntity = new Entity();
      lsc.engine.addEntity(newHomeworkEntity);
      newHomeworkEntity.add(new IdentifierFacet({ guid: v4() }));
      newHomeworkEntity.add(
        new ParentFacet({ parentId: homeworkParentRef.current.value })
      );
      newHomeworkEntity.add(
        new TitleFacet({ title: homeworkTitleRef.current.value })
      );
      newHomeworkEntity.add(
        new DueDateFacet({ dueDate: homeworkDueDateRef.current.value })
      );
      newHomeworkEntity.add(
        new DescriptionFacet({
          description: homeworkDescriptionRef.current.value,
        })
      );
      newHomeworkEntity.add(new StatusFacet({ status: 1 }));
      newHomeworkEntity.add(DataTypes.HOMEWORK);
      console.log(newHomeworkEntity);
    }
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        
        <button onClick={navigateBack}>Back</button>
        <button onClick={addHomework}>Add homework</button>
      </FlexBox>
      <Spacer />
      <SectionRow>
        <TextInput ref={homeworkTitleRef} placeholder="Title" />
      </SectionRow>
      <SectionRow>
        <FlexBox>
          <p>Zieldatum</p>
          <input ref={homeworkDueDateRef} type="date" placeholder="Due date" />
        </FlexBox>
      </SectionRow>
      <select ref={homeworkParentRef}>
        {schooolSubjectEntities.map((entity, idx) => {
          const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid;
          const schoolSubjectTitle = entity.get(TitleFacet)?.props.title;
          return (
            <option key={idx} value={schoolSubjectId}>
              {schoolSubjectTitle}
            </option>
          );
        })}
      </select>
      <textarea ref={homeworkDescriptionRef} placeholder="Description" />
    </Sheet>
  );
};

export default AddHomeworkSheet;
