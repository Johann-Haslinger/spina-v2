import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Fragment, useContext, useEffect, useState } from "react";
import { IoAdd, IoChevronForward, IoChevronUp } from "react-icons/io5";
import tw from "twin.macro";
import { dummyGroupSchoolSubjects, dummyGroupTopics, dummyLearningGroups } from "../../../base/dummy";
import { Stories } from "../../../base/enums";
import { CloseButton, FlexBox, ScrollableBox, Section, SectionRow, Sheet, Spacer } from "../../../components";
import { useMockupData } from "../../../hooks/useMockupData";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import { displayAlertTexts } from "../../../utils/displayText";
import { useSelectedFlashcardSet } from "../../collection/hooks/useSelectedFlashcardSet";
import { useSelectedNote } from "../../collection/hooks/useSelectedNote";

const StyledMoreButtonWrapper = styled.div`
  ${tw`text-seconderyText text-opacity-50`}
`;

const fetchLearningGroups = async () => {
  const { data: learningGroups, error } = await supabaseClient.from("learning_groups").select("title, id");

  if (error) {
    console.error("Error fetching learningGroups:", error);
    return [];
  }

  return learningGroups || [];
};

const fetchSchoolSubjectsForLearnigGroup = async (learningGroupId: string) => {
  const { data: schoolSubjects, error } = await supabaseClient
    .from("group_school_subjects")
    .select("title, id")
    .eq("parentId", learningGroupId);

  if (error) {
    console.error("Error fetching schoolSubjects:", error);
    return [];
  }

  return schoolSubjects || [];
};

const fetchTopicsForGroupSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from("group_topics")
    .select("title, id")
    .eq("parentId", subjectId);

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return topics || [];
};

const AddResourceToLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const learningGroups = useLearningGroups(isVisible);

  const navigateBack = () => lsc.stories.transitTo(Stories.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <ScrollableBox>
        <Section>
          {learningGroups.length == 0 && (
            <SectionRow last>{displayAlertTexts(selectedLanguage).noLearningGroups}</SectionRow>
          )}
          {learningGroups.map((learningGroup, idx) => (
            <LearningGroupRow key={idx} learningGroup={learningGroup} last={learningGroups.length - 1 == idx} />
          ))}
        </Section>
      </ScrollableBox>
    </Sheet>
  );
};

export default AddResourceToLearningGroupSheet;

const LearningGroupRow = (props: { last: boolean; learningGroup: { title: string; id: string } }) => {
  const { last, learningGroup } = props;
  const { id: learningGroupId, title: learningGroupTitle } = learningGroup;
  const [isSelected, setIsSelected] = useState(false);
  const schoolSubjects = useLearningGroupSchoolSubjects(learningGroupId, isSelected);

  const handleClick = () => setIsSelected(!isSelected);

  return (
    <Fragment>
      <SectionRow role="button" last={last} onClick={handleClick}>
        <FlexBox>
          {learningGroupTitle}
          <StyledMoreButtonWrapper>{isSelected ? <IoChevronUp /> : <IoChevronForward />}</StyledMoreButtonWrapper>
        </FlexBox>
      </SectionRow>
      {isSelected &&
        schoolSubjects.map((schoolSubject, idx) => (
          <SchoolSubjectRow learningGroupId={learningGroupId} key={idx} schoolSubject={schoolSubject} />
        ))}
    </Fragment>
  );
};

