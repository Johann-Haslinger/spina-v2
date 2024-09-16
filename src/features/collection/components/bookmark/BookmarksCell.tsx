import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useContext } from 'react';
import { IoBookmark } from 'react-icons/io5';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../../../base/constants';
import { Story } from '../../../../base/enums';

const StyledCellWrapper = styled.div`
  ${tw`  w-full flex  cursor-pointer  items-center justify-center pr-3 text-8xl md:hover:text-9xl md:hover:scale-105  transition-all h-40`}
  background-color: ${COLOR_ITEMS[1].color + 90};
  color: ${COLOR_ITEMS[1].color};
`;

const BookmarksCell = () => {
  const lsc = useContext(LeanScopeClientContext);

  const openBookmarkCollection = () => lsc.stories.transitTo(Story.OBSERVING_BOOKMARKS_STORY);

  return (
    <StyledCellWrapper onClick={openBookmarkCollection}>
      <IoBookmark />
    </StyledCellWrapper>
  );
};

export default BookmarksCell;
