import { useIsStoryCurrent } from "@leanscope/storyboarding";
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
  TextInput,
} from "../../../components";
import { DataTypes, Stories } from "../../../base/enums";
import { useContext, useEffect, useState } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjects";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import { DueDateFacet, RelationshipFacet, StatusFacet, TitleFacet } from "../../../app/AdditionalFacets";
import { useSchoolSubjectTopics } from "../../../hooks/useSchoolSubjectTopics";
import { Entity } from "@leanscope/ecs-engine";
import supabaseClient from "../../../lib/supabase";
import { v4 } from "uuid";
import { useUserData } from "../../../hooks/useUserData";

const AddExamSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>("");
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const { userId } = useUserData();
  const [newExam, setNewExam] = useState({
    id: v4(),
    title: "",
    dueDate: "",
    parent: "",
  });

  useEffect(() => {
    if (!isVisible) {
      setNewExam({ title: "", parent: "", dueDate: "", id: v4() });
    }
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_EXAMS_STORY);

  const addExam = async () => {
    const { title, dueDate, parent, id } = newExam;
    const newExamEntity = new Entity();
    lsc.engine.addEntity(newExamEntity);
    newExamEntity.add(new IdentifierFacet({ guid: id }));
    newExamEntity.add(
      new ParentFacet({
        parentId: parent,
      })
    );
    newExamEntity.add(new TitleFacet({ title: title }));
    newExamEntity.add(new DueDateFacet({ dueDate: dueDate }));

    newExamEntity.add(
      new RelationshipFacet({
        relationship: selectedSchoolSubjectId,
      })
    );
    newExamEntity.add(new StatusFacet({ status: 1 }));
    newExamEntity.add(DataTypes.EXAM);

    const { error } = await supabaseClient.from("exams").insert([
      {
        id: id,
        user_id: userId,
        title: title,
        parentId: parent,
        dueDate: dueDate,
        status: 1,
        relatedSubject: selectedSchoolSubjectId,
      },
    ]);

    if (error) {
      console.error(error);
    }

    navigateBack();
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</CancelButton>
        {newExam.title && newExam.parent && (
          <SaveButton onClick={addExam}>{displayButtonTexts(selectedLanguage).save}</SaveButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            placeholder={displayLabelTexts(selectedLanguage).title}
            value={newExam.title}
            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
          />
        </SectionRow>
        <SectionRow>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).dueDate} </p>
            <DateInput
              value={newExam.dueDate}
              onChange={(e) => setNewExam({ ...newExam, dueDate: e.target.value })}
              type="date"
            />
          </FlexBox>
        </SectionRow>
        <SectionRow last>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).schoolSubject}</p>
            <SelectInput value={selectedSchoolSubjectId} onChange={(e) => setSelectedSchoolSubjectId(e.target.value)}>
              <option value="">{displayLabelTexts(selectedLanguage).select}</option>
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
      {selectedSchoolSubjectId && (
        <Section>
          {schoolSubjectTopics.map((topic, idx) => (
            <SectionRow
              last={idx === schoolSubjectTopics.length - 1}
              key={idx}
              onClick={() => setNewExam({ ...newExam, parent: topic.id })}
              icon={newExam.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
            >
              {topic.title}
            </SectionRow>
          ))}
          {!hasSchoolSubjectTopics && <SectionRow last>{displayAlertTexts(selectedLanguage).noTopics}</SectionRow>}
        </Section>
      )}
    </Sheet>
  );
};

export default AddExamSheet;