const SchoolSubjectRow = (props: { schoolSubject: { title: string; id: string }; learningGroupId: string }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { schoolSubject, learningGroupId } = props;
  const { title, id: schoolSubjectId } = schoolSubject;
  const [isSelected, setIsSelected] = useState(false);
  const { userId } = useUserData();
  const topics = useSchoolSubjectTopics(schoolSubjectId, isSelected);
  const { selectedFlashcardSetTitle, selectedFlashcardSetId } = useSelectedFlashcardSet();
  const { selectedNoteTitle } = useSelectedNote();

  const handleClick = () => setIsSelected(!isSelected);
  console.log(selectedNoteTitle, selectedFlashcardSetTitle, selectedFlashcardSetId, userId, lsc, learningGroupId);
  const addResourceToTopic = (topicId: string) => {
    console.log(topicId);
    // const newResourceId = v4();

    // if (selectedFlashcardSetTitle) {
    //   const newGroupFlashcardSetEntity = new Entity();
    //   newGroupFlashcardSetEntity.add(new IdentifierFacet({ guid: newResourceId }));
    //   newGroupFlashcardSetEntity.add(new TitleFacet({ title: selectedFlashcardSetTitle }));
    //   newGroupFlashcardSetEntity.add(new ParentFacet({ parentId: topicId }));
    //   newGroupFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    //   newGroupFlashcardSetEntity.add(DataTypes.GROUP_FLASHCARD_SET);

    //   addGroupFlashcardSet(lsc, newGroupFlashcardSetEntity, userId, learningGroupId);

    //   const flashcardEntites = lsc.engine.entities.filter(
    //     (e) => e.has(DataTypes.FLASHCARD) && e.get(ParentFacet)?.props.parentId == selectedFlashcardSetId
    //   );

    //   const newGroupFlashcardEntities = flashcardEntites.map((flashcardEntity) => {
    //     const newGroupFlashcardEntity = new Entity();
    //     newGroupFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
    //     newGroupFlashcardEntity.add(new ParentFacet({ parentId: newResourceId }));
    //     newGroupFlashcardEntity.add(
    //       new QuestionFacet({ question: flashcardEntity.get(QuestionFacet)?.props.question || "" })
    //     );
    //     newGroupFlashcardEntity.add(new AnswerFacet({ answer: flashcardEntity.get(AnswerFacet)?.props.answer || "" }));
    //     newGroupFlashcardEntity.add(DataTypes.GROUP_FLASHCARD);

    //     return newGroupFlashcardEntity;
    //   });

    //   addGroupFlashcards(lsc, newGroupFlashcardEntities, userId, learningGroupId);
    // } else if (selectedNoteTitle) {
    //   const newNoteEntity = new Entity();
    //   newNoteEntity.add(new IdentifierFacet({ guid: newResourceId }));
    //   newNoteEntity.add(new TitleFacet({ title: selectedNoteTitle }));
    //   newNoteEntity.add(new ParentFacet({ parentId: topicId }));
    //   newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    //   newNoteEntity.add(DataTypes.GROUP_NOTE);

    //   addGroupNote(lsc, newNoteEntity, userId, learningGroupId);

    //   const blockEntities = lsc.engine.entities.filter(
    //     (e) => e.has(DataTypes.BLOCK) && e.get(ParentFacet)?.props.parentId == selectedFlashcardSetId
    //   );

    //   const newGroupBlockEntities = blockEntities.map((blockEntity) => {
    //     const newGroupBlockEntity = new Entity();
    //     newGroupBlockEntity.add(new IdentifierFacet({ guid: v4() }));
    //     newGroupBlockEntity.add(new ParentFacet({ parentId: newResourceId }));

    //     return newGroupBlockEntity;
    //   });

    // }
  };

  return (
    <Fragment>
      <SectionRow role="button" onClick={handleClick}>
        <FlexBox>
          {title}
          <StyledMoreButtonWrapper>{isSelected ? <IoChevronUp /> : <IoChevronForward />}</StyledMoreButtonWrapper>
        </FlexBox>
      </SectionRow>
      {isSelected &&
        topics.map((topic, idx) => (
          <SectionRow onClick={() => addResourceToTopic(topic.id)} role="button" key={idx} icon={<IoAdd />}>
            {topic.title}
          </SectionRow>
        ))}
    </Fragment>
  );
};

const useLearningGroups = (isVisible: boolean) => {
  const [learningGroups, setLearningGroups] = useState<{ title: string; id: string }[]>([]);
  const { shouldFetchFromSupabase, mockupData } = useMockupData();

  useEffect(() => {
    const loadGroupSchoolSubjects = async () => {
      const learningGroups = mockupData
        ? dummyLearningGroups
        : shouldFetchFromSupabase
          ? await fetchLearningGroups()
          : [];
      setLearningGroups(learningGroups);
    };

    if (learningGroups.length === 0 && isVisible) {
      loadGroupSchoolSubjects();
    }
  }, [isVisible]);

  return learningGroups;
};

const useLearningGroupSchoolSubjects = (learningGroupId: string, isSelected: boolean) => {
  const [schoolSubjects, setSchoolSubjects] = useState<{ title: string; id: string }[]>([]);
  const { shouldFetchFromSupabase, mockupData } = useMockupData();

  useEffect(() => {
    const loadGroupSchoolSubjects = async () => {
      const schoolSubjects = mockupData
        ? dummyGroupSchoolSubjects
        : shouldFetchFromSupabase
          ? await fetchSchoolSubjectsForLearnigGroup(learningGroupId)
          : [];
      setSchoolSubjects(schoolSubjects);
    };

    if (isSelected && schoolSubjects.length === 0) {
      loadGroupSchoolSubjects();
    }
  }, [learningGroupId, schoolSubjects.length, isSelected]);

  return schoolSubjects;
};

const useSchoolSubjectTopics = (schoolSubjectId: string, isSelected: boolean) => {
  const [topics, setTopics] = useState<{ title: string; id: string }[]>([]);
  const { shouldFetchFromSupabase, mockupData } = useMockupData();

  useEffect(() => {
    const fetchTopics = async () => {
      const topics = mockupData
        ? dummyGroupTopics
        : shouldFetchFromSupabase
          ? await fetchTopicsForGroupSchoolSubject(schoolSubjectId || "")
          : [];
      setTopics(topics);
    };

    if (isSelected && topics.length === 0) {
      fetchTopics();
    }
  }, [isSelected, schoolSubjectId, topics.length]);

  return topics;
};
