import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, OrderFacet, ParentFacet } from '@leanscope/ecs-models';
import { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useUserData } from '../../../common/hooks/useUserData';
import {
  AnswerFacet,
  DateAddedFacet,
  LearningUnitTypeFacet,
  PriorityFacet,
  QuestionFacet,
  TitleFacet,
} from '../../../common/types/additionalFacets';
import {
  DataType,
  LearningUnitPriority,
  LearningUnitType,
  SupabaseEdgeFunction,
  SupabaseTable,
} from '../../../common/types/enums';
import { GeneratedFlashcardSetResource } from '../../../common/types/types';
import { addFlashcards } from '../../../common/utilities/addFlashcards';
import { addLearningUnit } from '../../../common/utilities/addLeaningUnit';
import { addTopic } from '../../../common/utilities/addTopic';
import { View } from '../../../components';
import supabaseClient from '../../../lib/supabase';
import { generateDescriptionForTopic } from '../../collection/functions/generateDescriptionForTopic';
import { generateLearningUnitFromFile } from '../../collection/functions/generateLearningUnitFromFile';
import { ParentDetails, TutorialState } from '../types';
import {
  AddingSchoolSubjectsSection,
  ExplainingFlashcardBenefitsSection,
  FlashcardReviewSection,
  GeneratedFlashcardsSection,
  GeneratingFlashcardsSection,
  SavingFlashcardsSection,
  SelectingImageSection,
  TutorialIntroductionSection,
} from './tutorial-sections';

const delay = (ms: number): Promise<void> => new Promise<void>((res) => setTimeout(res, ms));

const TutorialView = (props: { tutorialState: TutorialState; setTutorialState: (newValue: TutorialState) => void }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { tutorialState, setTutorialState } = props;
  const { userId } = useUserData();
  const [schoolSubjects, setSchoolSubjects] = useState<string[]>([]);
  const [generatedFlashcardSet, setGeneratedFlashcardSet] = useState<GeneratedFlashcardSetResource | null>(null);
  const [flashcardSetParentDetails, setFlashcardSetParentDetails] = useState<ParentDetails | null>(null);
  const isViewDisplayed = [
    TutorialState.INTRODUCTION,
    TutorialState.SELECTING_IMAGE,
    TutorialState.GENERATING_FLASHCARDS,
    TutorialState.DISPLAYING_FLASHCARDS,
    TutorialState.SAVING_FLASHCARDS,
    TutorialState.ADDING_SCHOOL_SUBJECTS,
    TutorialState.REVIEWING_FLASHCARDS,
    TutorialState.EXPLAINING_FLASHCARD_BENEFITS,
  ].includes(tutorialState);

  const handleImageSelection = async (image: File) => {
    const newFlashcardSet = await generateLearningUnitFromFile(lsc, image, userId, 'flashcardSet');

    if (newFlashcardSet?.title == 'Kein Inhalt erkannt' || newFlashcardSet?.flashcards.length == 0) {
      setTutorialState(TutorialState.SELECTING_IMAGE);
      return;
    }

    if (!newFlashcardSet) {
      setTutorialState(TutorialState.SELECTING_IMAGE);
      return;
    }
    setTimeout(() => {
      setGeneratedFlashcardSet({ ...newFlashcardSet, id: uuid() });
      setTimeout(() => {
        setTutorialState(TutorialState.DISPLAYING_FLASHCARDS);
      }, 100);
    }, 0);
  };

  useEffect(() => {
    const generateParentDetailsFromContent = async () => {
      if (!generatedFlashcardSet || flashcardSetParentDetails) return;

      const flashcardSetContent =
        generatedFlashcardSet.title +
        ': ' +
        generatedFlashcardSet.flashcards.map((flashcard) => flashcard.question + ' = ' + flashcard.answer).join(' ');
      const parentDetails = await generateParentDetails(flashcardSetContent);

      setFlashcardSetParentDetails(parentDetails);
      setSchoolSubjects([parentDetails.schoolSubjectTitle]);
    };

    generateParentDetailsFromContent();
  }, [generatedFlashcardSet]);

  const handleSaveUserData = () =>
    saveUserData(
      lsc,
      generatedFlashcardSet as GeneratedFlashcardSetResource,
      flashcardSetParentDetails as ParentDetails,
      schoolSubjects,
      userId,
    );

  return (
    <View visible={isViewDisplayed}>
      <TutorialIntroductionSection
        isVisible={tutorialState == TutorialState.INTRODUCTION}
        setTutorialState={setTutorialState}
      />
      <SelectingImageSection
        handleImageSelection={handleImageSelection}
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
      />
      <GeneratingFlashcardsSection
        isGeneratingDone={generatedFlashcardSet !== null}
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
      />
      <GeneratedFlashcardsSection
        flashcardSet={generatedFlashcardSet}
        setFlashcardSet={setGeneratedFlashcardSet}
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
      />
      <SavingFlashcardsSection
        flashcardSet={generatedFlashcardSet}
        setFlashcardSet={setGeneratedFlashcardSet}
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
        parentDetails={flashcardSetParentDetails}
        setParentDetails={setFlashcardSetParentDetails}
      />
      <AddingSchoolSubjectsSection
        schoolSubjects={schoolSubjects}
        setSchoolSubjects={setSchoolSubjects}
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
        handleSaveUserData={handleSaveUserData}
      />
      <FlashcardReviewSection
        tutorialState={tutorialState}
        setTutorialState={setTutorialState}
        flashcardSet={generatedFlashcardSet}
      />
      <ExplainingFlashcardBenefitsSection tutorialState={tutorialState} setTutorialState={setTutorialState} />
    </View>
  );
};

