import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierFacet, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { MouseEvent as ButtonMouseEvent, useContext, useState } from 'react';
import {
  IoAdd,
  IoAlbumsOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoColorWandOutline,
  IoCopyOutline,
  IoEllipsisHorizontalCircleOutline,
  IoFolderOutline,
  IoPlayOutline,
  IoReaderOutline,
  IoShareOutline,
  IoSparklesOutline,
  IoTextOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { LearningUnitTypeProps, TitleFacet } from '../../../../app/additionalFacets';
import { AdditionalTag, LearningUnitType, LearningUnitViews, Story, SupabaseTable } from '../../../../base/enums';
import { generatePdf } from '../../../../common/utilities';
import { ActionRow, NavBarButton, NavigationBar } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { useSelection } from '../../../../hooks/useSelection';
import { useUserData } from '../../../../hooks/useUserData';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts } from '../../../../utils/displayText';
import { updateLearningUnitType } from '../../functions/updateLearningUnitType';

interface LearningUnitNavBarProps {
  openFilePicker: () => void;
  currentView: LearningUnitViews;
}

const LearningUnitNavBar = (props: EntityProps & LearningUnitTypeProps & LearningUnitNavBarProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity, openFilePicker, currentView, type } = props;
  const { isBookmarked, toggleBookmark } = useIsBookmarked(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const isEditTextStyleSheetVisible = useIsStoryCurrent(Story.EDITING_TEXT_STYLE_STORY);
  const hasSelection = useSelection();
  const { userId } = useUserData();

  const openDeleteAlert = () => lsc.stories.transitTo(Story.DELETING_NOTE_STORY);
  const openGenerateFlashcardsSheet = () => lsc.stories.transitTo(Story.GENERATING_FLASHCARDS_STORY);
  const openImproveTextSheet = () => lsc.stories.transitTo(Story.GENERATING_IMPROVED_TEXT_STORY);
  // const openAddResourceToLerningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_RESOURCE_TO_LEARNING_GROUP_STORY);
  const openAddFlashcardsSheet = () => lsc.stories.transitTo(Story.ADDING_FLASHCARDS_STORY);
  const openEditTextStyleSheet = () => lsc.stories.transitTo(Story.EDITING_TEXT_STYLE_STORY);
  const openFlashcardQuizView = () => lsc.stories.transitTo(Story.OBSERVING_FLASHCARD_QUIZ_STORY);
  const exportLearningUnit = () =>
    generatePdf(entity.get(TitleFacet)?.props.title || '', entity.get(TextFacet)?.props.text || '');

  const addText = () => {
    updateLearningUnitType(entity, userId, LearningUnitType.MIXED);
  };

  const handleButtonClick = (event: ButtonMouseEvent<HTMLButtonElement>) => {
    if (!hasSelection) return;

    event.preventDefault();
    event.stopPropagation();
    openEditTextStyleSheet();
  };

  return (
    <NavigationBar>
      {currentView == LearningUnitViews.FLASHCARDS && (
        <NavBarButton onClick={openFlashcardQuizView}>
          <IoPlayOutline />
        </NavBarButton>
      )}
      {currentView == LearningUnitViews.NOTE && (
        <button onClick={handleButtonClick}>
          <NavBarButton blocked={!hasSelection}>
            <IoTextOutline style={{ opacity: isEditTextStyleSheetVisible ? '0.5' : '1' }} />
          </NavBarButton>{' '}
        </button>
      )}
      {currentView == LearningUnitViews.NOTE && (
        <NavBarButton
          content={
            <div>
              <ActionRow icon={<IoSparklesOutline />} first onClick={openImproveTextSheet}>
                {displayActionTexts(selectedLanguage).improveText}
              </ActionRow>
              <ActionRow last icon={<IoAlbumsOutline />} onClick={openGenerateFlashcardsSheet}>
                {displayActionTexts(selectedLanguage).generateFlashcards}
              </ActionRow>
            </div>
          }
        >
          <IoColorWandOutline />
        </NavBarButton>
      )}

      <NavBarButton
        content={
          <div>
            <ActionRow icon={<IoCopyOutline />} first onClick={openAddFlashcardsSheet}>
              {displayActionTexts(selectedLanguage).addFlashcards}
            </ActionRow>
            {type == LearningUnitType.FLASHCARD_SET && (
              <ActionRow icon={<IoReaderOutline />} onClick={addText}>
                {displayActionTexts(selectedLanguage).addText}
              </ActionRow>
            )}
            <ActionRow last icon={<IoFolderOutline />} onClick={openFilePicker}>
              {displayActionTexts(selectedLanguage).addFile}
            </ActionRow>
          </div>
        }
      >
        <IoAdd />
      </NavBarButton>
      <NavBarButton
        content={
          <div>
            <ActionRow first icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />} onClick={toggleBookmark}>
              {isBookmarked
                ? displayActionTexts(selectedLanguage).unbookmark
                : displayActionTexts(selectedLanguage).bookmark}
            </ActionRow>
            {currentView == LearningUnitViews.NOTE && (
              <ActionRow icon={<IoShareOutline />} onClick={exportLearningUnit}>
                Exportieren
              </ActionRow>
            )}
            {/* <ActionRow icon={<IoArrowUpCircleOutline />} onClick={openAddResourceToLerningGroupSheet}>
              {displayActionTexts(selectedLanguage).addToLearningGroup}
            </ActionRow> */}
            <ActionRow last destructive onClick={openDeleteAlert} icon={<IoTrashOutline />}>
              {displayActionTexts(selectedLanguage).delete}
            </ActionRow>
          </div>
        }
      >
        <IoEllipsisHorizontalCircleOutline />
      </NavBarButton>
    </NavigationBar>
  );
};

export default LearningUnitNavBar;

const useIsBookmarked = (entity: Entity) => {
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
      .from(SupabaseTable.LEARNING_UNITS)
      .update({ is_bookmarked: newValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  return { isBookmarked, toggleBookmark };
};
