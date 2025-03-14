import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useContext } from 'react';
import { IoBookmark } from 'react-icons/io5';
import tw from 'twin.macro';
import { COLOR_ITEMS } from '../../../../common/types/constants';
import { Story } from '../../../../common/types/enums';

const StyledCellWrapper = styled.div<{ color: string; backgroundColor: string }>`
  ${tw`  w-full flex  cursor-pointer  items-center justify-center pr-3 text-8xl md:hover:text-9xl md:hover:scale-105  transition-all h-40`}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const BookmarksCell = () => {
  const lsc = useContext(LeanScopeClientContext);
  const color = COLOR_ITEMS[1].color;

  const openBookmarkCollection = () => lsc.stories.transitTo(Story.OBSERVING_BOOKMARKS_STORY);

  return (
    <StyledCellWrapper color={color} backgroundColor={color + 90} onClick={openBookmarkCollection}>
      <IoBookmark />
    </StyledCellWrapper>
  );
};

export default BookmarksCell;
