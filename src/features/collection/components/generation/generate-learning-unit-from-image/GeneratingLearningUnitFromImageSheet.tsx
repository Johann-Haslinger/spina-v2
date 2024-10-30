import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { useIsAnyStoryCurrent, useIsStoryCurrent } from '@leanscope/storyboarding';
import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoChevronForward, IoChevronUp } from 'react-icons/io5';
import tw from 'twin.macro';
import { BackgroundOverlay } from '../../../../../common/components/others';
import { useOutsideClick } from '../../../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../../../common/hooks/useSchoolSubjects';
import { useUserData } from '../../../../../common/hooks/useUserData';
import { useWindowDimensions } from '../../../../../common/hooks/useWindowDimensions';
import { FileFacet, TitleFacet } from '../../../../../common/types/additionalFacets';
import { AdditionalTag, Story, SupabaseTable } from '../../../../../common/types/enums';
import { GeneratedFlashcardSetResource, GeneratedNoteResource } from '../../../../../common/types/types';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../../../components';
import supabaseClient from '../../../../../lib/supabase';
import { generateLearningUnitFromFile } from '../../../functions/generateLearningUnitFromFile';
import GeneratedFlashcardSet from './GeneratedFlashcardSet';
import GeneratedNote from './GeneratedNote';
import GenerateOptions from './GenerateOptions';
import GeneratingIndicator from './GeneratingIndicator';

enum View {
  CHOOSE_LEARNING_UNIT_TYPE,
  GENERATING,
  NOTE,
  CARDS,
  DONE,
}

const StyledSheet = styled(motion.div)`
  ${tw`bg-white dark:text-white  dark:bg-secondary-dark overflow-hidden z-[200] dark:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] rounded-2xl p-2 fixed`}
`;

const GeneratingLearningUnitFromImageSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const { currentView, setCurrentView } = useCurrentView();
  const sheetRef = useRef<HTMLDivElement>(null);
  const isSheetLarge = currentView === View.NOTE || currentView === View.CARDS;
  const { isMobile } = useWindowDimensions();
  const isChoosingLearningUnitType = currentView === View.CHOOSE_LEARNING_UNIT_TYPE;
  const { generatedFlashcardSet, setGeneratedFlashcardSet } = useGeneratedFlashcards();
  const { generatedNote, setGeneratedNote } = useGeneratedNote();
  const [uploadedFileEntities] = useEntities((e) => e.has(AdditionalTag.UPLOADED_FILE));
  const uploadedFile = uploadedFileEntities[0]?.get(FileFacet)?.props.file;
  const { userId } = useUserData();
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const navigateBack = () => lsc.stories.transitTo(Story.ANY);

  useOutsideClick(sheetRef, navigateBack, isVisible);

  const handleGenerateNoteButtonClick = async () => {
    if (!uploadedFile) return;

    setGeneratedNote(null);
    setCurrentView(View.GENERATING);

    const generatedNote = await generateLearningUnitFromFile(lsc, uploadedFile, userId, 'note');
    setGeneratedNote(generatedNote);
    setCurrentView(View.NOTE);
  };

  const handleGenerateCardsButtonClick = async () => {
    if (!uploadedFile) return;

    setGeneratedFlashcardSet(null);
    setCurrentView(View.GENERATING);

    const generatedFlashcards = await generateLearningUnitFromFile(lsc, uploadedFile, userId, 'flashcardSet');
    setGeneratedFlashcardSet(generatedFlashcards);
    setCurrentView(View.CARDS);
  };

  const normalSheetHeight = isMobile ? '40%' : '30%';
  const largeSheetHeight = isMobile ? '80%' : '90%';
  const sheetHeight = isSheetLarge ? largeSheetHeight : normalSheetHeight;

  const normalSheetWidth = isMobile ? '90%' : '40%';
  const largeSheetWidth = isMobile ? '90%' : '60%';
  const sheetWidth = isSheetLarge ? largeSheetWidth : normalSheetWidth;

  const normalTop = isMobile ? '10%' : '30%';
  const largeTop = isMobile ? '10%' : '5%';
  const sheetTop = isSheetLarge ? largeTop : normalTop;

  const normalLeft = isMobile ? '5%' : '30%';
  const largeLeft = isMobile ? '5%' : '20%';
  const sheetLeft = isSheetLarge ? largeLeft : normalLeft;

  return (
    <div>
      <BackgroundOverlay isVisible={isVisible} />
      <StyledSheet
        ref={sheetRef}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0,
          display: isVisible ? 'block' : 'none',
          height: sheetHeight,
          width: sheetWidth,
          top: sheetTop,
          left: sheetLeft,
        }}
        initial={{ opacity: 0, scale: 0, display: 'none' }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        <GenerateOptions
          onGenerateNote={handleGenerateNoteButtonClick}
          onGenerateCards={handleGenerateCardsButtonClick}
          isVisible={isChoosingLearningUnitType}
        />
        <GeneratingIndicator isVisible={currentView === View.GENERATING} />
        {generatedFlashcardSet && (
          <GeneratedFlashcardSet
            selectedParentId={selectedParentId}
            regenerateFlashcards={handleGenerateCardsButtonClick}
            generatedFlashcardSet={generatedFlashcardSet}
            isVisible={currentView === View.CARDS}
          />
        )}
        {generatedNote && (
          <GeneratedNote
            selectedParentId={selectedParentId}
            note={generatedNote}
            isVisible={currentView === View.NOTE}
            regenerateNote={handleGenerateNoteButtonClick}
          />
        )}
      </StyledSheet>

      <SelectParentSheet onParentSelect={(parentId) => setSelectedParentId(parentId)} />
    </div>
  );
};