export default TutorialView;

const saveUserData = async (
  lsc: ILeanScopeClient,
  flashcardSet: GeneratedFlashcardSetResource,
  flashcardSetParentDetails: ParentDetails,
  schoolSubjects: string[],
  userId: string,
) => {
  const schoolSubjectEntities = schoolSubjects.map((schoolSubject, idx) => {
    const id = uuid();
    const newSchoolSubjectEntity = new Entity();
    lsc.engine.addEntity(newSchoolSubjectEntity);
    newSchoolSubjectEntity.add(new TitleFacet({ title: schoolSubject }));
    newSchoolSubjectEntity.add(new IdentifierFacet({ guid: id }));
    newSchoolSubjectEntity.add(new OrderFacet({ orderIndex: idx }));

    newSchoolSubjectEntity.add(DataType.SCHOOL_SUBJECT);

    return newSchoolSubjectEntity;
  });

  const { error: insertSchoolSubjectsError } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).insert(
    schoolSubjectEntities.map((schoolSubjectEntity) => {
      return {
        title: schoolSubjectEntity.get(TitleFacet)?.props.title,
        user_id: userId,
        id: schoolSubjectEntity.get(IdentifierFacet)?.props.guid,
      };
    }),
  );

  if (insertSchoolSubjectsError) {
    console.error('Error adding school subjects:', insertSchoolSubjectsError.message);
    return;
  }

  const topicId = uuid();
  const topicParentId =
    schoolSubjectEntities
      .find((entity) => entity.get(TitleFacet)?.props.title === flashcardSetParentDetails.schoolSubjectTitle)
      ?.get(IdentifierFacet)?.props.guid || '';

  const newTopicEntity = new Entity();
  lsc.engine.addEntity(newTopicEntity);
  newTopicEntity.add(new TitleFacet({ title: flashcardSetParentDetails.topicTitle }));
  newTopicEntity.add(new IdentifierFacet({ guid: topicId }));
  newTopicEntity.add(new ParentFacet({ parentId: topicParentId }));
  newTopicEntity.add(DataType.TOPIC);

  addTopic(lsc, newTopicEntity, userId);

  await delay(100);

  const flashcardSetId = flashcardSet.id || '';

  const flashcardSetEntity = new Entity();
  flashcardSetEntity.add(new TitleFacet({ title: flashcardSet.title }));
  flashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
  flashcardSetEntity.add(new ParentFacet({ parentId: topicId }));
  flashcardSetEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.FLASHCARD_SET }));
  flashcardSetEntity.add(new PriorityFacet({ priority: LearningUnitPriority.ACTIVE }));
  flashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
  flashcardSetEntity.add(DataType.LEARNING_UNIT);

  addLearningUnit(lsc, flashcardSetEntity, userId);

  await delay(100);

  const flashcardEntities = flashcardSet.flashcards.map((flashcard) => {
    const flashcardEntity = new Entity();
    flashcardEntity.add(new IdentifierFacet({ guid: uuid() }));
    flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
    flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
    flashcardEntity.add(new ParentFacet({ parentId: flashcardSetId }));
    flashcardEntity.add(DataType.FLASHCARD);

    return flashcardEntity;
  });

  addFlashcards(lsc, flashcardEntities, userId);

  generateDescriptionForTopic(lsc, newTopicEntity);
};

const generateParentDetails = async (content: string) => {
  const session = await supabaseClient.auth.getSession();

  const { data, error } = await supabaseClient.functions.invoke(
    SupabaseEdgeFunction.GENERATE_LEARNING_UNIT_PARENT_DETAILS,
    {
      headers: {
        Authorization: `Bearer ${session.data.session?.access_token}`,
      },
      body: { learningUnitContent: content },
    },
  );

  if (error) {
    console.error('Error generating parent details:', error.message);
    return null;
  }

  const parentDetails = JSON.parse(data);

  return parentDetails;
};
