import styled from '@emotion/styled';
import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, useEntityComponents } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps } from '@leanscope/ecs-models';
import { useContext, useState } from 'react';
import {
  IoBookmark,
  IoBookmarkOutline,
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import tw from 'twin.macro';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import {
  AnswerFacet,
  AnswerProps,
  DueDateFacet,
  MasteryLevelProps,
  QuestionFacet,
  QuestionProps,
} from '../../../../common/types/additionalFacets';
import { AdditionalTag, SupabaseColumn, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayActionTexts, displayButtonTexts } from '../../../../common/utilities/displayText';
import {
  FlexBox,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  Section,
  SectionRow,
  Sheet,
  Spacer,
  TextAreaInput,
} from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

const StyledMasteryLevelText = styled.div`
  ${tw`lg:pl-10 px-4 dark:text-primary-text-dark`}
`;

const EditFlashcardSheet = (props: QuestionProps & AnswerProps & MasteryLevelProps & EntityProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { question, answer, masteryLevel, entity, guid } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const [questionValue, setQuestionValue] = useState(question);
  const [answerValue, setAnswerValue] = useState(answer);
  const { isBookmarked, toggleBookmark } = useIsBookmarked(entity);
  const { isPaused, togglePause } = useIsPaused(lsc, entity);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);

  const updateFlashcard = async () => {
    navigateBack();

    entity.add(new QuestionFacet({ question: questionValue }));
    entity.add(new AnswerFacet({ answer: answerValue }));

    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .update({
        question: questionValue,
        answer: answerValue,
      })
      .eq(SupabaseColumn.ID, guid);

    if (error) {
      console.error('Error updating flashcard: ', error);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Aktualisieren der Lernkarte',
        message: error.message + ' ' + error.details + ' ' + error.hint,
        type: 'error',
      });
    }
  };

  const deleteFlashcard = async () => {
    navigateBack();

    setTimeout(async () => {
      lsc.engine.removeEntity(entity);

      const { error } = await supabaseClient.from(SupabaseTable.FLASHCARDS).delete().eq(SupabaseColumn.ID, guid);

      if (error) {
        console.error('Error deleting flashcard: ', error);
        addNotificationEntity(lsc, {
          title: 'Fehler beim Löschen der Lernkarte',
          message: error.message + ' ' + error.details + ' ' + error.hint,
          type: 'error',
        });
      }
    }, 300);
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      {questionValue !== question || answerValue !== answer ? (
        <FlexBox>
          <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
          <PrimaryButton onClick={updateFlashcard}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        </FlexBox>
      ) : (
        <FlexBox>
          <div /> <PrimaryButton>{displayButtonTexts(selectedLanguage).done}</PrimaryButton>
        </FlexBox>
      )}

      <Spacer />
      <Section>
        <SectionRow>
          <TextAreaInput value={questionValue} onChange={(e) => setQuestionValue(e.target.value)} />
        </SectionRow>
        <SectionRow last>
          <TextAreaInput value={answerValue} onChange={(e) => setAnswerValue(e.target.value)} />
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow last>
          <FlexBox>
            <ProgressBar width={(masteryLevel / 5) * 100 + 2} />
            <StyledMasteryLevelText>{(masteryLevel / 5) * 100}%</StyledMasteryLevelText>
          </FlexBox>
        </SectionRow>
      </Section>
      <Spacer size={2} />
      <Section>
        <SectionRow
          role="button"
          icon={isPaused ? <IoPlayCircleOutline /> : <IoPauseCircleOutline />}
          onClick={togglePause}
        >
          {isPaused ? 'Karte fortsetzen' : 'Karte pausieren'}
        </SectionRow>
        <SectionRow
          last
          role="button"
          icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
          onClick={toggleBookmark}
        >
          {isBookmarked
            ? displayActionTexts(selectedLanguage).unbookmark
            : displayActionTexts(selectedLanguage).bookmark}
        </SectionRow>
      </Section>
      <Spacer size={2} />

      <Section>
        <SectionRow role="destructive" last icon={<IoTrashOutline />} onClick={deleteFlashcard}>
          {displayButtonTexts(selectedLanguage).delete}
        </SectionRow>
      </Section>
    </Sheet>
  );
};

export default EditFlashcardSheet;

const useIsBookmarked = (entity: Entity) => {
  const lsc = useContext(LeanScopeClientContext);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = async () => {
    const newValue = !isBookmarked;
    const id = entity.get(IdentifierFacet)?.props.guid;

    setIsBookmarked(newValue);

    if (newValue) {
      entity.add(AdditionalTag.BOOKMARKED);
    } else {
      entity.remove(AdditionalTag.BOOKMARKED);
    }

    const { error } = await supabaseClient
      .from(SupabaseTable.FLASHCARDS)
      .update({ is_bookmarked: newValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating bookmark:', error);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Aktualisieren des Lesezeichens',
        message: error.message,
        type: 'error',
      });
    }
  };

  return { isBookmarked, toggleBookmark };
};

const useIsPaused = (lsc: ILeanScopeClient, entity: Entity) => {
  const [dueDateFacet] = useEntityComponents(entity, DueDateFacet);
  const isPaused = dueDateFacet?.props.dueDate === null;

  const togglePause = async () => {
    const newDueDate = isPaused ? new Date().toISOString() : null;
    const id = entity.get(IdentifierFacet)?.props.guid;

    entity.add(new DueDateFacet({ dueDate: newDueDate }));

    const { error } = await supabaseClient.from(SupabaseTable.FLASHCARDS).update({ due_date: newDueDate }).eq('id', id);

    if (error) {
      console.error('Error updating pause:', error);
      addNotificationEntity(lsc, {
        title: 'Fehler beim Aktualisieren der Pause',
        message: error.message,
        type: 'error',
      });
    }
  };

  return { isPaused, togglePause };
};