export default GeneratingLearningUnitFromImageSheet;

const useCurrentView = () => {
  const isVisible = useIsAnyStoryCurrent([Story.GENERATING_RESOURCES_FROM_IMAGE, Story.SELECTING_PARENT_STORY]);
  const [currentView, setCurrentView] = useState<View>(View.CHOOSE_LEARNING_UNIT_TYPE);

  useEffect(() => {
    if (isVisible) {
      setCurrentView(View.CHOOSE_LEARNING_UNIT_TYPE);
    }
  }, [isVisible]);

  return { currentView, setCurrentView };
};

const useGeneratedFlashcards = () => {
  const [generatedFlashcardSet, setGeneratedFlashcardSet] = useState<GeneratedFlashcardSetResource | null>(null);
  const isVisible = useIsAnyStoryCurrent([Story.GENERATING_RESOURCES_FROM_IMAGE, Story.SELECTING_PARENT_STORY]);

  useEffect(() => {
    setGeneratedFlashcardSet(null);
  }, [isVisible]);

  return { generatedFlashcardSet, setGeneratedFlashcardSet };
};

const useGeneratedNote = () => {
  const [generatedNote, setGeneratedNote] = useState<GeneratedNoteResource | null>(null);
  const isVisible = useIsAnyStoryCurrent([Story.GENERATING_RESOURCES_FROM_IMAGE, Story.SELECTING_PARENT_STORY]);

  useEffect(() => {
    setGeneratedNote(null);
  }, [isVisible]);

  return { generatedNote, setGeneratedNote };
};

const SelectParentSheet = (props: { onParentSelect: (parentId: string) => void }) => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.SELECTING_PARENT_STORY);
  const schoolSubjectEntities = useSchoolSubjectEntities();

  const navigateBack = () => lsc.stories.transitTo(Story.GENERATING_RESOURCES_FROM_IMAGE);

  const handleParentSelect = (parentId: string) => {
    props.onParentSelect(parentId);
    navigateBack();
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <Section>
        {schoolSubjectEntities.map((schoolSubjectEntity, idx) => (
          <SchoolSubjectCell
            onTopicSelect={handleParentSelect}
            entity={schoolSubjectEntity}
            key={schoolSubjectEntity.id}
            isLast={idx === schoolSubjectEntities.length - 1}
          />
        ))}
      </Section>
    </Sheet>
  );
};
interface SchoolSubjectCellProps extends EntityProps {
  onTopicSelect: (topicId: string) => void;
  isLast: boolean;
}

const useTopics = (schoolSubjectId: string, isSchoolSubjectSelected: boolean) => {
  const [topics, setTopics] = useState<{ title: string; id: string }[]>([]);

  useEffect(() => {
    const fetchTopicsForSchoolSubject = async () => {
      if (!isSchoolSubjectSelected) return;

      const { data: topics, error } = await supabaseClient
        .from(SupabaseTable.TOPICS)
        .select('title, id')
        .eq('parent_id', schoolSubjectId)
        .eq('is_archived', false);

      if (error) {
        console.error('Error fetching topics:', error);
        return;
      }

      setTopics(topics);
    };

    fetchTopicsForSchoolSubject();
  }, [schoolSubjectId, isSchoolSubjectSelected]);

  return topics;
};

const SchoolSubjectCell = (props: SchoolSubjectCellProps) => {
  const { entity, isLast } = props;
  const [isSelected, setIsSelected] = useState(false);
  const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid || '';
  const schoolSubjectName = entity.get(TitleFacet)?.props.title || '';
  const topics = useTopics(schoolSubjectId, isSelected);

  return (
    <div>
      <SectionRow onClick={() => setIsSelected(!isSelected)} last={isLast && !isSelected} role="button">
        <FlexBox>
          <p>{schoolSubjectName}</p>
          <div tw="text-secondary-text">{!isSelected ? <IoChevronForward /> : <IoChevronUp />}</div>
        </FlexBox>
      </SectionRow>
      {isSelected &&
        topics.map((topic) => (
          <SectionRow role="button" onClick={() => props.onTopicSelect(topic.id)} key={topic.id}>
            <div tw="pl-4">{topic.title}</div>
          </SectionRow>
        ))}
    </div>
  );
};
