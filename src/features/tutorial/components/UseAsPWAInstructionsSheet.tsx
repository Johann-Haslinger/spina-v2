import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { logo } from '../../../assets';
import { Story } from '../../../common/types/enums';
import { CloseButton, FlexBox, Sheet, Spacer } from '../../../components';

const StyledContainer = styled.div`
  ${tw`lg:w-4/5 mx-auto w-full lg:pt-10`}
`;
const StyledLogo = styled.img`
  ${tw`xl:size-20 size-16 mb-8 border-primary-border dark:border-primary-border-dark border rounded-2xl`}
`;
const StyledText = styled.p`
  ${tw`xl:text-lg`}
`;
const StyledTextContainer = styled.div`
  ${tw`xl:text-lg`}
`;

const StyledSheetTitle = styled.p`
  ${tw`text-2xl lg:text-3xl 2xl:text-4xl xl:w-2/3  font-bold`}
`;

const UseAsPWAInstructionsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isAddingToHomeScreenStoryCurrent = useIsStoryCurrent(Story.OBSERVING_ADD_TO_HOME_SCREEN_STORY);
  const [isAddingToHomeScreen, setIsAddingToHomeScreen] = useState(false);

  useEffect(() => {
    const instructionsClosed = localStorage.getItem('isInstructionsClosed');

    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    if (!instructionsClosed && !isPWA) {
      lsc.stories.transitTo(Story.OBSERVING_ADD_TO_HOME_SCREEN_STORY);
      setIsAddingToHomeScreen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('isInstructionsClosed', 'true');
    lsc.stories.transitTo(Story.OBSERVING_OVERVIEW);
    setTimeout(() => {
      setIsAddingToHomeScreen(false);
    }, 500);
  };

  if (!isAddingToHomeScreen) return null;

  return (
    <Sheet visible={isAddingToHomeScreenStoryCurrent} navigateBack={handleClose}>
      <FlexBox>
        <div />
        <CloseButton onClick={handleClose} />
      </FlexBox>
      <Spacer />
      <StyledContainer>
        <StyledLogo src={logo} alt="logo" />
        <StyledSheetTitle>Füge Spina zu deinem Home-Bildschirm hinzu!</StyledSheetTitle>
        <Spacer />
        <Spacer />
        <StyledText>
          So hast du Spina immer griffbereit und kannst es nutzen, als wäre es eine native App. 🚀
        </StyledText>
        <Spacer />
        <StyledTextContainer>
          <p>
            <b>Für iOS:</b> Tippe auf den Teilen-Button unten in deinem Browser und wähle "Zum Home-Bildschirm
            hinzufügen".
          </p>
          <br />
          <p>
            <b>Für Android:</b> Tippe auf die drei Punkte oben rechts in deinem Browser und wähle "Zum Startbildschirm
            hinzufügen".
          </p>
        </StyledTextContainer>
      </StyledContainer>
    </Sheet>
  );
};

export default UseAsPWAInstructionsSheet;
