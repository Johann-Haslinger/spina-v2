import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext } from "react";
import { IoBookmark } from "react-icons/io5";
import tw from "twin.macro";
import { Stories } from "../../../../base/enums";

const StyledCellWrapper = styled.div`
  ${tw`  w-full flex bg-[#0B86D1] text-white cursor-pointer  items-center justify-center pr-3 text-8xl md:hover:text-9xl md:hover:scale-105  transition-all h-40`}
`;

const BookmarkCollectionCard = () => {
  const lsc = useContext(LeanScopeClientContext);

  const openBookmarkCollection = () =>
    lsc.stories.transitTo(Stories.OBSERVING_BOOKMARK_COLLECTION_STORY);

  return (
    <StyledCellWrapper onClick={openBookmarkCollection}>
      <IoBookmark />
    </StyledCellWrapper>
  );
};

export default BookmarkCollectionCard;
