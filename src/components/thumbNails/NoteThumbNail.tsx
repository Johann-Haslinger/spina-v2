import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledNoteCellWrapper = styled.div`
  ${tw`pb-2  `}
`;

const StyledNoteCellContainer = styled.div`
  ${tw`w-full  space-x-1   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark `}
`;

const StyledNoteCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-1/2  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoteCellLine = styled.div<{
  color: string;
  lineIndex: number;
  cellIndex: number;
}>`
  ${tw`w-full mt-1 mb-2 h-1 rounded-full bg-white opacity-40`}
  /* background-color: ${({ color }) => color}; */
  width: ${({ lineIndex, cellIndex }) => {
    if (lineIndex === 0 && cellIndex === 1) {
      return "33.33%";
    } else if (lineIndex % 2 === 0) {
      return "66.66%";
    } else {
      return "83.33%";
    }
  }};
  ${({ lineIndex, cellIndex }) => {
    if (lineIndex === 0 && cellIndex === 1) {
      return tw`mt-1 mb-3`;
    } else if (lineIndex === 4 && cellIndex === 2) {
      return tw` mt-4`;
    } else {
      return "mt-1";
    }
  }};
`;

const StyledNoteCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const NoteThumbNail = (props: { color: string; title: string, onClick?: ()=> void }) => {
  const { color, title, onClick } = props;

  return (
    <StyledNoteCellWrapper onClick={onClick}>
      <StyledNoteCellContainer>
        {[1, 2].map((cellIndex) => (
          <StyledNoteCellItem key={cellIndex} backgroundColor={color}>
            {/* {[0, 1, 2, 3, 4, 5, 6].map((lineIndex) => (
              <StyledNoteCellLine
                key={lineIndex}
                lineIndex={lineIndex}
                cellIndex={cellIndex}
                color={color}
              />
            ))} */}
          </StyledNoteCellItem>
        ))}
      </StyledNoteCellContainer>

      <StyledNoteCellTitle>
        {title || "Kein Titel"}
      </StyledNoteCellTitle>

      <StyledResourceTypeText> Mitschrift</StyledResourceTypeText>
    </StyledNoteCellWrapper>
  );
};

export default NoteThumbNail;
