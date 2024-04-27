import styled from "@emotion/styled";
import tw from "twin.macro";

const CardContainer = tw.div`
    w-full h-fit min-h-48 pb-4
  `;

const CardWrapper = tw.div`
    w-full p-0.5 flex flex-wrap rounded-lg h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark 
  `;

const CardItem = tw.div`
    w-1/2 p-0.5  h-[3.8rem]
  `;

const StyledCardContent = styled.div<{ color: string }>`
  ${tw`  pb-3.5 px-2 pt-1.5 w-full h-full rounded-md`}
  background-color: ${({ color }) => color};
`;

const CardDot = tw.div`
    w-4 mt-1 mb-2 h-1 rounded-full bg-white opacity-40
  `;

const StyledCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const FlashcardSetThumbNail = (props: {
  color: string;
  title: string;
  onClick?: () => void;
}) => {
  const { color, title, onClick } = props;

  return (
    <CardContainer onClick={onClick}>
      <CardWrapper>
        {Array.from({ length: 4 }, (_, index) => index + 1).map((_, idx) => (
          <CardItem key={idx}>
            <StyledCardContent color={color}>
              {/* {[1, 2, 3, 4].map((_, idx) => (
                <CardDot key={idx} style={{ backgroundColor: color }} />
              ))} */}
            </StyledCardContent>
          </CardItem>
        ))}
      </CardWrapper>
      <StyledCellTitle> {title || "Kein Titel"}</StyledCellTitle>

      <StyledResourceTypeText>Kartensatz</StyledResourceTypeText>
    </CardContainer>
  );
};

export default FlashcardSetThumbNail;
