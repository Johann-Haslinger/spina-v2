import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { IoChevronForward, IoClose, IoReader } from 'react-icons/io5';
import tw from 'twin.macro';
import { dummyBase64Image } from '../../../base/dummyBase64Image';
import { Story } from '../../../base/enums';
import { Sheet, Spacer } from '../../../components';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem]  py-4 rounded-2xl bg-[#668FE8] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex  text-[#668FE8] px-4 space-x-2 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledImageContainer = styled.div`
  ${tw`flex h-48 mt-4 w-full`}
`;

const StyledImage = styled.div<{ backgroundImage: string; mirrored?: boolean }>`
  ${tw`w-1/2 h-full bg-right bg-cover bg-no-repeat `}
  background-image: url(${({ backgroundImage }) => backgroundImage});
  ${({ mirrored }) => mirrored && tw`scale-x-[-1] bg-right`}
`;

const StyledContentContainer = styled.div`
  ${tw`p-4`}
`;

const StyledTitle = styled.p`
  ${tw`font-semibold line-clamp-2 text-lg`}
`;

const StyledDescription = styled.p`
  ${tw`text-seconderyText line-clamp-2 mt-2`}
`;

const StyledReadMore = styled.div`
  ${tw`flex w-fit hover:opacity-50 cursor-pointer transition-all space-x-2 text-[#668FE8] items-center mt-6`}
`;

const StyledCloseButton = styled.button`
  ${tw`text-lg mt-2 text-seconderyText dark:bg-tertiaryDark hover:opacity-50 transition-all dark:text-seconderyTextDark bg-tertiary p-2 rounded-full`}
`;

const StyledSheetTitle = styled.p`
  ${tw`text-2xl 2xl:text-3xl xl:w-2/3 2xl:w-1/2 font-bold`}
`;

const ExploreCard = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isSheetVisible = useIsStoryCurrent(Story.READING_ARTICLE);

  const openSheet = () => lsc.stories.transitTo(Story.READING_ARTICLE);
  const closeSheet = () => lsc.stories.transitTo(Story.OBSERVING_OVERVIEW);

  return (
    <div>
      <StyledCardWrapper>
        <StyledFlexContainer>
          <IoReader />
          <StyledText>Entdecke etwas Neues</StyledText>
        </StyledFlexContainer>

        <StyledImageContainer>
          <StyledImage backgroundImage={dummyBase64Image} />
          <StyledImage backgroundImage={dummyBase64Image} mirrored />
        </StyledImageContainer>

        <StyledContentContainer>
          <StyledTitle> 🚀 Spaced Repetition und Active Recall: Die Superkräfte im Lernprozess</StyledTitle>
          <StyledDescription>
            Lernen kann manchmal wie eine unüberwindbare Herausforderung erscheinen, besonders wenn es um große Mengen
            an Informationen geht. Aber was, wenn es Methoden gäbe, die das Lernen nicht nur effektiver,
          </StyledDescription>
          <StyledReadMore onClick={openSheet}>
            <p>Mehr Lesen</p>
            <div>
              <IoChevronForward />
            </div>
          </StyledReadMore>
        </StyledContentContainer>
      </StyledCardWrapper>

      <Sheet visible={isSheetVisible} navigateBack={closeSheet}>
        <StyledCloseButton onClick={closeSheet}>
          <IoClose />
        </StyledCloseButton>
        <Spacer size={8} />
        <StyledSheetTitle>🚀 Spaced Repetition und Active Recall: Die Superkräfte im Lernprozess </StyledSheetTitle>
      </Sheet>
    </div>
  );
};

export default ExploreCard;
