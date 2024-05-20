import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Fragment, useContext, useState } from "react";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  SecondaryButton,
  FlexBox,
  PrimaryButton,
  Section,
  SectionRow,
  SelectInput,
  Sheet,
  Spacer,
  TextInput,
} from "../../../../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from "../../../../utils/displayText";
import { Entity } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { v4 } from "uuid";
import { DateAddedFacet, TitleFacet } from "../../../../app/additionalFacets";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import supabaseClient from "../../../../lib/supabase";
import { useUserData } from "../../../../hooks/useUserData";
import { useSchoolSubjectEntities } from "../../../../hooks/useSchoolSubjects";
import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import { useSchoolSubjectTopics } from "../../../../hooks/useSchoolSubjectTopics";

const AddFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_FLASHCARD_SET_STORY);
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>("");
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicId } = useSelectedTopic();
  const { userId } = useUserData();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const inCollectionVisible = location.pathname.includes("/collection");
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const [newFlashcardSet, setNewFlashcardSet] = useState({
    title: "",
    parent: "",
  });

  const addFlashcardSet = async () => {
    navigateBack();
    const flashcardSetId = v4();
    const parentId = inCollectionVisible ? selectedTopicId || "" : newFlashcardSet.parent;

    const newFlashcardSetEntity = new Entity();
    lsc.engine.addEntity(newFlashcardSetEntity);
    newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
    newFlashcardSetEntity.add(new TitleFacet({ title: newFlashcardSet.title }));
    newFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    newFlashcardSetEntity.add(new ParentFacet({ parentId: parentId }));
    newFlashcardSetEntity.addTag(DataTypes.FLASHCARD_SET);
    newFlashcardSetEntity.addTag(DataTypes.FLASHCARD_GROUP);

    const { error } = await supabaseClient.from("flashcardSets").insert([
      {
        user_id: userId,
        id: flashcardSetId,
        flashcardSetName: newFlashcardSet.title,
        parentId: parentId,
      },
    ]);

    if (error) {
      console.error("Error adding flashcard set", error);
    }
  };

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {newFlashcardSet.title && (inCollectionVisible || newFlashcardSet.parent) && (
          <PrimaryButton onClick={addFlashcardSet}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last={inCollectionVisible}>
          <TextInput
            value={newFlashcardSet.title}
            onChange={(e) => setNewFlashcardSet({ ...newFlashcardSet, title: e.target.value })}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
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
                onClick={() => setNewFlashcardSet({ ...newFlashcardSet, parent: topic.id })}
                icon={newFlashcardSet.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
              >
                {topic.title}
              </SectionRow>
            ))}
            {!hasSchoolSubjectTopics && <SectionRow last>{displayAlertTexts(selectedLanguage).noTopics}</SectionRow>}
          </Section>
        </Fragment>
      )}
    </Sheet>
  );
};

export default AddFlashcardSetSheet;
