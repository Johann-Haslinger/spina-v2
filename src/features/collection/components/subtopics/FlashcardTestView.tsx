import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { Entity, useEntities } from '@leanscope/ecs-engine';
import { ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import tw from 'twin.macro';
import { AnswerFacet, QuestionFacet } from '../../../../app/additionalFacets';
import { DataTypes, Stories } from '../../../../base/enums';
import { BackButton, Divider, NavigationBar, SecondaryText, Spacer, Title, View } from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../../utils/displayText';
import { dataTypeQuery } from '../../../../utils/queries';
import { useSelectedSubtopic } from '../../hooks/useSelectedSubtopic';

// TODO: add button to components folder

const StyledButtonWrapper = styled.div`
  ${tw`bg-primaryColor text-primaryColor bg-opacity-10 rounded-full py-1 justify-center transition-all px-5 md:hover:opacity-50 w-fit flex items-center`}
`;

const StyledButtonIcon = styled.div`
  ${tw`mr-2 text-lg`}
`;

const Button = (props: { onClick: () => void; icon: ReactNode } & PropsWithChildren) => {
  const { icon, onClick, children } = props;
  return (
    <StyledButtonWrapper onClick={onClick}>
      <StyledButtonIcon> {icon} </StyledButtonIcon>
      <p>{children}</p>
    </StyledButtonWrapper>
  );
};

interface Flashcard {
  question: string;
  answer: string;
}

function getRandomElements(array: Entity[]): Entity[] {
  if (array.length < 10) {
    return array;
  }

  const copyArray = array.slice();
  const resultArray = [];

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    const selectedElement = copyArray.splice(randomIndex, 1)[0];
    resultArray.push(selectedElement);
  }

  return resultArray;
}

const StyledRowWrapper = styled.div`
  ${tw`pb-3 mt-3 border-b-[0.02rem] border-primaryBorder dark:border-primaryBorderDark`}
`;

const StyledQuestionText = styled.p`
  ${tw`font-semibold`}
`;

const StyledAnswerText = styled.p`
  ${tw`mt-2`}
`;

const StyledTextArea = styled.textarea`
  ${tw`mt-1 h-fit bg-white bg-opacity-0 overflow-visible outline-none w-full  placeholder:text-opacity-50`}
`;

const TestRow = (props: { flashCard: Flashcard; isAnswerVisible: boolean }) => {
  const {
    flashCard: { question, answer },
    isAnswerVisible,
  } = props;

  return (
    <StyledRowWrapper>
      <StyledQuestionText>{question}</StyledQuestionText>
      <div>
        <StyledTextArea placeholder="Antwort" />
        {isAnswerVisible && <StyledAnswerText>{answer}</StyledAnswerText>}
      </div>
    </StyledRowWrapper>
  );
};

const useFlashcardsForTest = () => {
  const [flashcardEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.FLASHCARD));
  const { selectedSubtopicId } = useSelectedSubtopic();
  const [flashCardsForTest, setFlashCardsForTest] = useState<Flashcard[]>();
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_FLASHCARD_TEST_STORY);

  useEffect(() => {
    const filterdFlashcardEntities = flashcardEntities.filter(
      (e) => e?.get(ParentFacet)?.props.parentId === selectedSubtopicId,
    );
    const randomFlashcardEntities = getRandomElements(filterdFlashcardEntities);
    setFlashCardsForTest(
      randomFlashcardEntities?.map((e) => ({
        question: e.get(QuestionFacet)?.props.question || '',
        answer: e.get(AnswerFacet)?.props.answer || '',
      })),
    );
  }, [flashcardEntities, selectedSubtopicId, isVisible]);

  return flashCardsForTest || [];
};

const FlashcardTestView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_FLASHCARD_TEST_STORY);
  const { selectedSubtopicTitle } = useSelectedSubtopic();
  const { selectedLanguage } = useSelectedLanguage();
  const flashcardsFortest = useFlashcardsForTest();
  const [isAnswerVisible, setAnswerVisible] = useState(false);

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_SUBTOPIC_STORY);

  return (
    <View visible={isVisible}>
      <NavigationBar />
      <BackButton navigateBack={navigateBack}>{selectedSubtopicTitle}</BackButton>
      <Title>{displayHeaderTexts(selectedLanguage).flashcardTest}</Title>
      <Spacer />
      <SecondaryText>
        {flashcardsFortest.length == 0
          ? 'Keine Karteikarten vorhanden'
          : ' Fülle den {selectedSubtopicTitle} Test aus, indem du zu jeder Frage die passende Antwort schreibst – konzentriere dich dabei auf klare und prägnante Informationen.'}
      </SecondaryText>
      <Spacer size={8} />
      <Divider />
      {flashcardsFortest.map((card) => (
        <TestRow isAnswerVisible={isAnswerVisible} flashCard={card} />
      ))}
      <Spacer size={8} />
      <Button onClick={() => setAnswerVisible(!isAnswerVisible)} icon={<IoEye />}>
        Vergeichen
      </Button>
      <Spacer size={20} />
    </View>
  );
};

export default FlashcardTestView;
