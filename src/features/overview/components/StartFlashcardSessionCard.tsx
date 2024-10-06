import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useContext } from 'react';
import { IoCopy, IoPlay } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import tw from 'twin.macro';
import { Story } from '../../../base/enums';
import { useLoadingIndicator } from '../../../common/hooks';
import { useDueFlashcardsCount } from '../../flashcards/hooks/useDueFlashcardsCount';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[12rem] p-4 flex flex-col justify-between rounded-2xl bg-[#397A45] dark:bg-opacity-20 bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 text-[#397A45] items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledParagraph = styled.p`
  ${tw`mt-2 font-medium`}
`;

const StyledButtonWrapper = styled.div`
  ${tw`bg-[#397A45] flex space-x-4 items-center bg-opacity-[0.07] hover:bg-opacity-15 transition-all text-[#397A45] cursor-pointer w-full rounded-xl px-4 py-2.5`}
`;

const StyledIcon = styled.div`
  ${tw`text-2xl`}
`;

const StyledButtonText = styled.div`
  ${tw`w-full`}
`;

const StyledButtonTitle = styled.p`
  ${tw`font-semibold text-sm`}
`;

const StyledButtonSubtitle = styled.p`
  ${tw`text-sm`}
`;

const StartFlashcardSessionCard = () => {
  const lsc = useContext(LeanScopeClientContext);
  const dueFlashcardsCount = useDueFlashcardsCount();
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  const openFlashcardQuizView = () => lsc.stories.transitTo(Story.OBSERVING_SPACED_REPETITION_QUIZ);

  return (
    <div>
      <StyledCardWrapper>
        <div>
          <StyledFlexContainer>
            <IoCopy />
            <StyledText>Starte eine Abfragerunde</StyledText>
          </StyledFlexContainer>
          <StyledParagraph>Starte eine Abfragerunde und verbessere dein Wissen.</StyledParagraph>
        </div>

        <StyledButtonWrapper onClick={openFlashcardQuizView}>
          <StyledIcon>
            <IoPlay />
          </StyledIcon>
          <StyledButtonText>
            {isLoadingIndicatorVisible ? (
              <div tw="w-full dark:opacity-10 transition-all">
                <Skeleton baseColor="#8EAD92" highlightColor="#ACC2AF" borderRadius={4} tw="w-1/2 h-3" />
                <Skeleton baseColor="#ACC2AF" highlightColor="#BCCCBE" borderRadius={4} tw="w-2/3 h-3" />
              </div>
            ) : (
              <div>
                <StyledButtonTitle>Abfrage Starten</StyledButtonTitle>
                <StyledButtonSubtitle>
                  {dueFlashcardsCount > 30 ? `30 von ${dueFlashcardsCount}` : dueFlashcardsCount} fällige Karten abfragen 
                </StyledButtonSubtitle>{' '}
              </div>
            )}
          </StyledButtonText>
        </StyledButtonWrapper>
      </StyledCardWrapper>
    </div>
  );
};

export default StartFlashcardSessionCard;
