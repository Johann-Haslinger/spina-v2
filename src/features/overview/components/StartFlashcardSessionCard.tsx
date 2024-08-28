import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import { IoCopy, IoPlay } from 'react-icons/io5';
import tw from 'twin.macro';
import { dummyFlashcards } from '../../../base/dummy';
import { Story, SupabaseTables } from '../../../base/enums';
import { useCurrentDataSource } from '../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../lib/supabase';
import { useDueFlashcards } from '../../flashcards/hooks/useDueFlashcards';
import FlashcardQuizView from '../../study/components/FlashcardQuizView';

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
  const lsc = useContext(LeanScopeClientContext);
  const dueFlashcardsCount = useDueFlashcardsCount();

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
            <StyledButtonTitle>Abfrage Starten</StyledButtonTitle>
            <StyledButtonSubtitle>{dueFlashcardsCount} Fällige Karten</StyledButtonSubtitle>
          </StyledButtonText>
        </StyledButtonWrapper>
      </StyledCardWrapper>

      <FlashcardQuizView />
    </div>
  );
};

export default StartFlashcardSessionCard;

const fetchDueFlashcards = async () => {
  const currentDateTime = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from(SupabaseTables.FLASHCARDS)
    .select('bookmarked')
    .lte('due_date', currentDateTime);

  if (error) {
    console.error('Error fetching due flashcards:', error);
  }
  return data || [];
};

const useDueFlashcardsCount = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const { dueFlashcardEntity, dueFlashcardsCount } = useDueFlashcards();

  useEffect(() => {
    const isEntityAlreadyAdded = lsc.engine.entities.some(
      (e) => e.get(IdentifierFacet)?.props.guid === 'dueFlashcards',
    );
    if (isEntityAlreadyAdded) return;
    const newDueFlashcardsEntity = new Entity();
    lsc.engine.addEntity(newDueFlashcardsEntity);
    newDueFlashcardsEntity.add(new IdentifierFacet({ guid: 'dueFlashcards' }));
    newDueFlashcardsEntity.add(new CountFacet({ count: 0 }));
  }, []);

  useEffect(() => {
    const countDueFlashcards = async () => {
      const dueFlashcards = isUsingMockupData ? dummyFlashcards : isUsingSupabaseData ? await fetchDueFlashcards() : [];

      if (dueFlashcards) {
        dueFlashcardEntity?.add(new CountFacet({ count: dueFlashcards.length }));
      }
    };

    countDueFlashcards();
  }, [isUsingMockupData, isUsingSupabaseData, dueFlashcardEntity]);

  return dueFlashcardsCount;
};
