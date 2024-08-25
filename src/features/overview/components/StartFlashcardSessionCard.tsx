import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { IoCopy, IoPlay } from 'react-icons/io5';
import tw from 'twin.macro';
import { dummyFlashcards } from '../../../base/dummy';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[12rem] p-4 flex flex-col justify-between rounded-2xl bg-[#397A45] bg-opacity-15`}
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
  ${tw``}
`;

const StyledButtonTitle = styled.p`
  ${tw`font-semibold text-sm`}
`;

const StyledButtonSubtitle = styled.p`
  ${tw`text-sm`}
`;

const StartFlashcardSessionCard = () => {
  const dueFlashcardsCount = useDueFlashcardsCount();

  return (
    <StyledCardWrapper>
      <div>
        <StyledFlexContainer>
          <IoCopy />
          <StyledText>Starte eine Abfragerunde</StyledText>
        </StyledFlexContainer>
        <StyledParagraph>Starte eine Abfragerunde und verbessere dein Wissen.</StyledParagraph>
      </div>

      <StyledButtonWrapper>
        <StyledIcon>
          <IoPlay />
        </StyledIcon>
        <StyledButtonText>
          <StyledButtonTitle>Abfrage Starten</StyledButtonTitle>
          <StyledButtonSubtitle>{dueFlashcardsCount} Fällige Karten</StyledButtonSubtitle>
        </StyledButtonText>
      </StyledButtonWrapper>
    </StyledCardWrapper>
  );
};

export default StartFlashcardSessionCard;

const fetchDueFlashcards = async () => {
  const currentDateTime = new Date().toISOString();

  const { data, error } = await supabaseClient.from('flashcards').select('bookmarked').lte('due_date', currentDateTime);

  if (error) {
    console.error('Error fetching due flashcards:', error);
  }
  return data || [];
};

const useDueFlashcardsCount = () => {
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const [dueFlashcardsCount, setDueFlashcardsCount] = useState(0);

  useEffect(() => {
    const countDueFlashcards = async () => {
      const dueFlashcards = isUsingMockupData ? dummyFlashcards : isUsingSupabaseData ? await fetchDueFlashcards() : [];

      if (dueFlashcards) {
        setDueFlashcardsCount(dueFlashcards.length);
      }
    };

    countDueFlashcards();
  }, [isUsingMockupData, isUsingSupabaseData]);

  return dueFlashcardsCount;
};
