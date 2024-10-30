import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import { IoChevronForward, IoReader } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { background } from '../../../assets';
import { useLoadingIndicator } from '../../../common/hooks';
import { Story } from '../../../common/types/enums';
import { CloseButton, FlexBox, ScrollableBox, Sheet, Spacer } from '../../../components';

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
  ${tw`flex bg-black h-44 mt-4 mb-2 w-full`}
`;

// const StyledImage = styled.div<{ backgroundImage: string; mirrored?: boolean }>`
//   ${tw`w-1/2 h-full bg-right-top bg-cover bg-no-repeat `}
//   background-image: url(${({ backgroundImage }) => backgroundImage});
//   ${({ mirrored }) => mirrored && tw`scale-x-[-1]`}
// `;

const StyledImage = styled.div`
  ${tw`w-full bg-cover h-full bg-center dark:opacity-70`}
  background-image: url(${background});
`;

const StyledContentContainer = styled.div`
  ${tw`p-4`}
`;

const StyledTitle = styled.p`
  ${tw`font-semibold line-clamp-2 text-lg`}
`;

const StyledDescription = styled.p`
  ${tw`text-secondary-text line-clamp-2 mt-2`}
`;

const StyledReadMore = styled.div`
  ${tw`flex w-fit hover:opacity-50 cursor-pointer transition-all space-x-2 text-[#668FE8] items-center mt-6`}
`;

const StyledSheetTitle = styled.p`
  ${tw`text-2xl lg:text-3xl 2xl:text-4xl xl:w-2/3  font-bold`}
`;

const ExploreCard = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isSheetVisible = useIsStoryCurrent(Story.READING_ARTICLE);
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

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
          {/* <StyledImage backgroundImage={dummyBase64Image} />
          <StyledImage backgroundImage={dummyBase64Image} mirrored /> */}
          <StyledImage />
        </StyledImageContainer>

        {!isLoadingIndicatorVisible ? (
          <div>
            {' '}
            <StyledContentContainer>
              <StyledTitle>Spaced Repetition und Active Recall: Die Superkräfte im Lernprozess 🚀 </StyledTitle>
              <StyledDescription>
                Lernen kann manchmal wie eine unüberwindbare Herausforderung erscheinen, besonders wenn es um große
                Mengen an Informationen geht. Aber was, wenn es Methoden gäbe, die das Lernen nicht nur effektiver,
              </StyledDescription>
              <StyledReadMore onClick={openSheet}>
                <p>Mehr Lesen</p>
                <div>
                  <IoChevronForward />
                </div>
              </StyledReadMore>
            </StyledContentContainer>
          </div>
        ) : (
          <div tw="w-full dark:opacity-10 transition-all p-4 ">
            <Skeleton baseColor="#A8BEEC" highlightColor="#C2D0EE" borderRadius={4} tw="w-1/3 h-3" />
            <Skeleton baseColor="#A8BEEC" highlightColor="#C2D0EE" borderRadius={4} tw="w-1/2 h-3" />

            <Skeleton baseColor="#C2D0EE" highlightColor="#CFDAF0" borderRadius={4} tw="w-4/5 h-3 mt-4" />
            <Skeleton baseColor="#C2D0EE" highlightColor="#CFDAF0" borderRadius={4} tw="w-4/5 h-3" />
          </div>
        )}
      </StyledCardWrapper>

      <Sheet visible={isSheetVisible} navigateBack={closeSheet}>
        <FlexBox>
          <div />
          <CloseButton onClick={closeSheet} />
        </FlexBox>
        <Spacer />
        <ScrollableBox>
          {' '}
          <div tw="lg:w-4/5 mx-auto w-full lg:pt-10">
            <StyledSheetTitle>Spaced Repetition und Active Recall: Die Superkräfte im Lernprozess 🚀</StyledSheetTitle>
            <Spacer />
            <p tw=" text-secondary-text dark:text-secondary-text-dark xl:text-lg">12. September 2024</p>
            <Spacer />
            <div tw="xl:text-lg">
              Lernen kann manchmal wie eine unüberwindbare Herausforderung erscheinen, besonders wenn es um große Mengen
              an Informationen geht. Aber was, wenn es Methoden gäbe, die das Lernen nicht nur effektiver, sondern auch
              angenehmer machen könnten? Genau hier kommen Spaced Repetition und Active Recall ins Spiel – zwei
              Superkräfte im Lernprozess, die insbesondere bei der Verwendung von Karteikarten ihre volle Wirkung
              entfalten.
              <br />
              <br />
              <b>Warum sind diese Strategien so wirkungsvoll?</b>
              <br />
              <br />
              <b>1. Spaced Repetition: Die Kunst des zeitlichen Lernens</b> <br />
              Spaced Repetition ist eine Lernmethode, bei der Informationen über einen bestimmten Zeitraum hinweg
              wiederholt werden. Das Besondere daran ist der zunehmende Abstand zwischen den Wiederholungen. Stell dir
              vor, du lernst heute etwas Neues. Anstatt es morgen wieder zu wiederholen, tust du es vielleicht in drei
              Tagen, dann in einer Woche und so weiter. Dieses Vorgehen nutzt einen psychologischen Effekt namens
              "Vergessenskurve", der besagt, dass wir Informationen mit der Zeit vergessen, es sei denn, wir wiederholen
              sie in zunehmenden Abständen. Durch diese Methode verankern sich Informationen tiefer im
              Langzeitgedächtnis, was zu einer nachhaltigeren Erinnerung führt.
              <br />
              <br />
              <b>2. Active Recall: Aktiv statt passiv</b>
              <br />
              Beim Active Recall geht es darum, sich aktiv an Informationen zu erinnern, anstatt sie passiv zu
              überfliegen. Das bedeutet, du stellst dir selbst Fragen zu dem, was du gelernt hast, und versuchst, die
              Antworten aus dem Gedächtnis zu reproduzieren. Diese Technik fördert nicht nur die Erinnerungsfähigkeit,
              sondern hilft auch dabei, Verbindungen zwischen verschiedenen Konzepten herzustellen. Es ist, als würdest
              du deinem Gehirn ein Workout geben, wodurch es stärker und geschickter im Umgang mit Informationen wird.
              <br />
              <br />
              <b>Karteikarten: Die perfekte Kombination</b>
              <br />
              Karteikarten sind ein klassisches und einfaches Werkzeug, das diese beiden Techniken perfekt vereint. Auf
              der einen Seite der Karte steht eine Frage oder ein Schlüsselbegriff, auf der anderen die Antwort oder
              Erklärung. Beim Durchgehen der Karten nutzt du Active Recall, um dich an die Antwort zu erinnern, und
              Spaced Repetition, indem du die Karten in regelmäßigen, sich erhöhenden Abständen durchgehst. So wird jede
              Lernsession zu einer effektiven Mischung aus Herausforderung und Wiederholung, was die Merkfähigkeit enorm
              steigert.
              <br />
              <br />
              <b>Für Schüler: Entdeckt das Potenzial digitaler Lernwerkzeuge</b>
              <br />
              In einer Welt, in der digitale Technologien zunehmend an Bedeutung gewinnen, eröffnen sich auch für das
              Lernen neue Horizonte. Apps, die auf Spaced Repetition und Active Recall basieren, bieten eine moderne
              Interpretation der traditionellen Karteikarten-Methode. Sie ermöglichen es euch, Lerninhalte effizient und
              strukturiert zu wiederholen, und passen sich sogar eurem individuellen Lernfortschritt an. Diese Art des
              Lernens ist nicht nur für das kurzfristige Pauken für Prüfungen nützlich, sondern fördert auch das
              langfristige Behalten von Wissen.
              <br />
              <br />
              Stellt euch vor, ihr habt eine App, die euch intelligent daran erinnert, was und wann ihr wiederholen
              solltet, basierend darauf, wie gut ihr die Inhalte beim letzten Mal beherrscht habt. Dies nimmt euch die
              Last, selbst einen Lernplan zu erstellen und sorgt für eine effizientere Nutzung eurer Lernzeit. Solche
              Apps sind wie persönliche Trainer für euer Gehirn, die euch dabei helfen, eure Lernziele schneller und mit
              weniger Aufwand zu erreichen. Und dass ist alles das, was mit Spina möglich ist.
              <br />
              <br />
              Zusammenfassend sind Spaced Repetition und Active Recall mächtige Werkzeuge in eurem Lernarsenal. Ihre
              Integration in moderne Lern-Apps wie Spina bringt euch nicht nur bei, wie man effektiv lernt, sondern
              macht den Prozess auch interaktiver und ansprechender. Nutzt die Vorteile dieser Methoden und erlebt, wie
              euer Lernen dynamischer, personalisierter und letztlich erfolgreicher wird. Probiert es aus und entdeckt,
              wie ihr euer Lernen auf das nächste Level bringen könnt!
            </div>
          </div>
        </ScrollableBox>
      </Sheet>
    </div>
  );
};

export default ExploreCard;
