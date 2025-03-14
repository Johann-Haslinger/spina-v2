import styled from '@emotion/styled';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../common/hooks/useSelectedLanguage';
import { displayAlertTexts, displayDataTypeTexts } from '../../common/utilities/displayText';

const CardContainer = tw.div`
    w-full h-fit min-h-48 pb-4
  `;

const CardWrapper = tw.div`
cursor-pointer   w-full p-0.5 flex flex-wrap rounded-lg h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiary-dark 
  `;

const CardItem = tw.div`
    w-1/2 p-0.5  h-[3.8rem]
  `;

const StyledCardContent = styled.div<{ color: string }>`
  ${tw`  pb-3.5 px-2 pt-1.5 w-full h-full rounded-md`}
  background-color: ${({ color }) => color};
`;

const StyledCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primary-text-dark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-secondary-text dark:text-secondary-text-dark `}
`;

const FlashcardSetThumbNail = (props: { color: string; title: string; onClick?: () => void }) => {
  const { color, title, onClick } = props;
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <CardContainer onClick={onClick}>
      <CardWrapper>
        {Array.from({ length: 4 }, (_, index) => index + 1).map((_, idx) => (
          <CardItem key={idx}>
            <StyledCardContent color={idx == 1 || idx == 2 ? color : color + '99'}>
              {/* {[1, 2, 3, 4].map((_, idx) => (
                <CardDot key={idx} style={{ backgroundColor: color }} />
              ))} */}
            </StyledCardContent>
          </CardItem>
        ))}
      </CardWrapper>
      <StyledCellTitle> {title || displayAlertTexts(selectedLanguage).noTitle}</StyledCellTitle>

      <StyledResourceTypeText>{displayDataTypeTexts(selectedLanguage).flashcardSet}</StyledResourceTypeText>
    </CardContainer>
  );
};

export default FlashcardSetThumbNail;
