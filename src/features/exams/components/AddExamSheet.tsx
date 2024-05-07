import { useIsStoryCurrent } from "@leanscope/storyboarding";
import {
  CancelButton,
  FlexBox,
  SaveButton,
  Section,
  SectionRow,
  SelectInput,
  Sheet,
  Spacer,
  TextInput,
} from "../../../components";
import { Stories } from "../../../base/enums";
import { useContext, useEffect, useState } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from "../../../utils/displayText";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjects";
import { IdentifierFacet } from "@leanscope/ecs-models";
import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import { TitleFacet } from "../../../app/AdditionalFacets";
import { useSchoolSubjectTopics } from "../../../hooks/useSchoolSubjectTopics";

const AddExamSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADD_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>("");
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const [newExam, setNewExam] = useState({
    title: "",
    parent: "",
  });

  useEffect(() => {
    if (!isVisible) {
      setNewExam({ title: "", parent: "" });
    }
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_EXAMS_STORY);

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <CancelButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</CancelButton>
        {newExam.title && newExam.parent && (
          <SaveButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).save}</SaveButton>
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
