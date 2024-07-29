import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useEntities } from "@leanscope/ecs-engine";
import { ParentFacet } from "@leanscope/ecs-models";
import { useIsStoryCurrent } from "@leanscope/storyboarding";
import {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { IoEye } from "react-icons/io5";
import tw from "twin.macro";
import { AnswerFacet } from "../../../../app/additionalFacets";
import { DataTypes, Stories } from "../../../../base/enums";
import {
  BackButton,
  Divider,
  NavigationBar,
  SecondaryText,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/displayText";
import { dataTypeQuery } from "../../../../utils/queries";
import { useSelectedSubtopic } from "../../hooks/useSelectedSubtopic";

// TODO: add button to components folder

const StyledButtonWrapper = styled.div`
  ${tw`bg-primaryColor text-primaryColor bg-opacity-10 rounded-full py-1 justify-center transition-all px-5 md:hover:opacity-50 w-fit flex items-center`}
`;

const StyledButtonIcon = styled.div`
  ${tw`mr-2 text-lg`}
`;

const Button = (
  props: { onClick: () => void; icon: ReactNode } & PropsWithChildren,
) => {
  const { icon, onClick, children } = props;
  return (
    <StyledButtonWrapper onClick={onClick}>
      <StyledButtonIcon> {icon} </StyledButtonIcon>
      <p>{children}</p>
    </StyledButtonWrapper>
  );
};

const useBlurtingAnswer = () => {
  const [flashcardEntities] = useEntities((e) =>
    dataTypeQuery(e, DataTypes.FLASHCARD),
  );
  const { selectedSubtopicId } = useSelectedSubtopic();
  const [blurtingAnswer, setBlurtingAnswer] = useState("");
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_BLURTING_STORY);

  useEffect(() => {
    const filterdFlashcardEntities = flashcardEntities.filter(
      (e) => e?.get(ParentFacet)?.props.parentId === selectedSubtopicId,
    );
    const answer = filterdFlashcardEntities
      .map((e) => "- " + e.get(AnswerFacet)?.props.answer)
      .join(" \n ");
    setBlurtingAnswer(answer);
  }, [flashcardEntities, selectedSubtopicId, isVisible]);

  return blurtingAnswer;
};

const StyledTexteditor = styled.div`
  ${tw`w-full h-fit outline-none min-h-[18rem]`}
`;

const BlurtingView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_BLURTING_STORY);
  const { selectedSubtopicTitle } = useSelectedSubtopic();
  const { selectedLanguage } = useSelectedLanguage();
  const answer = useBlurtingAnswer();
  const [isCardsVisible, setCardsVisible] = useState(false);

  const navigateBack = () =>
    lsc.stories.transitTo(Stories.OBSERVING_SUBTOPIC_STORY);

  return (
    <View visible={isVisible}>
      <NavigationBar />
      <BackButton navigateBack={navigateBack}>
        {selectedSubtopicTitle}
      </BackButton>
      <Title>{displayHeaderTexts(selectedLanguage).blurting}</Title>
      <Spacer />
      <SecondaryText>
        Schreibe alles, was dir zum Thema {selectedSubtopicTitle} in den Sinn
        kommt, unmittelbar hier auf ohne dich um Struktur oder Details zu
        kümmern – lass einfach alle Gedanken frei fließen.{" "}
      </SecondaryText>
      <Spacer size={8} />
      <Divider />
      <Spacer size={8} />
      <StyledTexteditor contentEditable />
      <Spacer size={8} />
      <Divider />
      <Spacer size={8} />
      <Button onClick={() => setCardsVisible(!isCardsVisible)} icon={<IoEye />}>
        Vergeichen
      </Button>
      <Spacer size={8} />
      {isCardsVisible && <p>{answer}</p>}
      <Spacer size={20} />
    </View>
  );
};

export default BlurtingView;
