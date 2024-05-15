import { Fragment, useEffect } from "react";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  SecondaryButton,
  DateInput,
  FlexBox,
  PrimaryButton,
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
import { DueDateFacet, RelationshipFacet, StatusFacet, TitleFacet } from "../../../../app/a";
import { Entity } from "@leanscope/ecs-engine";
import { v4 } from "uuid";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useUserData } from "../../../../hooks/useUserData";
import supabaseClient from "../../../../lib/supabase";
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { useSchoolSubjectTopics } from "../../../../hooks/useSchoolSubjectTopics";
import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { useLocation } from "react-router";

const AddHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const { selectedTopicId: openTopicId } = useSelectedTopic();
  const { selectedSchoolSubjectId: openSchoolSubjectId } = useSelectedSchoolSubject();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>("");
  const [newHomework, setNewHomework] = useState({
    id: v4(),
    title: "",
    dueDate: "",
    parent: "",
    description: "",
    relatedSchoolSubject: "",
  });
  const { userId } = useUserData();
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const location = useLocation();
  const inCollectionVisible = location.pathname.includes("/collection");

  useEffect(() => {
    setNewHomework({
      id: v4(),
      title: "",
      dueDate: "",
      parent: "",
      description: "",
      relatedSchoolSubject: "",
    });
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_HOMEWORKS_STORY);

  const addHomework = async () => {
    const { title, dueDate, parent, description, id } = newHomework;
    const newHomeworkEntity = new Entity();
    lsc.engine.addEntity(newHomeworkEntity);
    newHomeworkEntity.add(new IdentifierFacet({ guid: id }));
    newHomeworkEntity.add(
      new ParentFacet({
        parentId: openTopicId || parent,
      })
    );
    newHomeworkEntity.add(new TitleFacet({ title: title }));
    newHomeworkEntity.add(new DueDateFacet({ dueDate: dueDate }));
    newHomeworkEntity.add(
      new TextFacet({
        text: description,
      })
    );
    newHomeworkEntity.add(
      new RelationshipFacet({
        relationship: openSchoolSubjectId || selectedSchoolSubjectId,
      })
    );
    newHomeworkEntity.add(new StatusFacet({ status: 1 }));
    newHomeworkEntity.add(DataTypes.HOMEWORK);

    const { error } = await supabaseClient.from("homeworks").insert([
      {
        id: id,
        user_id: userId,
        title: title,
        parentId: openTopicId || parent,
        text: description,
        dueDate: dueDate,
        status: 1,
        relatedSubject: openSchoolSubjectId || selectedSchoolSubjectId,
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
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>

        {newHomework.title && newHomework.dueDate && schooolSubjectEntities.length !== 0 && (
          <PrimaryButton onClick={addHomework}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            value={newHomework.title}
            onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        <SectionRow last={inCollectionVisible}>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).dueDate} </p>
            <DateInput
              value={newHomework.dueDate}
              onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
              type="date"
            />
          </FlexBox>
        </SectionRow>
        {!inCollectionVisible && (
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
        )}
      </Section>
      {(hasSchoolSubjectTopics || selectedSchoolSubjectId) && (
        <Fragment>
          <Spacer size={2} />
          <Section>
            {schoolSubjectTopics.map((topic, idx) => (
              <SectionRow
                last={idx === schoolSubjectTopics.length - 1}
                key={idx}
                onClick={() => setNewHomework({ ...newHomework, parent: topic.id })}
                icon={newHomework.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
              >
                {topic.title}
              </SectionRow>
            ))}
            {!hasSchoolSubjectTopics && <SectionRow last>{displayAlertTexts(selectedLanguage).noTopics}</SectionRow>}
          </Section>
        </Fragment>
      )}

      <Spacer size={2} />
      <Section>
        <SectionRow last>
          <TextAreaInput
            value={newHomework.description}
            onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
            placeholder={displayLabelTexts(selectedLanguage).description}
          />
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default AddHomeworkSheet;
