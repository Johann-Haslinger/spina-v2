import styled from "@emotion/styled/macro";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import {
  FloatOrderFacet,
  IdentifierFacet,
  ImageFacet,
  ParentFacet,
  TextFacet,
} from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Fragment, useContext, useEffect, useState } from "react";
import { IoAdd, IoChevronForward, IoChevronUp } from "react-icons/io5";
import tw from "twin.macro";
import { v4 } from "uuid";
import {
  AnswerFacet,
  BlocktypeFacet,
  QuestionFacet,
  TitleFacet,
} from "../../../app/additionalFacets";
import { dummyTopics } from "../../../base/dummy";
import {
  Blocktypes,
  DataTypes,
  Stories,
  SupabaseColumns,
  SupabaseTables,
} from "../../../base/enums";
import {
  FlexBox,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
} from "../../../components";
import { addBlocks } from "../../../functions/addBlocks";
import { addFlashcardSet } from "../../../functions/addFlashcardSet";
import { addFlashcards } from "../../../functions/addFlashcards";
import { addNote } from "../../../functions/addNote";
import { addSubtopic } from "../../../functions/addSubtopic";
import { useCurrentDataSource } from "../../../hooks/useCurrentDataSource";
import { useSchoolSubjectEntities } from "../../../hooks/useSchoolSubjects";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { useUserData } from "../../../hooks/useUserData";
import supabaseClient from "../../../lib/supabase";
import {
  displayAlertTexts,
  displayButtonTexts,
} from "../../../utils/displayText";
import { useSelectedGroupFlashcardSet } from "../hooks/useSelectedGroupFlashcardSet";
import { useSelectedGroupNote } from "../hooks/useSelectedGroupNote";
import { useSelectedGroupSubtopic } from "../hooks/useSelectedGroupSubtopic";

const StyledMoreButtonWrapper = styled.div`
  ${tw`text-seconderyText text-opacity-50`}
`;

const fetchTopicsForSchoolSubject = async (subjectId: string) => {
  const { data: topics, error } = await supabaseClient
    .from(SupabaseTables.TOPICS)
    .select("title, id")
    .eq(SupabaseColumns.PARENT_ID, subjectId);

  if (error) {
    console.error("Error fetching topics:", error);
    return [];
  }

  return topics || [];
};

const CloningResourceFromGroupSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisble = useIsStoryCurrent(Stories.CLONING_RESOURCE_FROM_GROUP_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const {
    selectedGroupFlashcardSetEntity,
    selectedGroupFlashcardSetId,
    selectedGroupFlashcardSetTitle,
  } = useSelectedGroupFlashcardSet();
  const { selectedGroupNoteEntity, selectedGroupNoteTitle } =
    useSelectedGroupNote();
  const { selectedGroupSubtopicEntity, selectedGroupSubtopicTitle } =
    useSelectedGroupSubtopic();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] =
    useState<string>();
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { userId } = useUserData();

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_GROUP_TOPIC_STORY);

  const cloneResource = async (topicId: string) => {
    navigateBack();

    const newResourceId = v4();

    if (selectedGroupFlashcardSetEntity) {
      const newFlashcardSetEntity = new Entity();
      newFlashcardSetEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newFlashcardSetEntity.add(new ParentFacet({ parentId: topicId }));
      newFlashcardSetEntity.add(
        new TitleFacet({ title: selectedGroupFlashcardSetTitle || "" }),
      );
      newFlashcardSetEntity.add(DataTypes.FLASHCARD_SET);

      addFlashcardSet(lsc, newFlashcardSetEntity, userId);

      const groupFlashcardEntities = lsc.engine.entities.filter(
        (e) =>
          e.has(DataTypes.GROUP_FLASHCARD) &&
          e.get(ParentFacet)?.props.parentId === selectedGroupFlashcardSetId,
      );

      const newFlashcardEntities = groupFlashcardEntities.map(
        (groupFlashcardEntity) => {
          const newFlashcardEntity = new Entity();
          newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
          newFlashcardEntity.add(new ParentFacet({ parentId: newResourceId }));
          newFlashcardEntity.add(
            new QuestionFacet({
              question:
                groupFlashcardEntity.get(QuestionFacet)?.props.question || "",
            }),
          );
          newFlashcardEntity.add(
            new AnswerFacet({
              answer: groupFlashcardEntity.get(AnswerFacet)?.props.answer || "",
            }),
          );
          newFlashcardEntity.add(DataTypes.FLASHCARD);

          return newFlashcardEntity;
        },
      );

      addFlashcards(lsc, newFlashcardEntities, userId);
    } else if (selectedGroupNoteEntity) {
      const newNoteEntity = new Entity();
      newNoteEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newNoteEntity.add(
        new TitleFacet({ title: selectedGroupNoteTitle || "" }),
      );
      newNoteEntity.add(new ParentFacet({ parentId: topicId }));
      newNoteEntity.add(DataTypes.GROUP_NOTE);

      addNote(lsc, newNoteEntity, userId);

      const blockEntities = lsc.engine.entities.filter(
        (e) =>
          e.has(DataTypes.GROUP_BLOCK) &&
          e.get(ParentFacet)?.props.parentId ===
            selectedGroupNoteEntity.get(IdentifierFacet)?.props.guid,
      );

      const newBlockEntities = blockEntities.map((blockEntity) => {
        const newBlockEntity = new Entity();
        newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
        newBlockEntity.add(new ParentFacet({ parentId: newResourceId }));
        newBlockEntity.add(
          new TextFacet({ text: blockEntity.get(TextFacet)?.props.text || "" }),
        );
        newBlockEntity.add(
          new BlocktypeFacet({
            blocktype:
              blockEntity.get(BlocktypeFacet)?.props.blocktype ||
              Blocktypes.TEXT,
          }),
        );
        newBlockEntity.add(
          new ImageFacet({
            imageSrc: blockEntity.get(ImageFacet)?.props.imageSrc || "",
          }),
        );
        newBlockEntity.add(
          new FloatOrderFacet({
            index: blockEntity.get(FloatOrderFacet)?.props.index || 0,
          }),
        );
        newBlockEntity.add(DataTypes.BLOCK);

        return newBlockEntity;
      });

      addBlocks(lsc, newBlockEntities, userId);
    } else if (selectedGroupSubtopicEntity) {
      const newSubtopicEntity = new Entity();
      newSubtopicEntity.add(new IdentifierFacet({ guid: newResourceId }));
      newSubtopicEntity.add(new ParentFacet({ parentId: topicId }));
      newSubtopicEntity.add(
        new TitleFacet({ title: selectedGroupSubtopicTitle || "" }),
      );
      newSubtopicEntity.add(DataTypes.GROUP_SUBTOPIC);

      addSubtopic(lsc, newSubtopicEntity, userId);

      const blockEntities = lsc.engine.entities.filter(
        (e) =>
          e.has(DataTypes.GROUP_BLOCK) &&
          e.get(ParentFacet)?.props.parentId ===
            selectedGroupSubtopicEntity.get(IdentifierFacet)?.props.guid,
      );

      const newBlockEntities = blockEntities.map((blockEntity) => {
        const newBlockEntity = new Entity();
        lsc.engine.addEntity(newBlockEntity);
        newBlockEntity.add(new IdentifierFacet({ guid: v4() }));
        newBlockEntity.add(new ParentFacet({ parentId: newResourceId }));
        newBlockEntity.add(
          new TextFacet({ text: blockEntity.get(TextFacet)?.props.text || "" }),
        );
        newBlockEntity.add(
          new BlocktypeFacet({
            blocktype:
              blockEntity.get(BlocktypeFacet)?.props.blocktype ||
              Blocktypes.TEXT,
          }),
        );
        newBlockEntity.add(
          new ImageFacet({
            imageSrc: blockEntity.get(ImageFacet)?.props.imageSrc || "",
          }),
        );
        newBlockEntity.add(
          new FloatOrderFacet({
            index: blockEntity.get(FloatOrderFacet)?.props.index || 0,
          }),
        );
        newBlockEntity.add(DataTypes.BLOCK);

        return newBlockEntity;
      });

      addBlocks(lsc, newBlockEntities, userId);

      const flashcardEntities = lsc.engine.entities.filter(
        (e) =>
          e.has(DataTypes.GROUP_FLASHCARD) &&
          e.get(ParentFacet)?.props.parentId ===
            selectedGroupSubtopicEntity.get(IdentifierFacet)?.props.guid,
      );

      const newFlashcardEntities = flashcardEntities.map((flashcardEntity) => {
        const newFlashcardEntity = new Entity();
        lsc.engine.addEntity(newFlashcardEntity);
        newFlashcardEntity.add(new IdentifierFacet({ guid: v4() }));
        newFlashcardEntity.add(new ParentFacet({ parentId: newResourceId }));
        newFlashcardEntity.add(
          new QuestionFacet({
            question: flashcardEntity.get(QuestionFacet)?.props.question || "",
          }),
        );
        newFlashcardEntity.add(
          new AnswerFacet({
            answer: flashcardEntity.get(AnswerFacet)?.props.answer || "",
          }),
        );
        newFlashcardEntity.add(DataTypes.GROUP_FLASHCARD);

        return newFlashcardEntity;
      });

      addFlashcards(lsc, newFlashcardEntities, userId);
    }

    lsc.stories.transitTo(Stories.SUCCESS_STORY);
  };

  return (
    <Sheet visible={isVisble} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>
          {displayButtonTexts(selectedLanguage).back}
        </SecondaryButton>
      </FlexBox>
      <Spacer />
      <Section>
        {isVisble &&
          schoolSubjectEntities.map((schoolSubjectEntity, idx) => (
            <SchoolSubjectRow
              key={idx}
              cloneResource={cloneResource}
              idx={idx}
              schoolSubjectEntity={schoolSubjectEntity}
              selectSchoolSubject={setSelectedSchoolSubjectId}
              selectedSchoolSubjectId={selectedSchoolSubjectId || ""}
            />
          ))}
      </Section>
    </Sheet>
  );
};

