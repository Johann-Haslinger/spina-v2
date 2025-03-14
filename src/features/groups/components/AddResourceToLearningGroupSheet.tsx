import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext, useEffect, useState } from 'react';
import { IoAdd, IoChevronForward, IoChevronUp } from 'react-icons/io5';
import tw from 'twin.macro';
import { v4 } from 'uuid';
import { useCurrentDataSource } from '../../../common/hooks/useCurrentDataSource';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../common/hooks/useUserData';
import { AnswerFacet, DateAddedFacet, QuestionFacet, TitleFacet } from '../../../common/types/additionalFacets';
import { dummyGroupSchoolSubjects, dummyGroupTopics, dummyLearningGroups } from '../../../common/types/dummy';
import { DataType, Story, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { addGroupFlashcards } from '../../../common/utilities/addGroupFlashcards';
import { displayAlertTexts } from '../../../common/utilities/displayText';
import { CloseButton, FlexBox, ScrollableBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import supabaseClient from '../../../lib/supabase';
import { useSelectedFlashcardSet } from '../../collection/hooks/useSelectedFlashcardSet';
import { useSelectedNote } from '../../collection/hooks/useSelectedNote';
import { useSelectedSubtopic } from '../../collection/hooks/useSelectedSubtopic';

const StyledMoreButtonWrapper = styled.div`
  ${tw`text-secondary-text text-opacity-50`}
`;

const fetchLearningGroups = async () => {
  const { data: learningGroups, error } = await supabaseClient.from(SupabaseTable.LEARNING_GROUPS).select('title, id');

  if (error) {
    console.error('Error fetching learningGroups:', error);
    return [];
  }

  return learningGroups || [];
};

const fetchSchoolSubjectsForLearnigGroup = async (learningGroupId: string) => {
  const { data: schoolSubjects, error } = await supabaseClient
    .from(SupabaseTable.GROUP_SCHOOL_SUBJECTS)
    .select('title, id')
    .eq('group_id', learningGroupId);

  if (error) {
    console.error('Error fetching group school subjects:', error);
    return [];
  }

  return schoolSubjects || [];
};

const fetchTopicsForGroupSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from(SupabaseTable.GROUP_TOPICS)
    .select('title, id')
    .eq(SupabaseColumn.PARENT_ID, subjectId);

  if (error) {
    console.error('Error fetching group topics:', error);
    return [];
  }

  return topics || [];
};

const AddResourceToLearningGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const learningGroups = useLearningGroups(isVisible);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

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
  const { selectedNoteTitle, selectedNoteText } = useSelectedNote();
  const { selectedSubtopicTitle, selectedSubtopicId, selectedSubtopicText } = useSelectedSubtopic();

  const handleClick = () => setIsSelected(!isSelected);

  const addResourceToTopic = (topicId: string) => {
    lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

    const newResourceId = v4();

    if (selectedFlashcardSetTitle) {
      // TODO: Implement addGroupFlashcardSet

      const newGroupFlashcardSetEntity = new Entity();
      newGroupFlashcardSetEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newGroupFlashcardSetEntity.add(new TitleFacet({ title: selectedFlashcardSetTitle }));
      newGroupFlashcardSetEntity.add(new ParentFacet({ parentId: topicId }));
      newGroupFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newGroupFlashcardSetEntity.add(DataType.GROUP_FLASHCARD_SET);

      // addGroupFlashcardSet(lsc, newGroupFlashcardSetEntity, userId, learningGroupId);

      const flashcardEntites = lsc.engine.entities.filter(
        (e) => e.has(DataType.FLASHCARD) && e.get(ParentFacet)?.props.parentId == selectedFlashcardSetId,
      );

      const newGroupFlashcardEntities = flashcardEntites.map((flashcardEntity) => {
        const newGroupFlashcardEntity = new Entity();
        newGroupFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
        newGroupFlashcardEntity.add(new ParentFacet({ parentId: newResourceId }));
        newGroupFlashcardEntity.add(
          new QuestionFacet({
            question: flashcardEntity.get(QuestionFacet)?.props.question || '',
          }),
        );
        newGroupFlashcardEntity.add(
          new AnswerFacet({
            answer: flashcardEntity.get(AnswerFacet)?.props.answer || '',
          }),
        );
        newGroupFlashcardEntity.add(DataType.GROUP_FLASHCARD);

        return newGroupFlashcardEntity;
      });

      addGroupFlashcards(lsc, newGroupFlashcardEntities, userId, learningGroupId);
    } else if (selectedNoteTitle) {
      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newNoteEntity.add(new TitleFacet({ title: selectedNoteTitle }));
      newNoteEntity.add(new ParentFacet({ parentId: topicId }));
      newNoteEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newNoteEntity.add(DataType.GROUP_NOTE);
      newNoteEntity.add(new TextFacet({ text: selectedNoteText || '' }));
    } else if (selectedSubtopicTitle) {
      const newSubtopicEntity = new Entity();
      newSubtopicEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newSubtopicEntity.add(new TitleFacet({ title: selectedSubtopicTitle }));
      newSubtopicEntity.add(new ParentFacet({ parentId: topicId }));
      newSubtopicEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
      newSubtopicEntity.add(DataType.GROUP_SUBTOPIC);
      newSubtopicEntity.add(new TextFacet({ text: selectedSubtopicText || '' }));

      const flashcardEntites = lsc.engine.entities.filter(
        (e) => e.has(DataType.FLASHCARD) && e.get(ParentFacet)?.props.parentId == selectedSubtopicId,
      );

      const newGroupFlashcardEntities = flashcardEntites.map((flashcardEntity) => {
        const newGroupFlashcardEntity = new Entity();
        newGroupFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
        newGroupFlashcardEntity.add(new ParentFacet({ parentId: newResourceId }));
        newGroupFlashcardEntity.add(
          new QuestionFacet({
            question: flashcardEntity.get(QuestionFacet)?.props.question || '',
          }),
        );
        newGroupFlashcardEntity.add(
          new AnswerFacet({
            answer: flashcardEntity.get(AnswerFacet)?.props.answer || '',
          }),
        );
        newGroupFlashcardEntity.add(DataType.GROUP_FLASHCARD);

        return newGroupFlashcardEntity;
      });

      addGroupFlashcards(lsc, newGroupFlashcardEntities, userId, learningGroupId);
    }

    lsc.stories.transitTo(Story.SUCCESS_STORY);
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
  const { isUsingSupabaseData: shouldFetchFromSupabase, isUsingMockupData: mockupData } = useCurrentDataSource();

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
  const { isUsingSupabaseData: shouldFetchFromSupabase, isUsingMockupData: mockupData } = useCurrentDataSource();

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
  const { isUsingSupabaseData: shouldFetchFromSupabase, isUsingMockupData: mockupData } = useCurrentDataSource();

  useEffect(() => {
    const fetchTopics = async () => {
      const topics = mockupData
        ? dummyGroupTopics
        : shouldFetchFromSupabase
          ? await fetchTopicsForGroupSchoolSubject(schoolSubjectId || '')
          : [];
      setTopics(topics);
    };

    if (isSelected && topics.length === 0) {
      fetchTopics();
    }
  }, [isSelected, schoolSubjectId, topics.length]);

  return topics;
};
