import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useContext } from 'react';
import { Story } from '../../../../base/enums';
import { FlashcardSetThumbNail } from '../../../../components';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const BookmarkedFlashcardsCell = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { color } = useSelectedSchoolSubjectColor();

  const openBookmarkedFlashcards = () => lsc.stories.transitTo(Story.OBSERVING_BOOKMARKED_FLASHCARDS_STORY);

  return <FlashcardSetThumbNail color={color} title="Lernkarten mit Lesezeichen" onClick={openBookmarkedFlashcards} />;
};

export default BookmarkedFlashcardsCell;