export default CloningResourceFromGroupSheet;

const SchoolSubjectRow = (props: {
  idx: number;
  schoolSubjectEntity: Entity;
  selectSchoolSubject: (id: string | undefined) => void;
  selectedSchoolSubjectId: string;
  cloneResource: (topicId: string) => void;
}) => {
  const {
    idx,
    schoolSubjectEntity,
    selectSchoolSubject,
    selectedSchoolSubjectId,
    cloneResource,
  } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const schoolSubjectId =
    schoolSubjectEntity.get(IdentifierFacet)?.props.guid || "";
  const schoolSubjectTitle =
    schoolSubjectEntity.get(TitleFacet)?.props.title ||
    displayAlertTexts(selectedLanguage).noTitle;
  const isSelected = selectedSchoolSubjectId === schoolSubjectId;
  const topics = useSchoolSubjectTopics(
    schoolSubjectId,
    selectedSchoolSubjectId,
  );
  const schoolSubjectEntities = useSchoolSubjectEntities();

  const handleClick = () =>
    !isSelected
      ? selectSchoolSubject(schoolSubjectId)
      : selectSchoolSubject(undefined);

  return (
    <Fragment>
      <SectionRow
        role="button"
        last={schoolSubjectEntities.length - 1 === idx}
        onClick={handleClick}
      >
        <FlexBox>
          {schoolSubjectTitle}
          <StyledMoreButtonWrapper>
            {isSelected ? <IoChevronUp /> : <IoChevronForward />}
          </StyledMoreButtonWrapper>
        </FlexBox>
      </SectionRow>
      {isSelected &&
        topics.map((topic, idx) => (
          <SectionRow
            onClick={() => cloneResource(topic.id)}
            role="button"
            key={idx}
            icon={<IoAdd />}
          >
            {topic.title}
          </SectionRow>
        ))}
    </Fragment>
  );
};

const useSchoolSubjectTopics = (
  schoolSubjectId: string,
  selectedSchoolSubjectId?: string,
) => {
  const [topics, setTopics] = useState<{ title: string; id: string }[]>([]);
  const {
    isUsingSupabaseData: shouldFetchFromSupabase,
    isUsingMockupData: mockupData,
  } = useCurrentDataSource();

  useEffect(() => {
    const fetchTopics = async () => {
      const topics = mockupData
        ? dummyTopics
        : shouldFetchFromSupabase
          ? await fetchTopicsForSchoolSubject(selectedSchoolSubjectId || "")
          : [];
      setTopics(topics);
    };

    if (selectedSchoolSubjectId === schoolSubjectId && topics.length === 0) {
      fetchTopics();
    }
  }, [selectedSchoolSubjectId, schoolSubjectId, topics]);

  return topics;
};
