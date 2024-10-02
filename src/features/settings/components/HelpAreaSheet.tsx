import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext } from 'react';
import tw from 'twin.macro';
import { dummyBase64Image } from '../../../base/dummyBase64Image';
import { Story } from '../../../base/enums';
import { ShowMoreButton } from '../../../common/components/buttons';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer } from '../../../components';
import ContactFormSheet from './ContactFormSheet';

const HELP_AREA_LINK = 'https://spina-education.com/hilfebereich';
const DATA_PRIVACY_LINK = 'https://spina-education.com/nutzungsbedingungenundDatenschutzrichtlinien';

const StyledSecondaryText = styled.div`
  ${tw`text-secondary-text text-sm`}
`;

const StyledImage = styled.div`
  ${tw`rounded-full bg-left bg-cover  mx-auto  h-52 w-52`}
  background-image: url(${dummyBase64Image});
`;

const HelpAreaSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_HELP_AREA_STORY);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);
  const openContactForm = () => lsc.stories.transitTo(Story.OBSERVING_CONTACT_FORM_STORY);

  return (
    <div>
      <Sheet navigateBack={navigateBack} visible={isVisible}>
        <FlexBox>
          <div />
          <CloseButton onClick={navigateBack} />
        </FlexBox>
        <Spacer size={8} />

        <StyledImage />
        <Spacer size={8} />
        <Section>
          <SectionRow role="button">
            <a href={HELP_AREA_LINK} target="new">
              Hilfebereich
            </a>
          </SectionRow>
          <SectionRow role="button" onClick={openContactForm}>
            <FlexBox>
              <p>Kontaktieren</p>
              <ShowMoreButton />
            </FlexBox>
          </SectionRow>
          <SectionRow role="button" last>
            <a href={DATA_PRIVACY_LINK} target="new">
              Nutzungsbedingungen und Datenschutzrichtlinien
            </a>
          </SectionRow>
        </Section>
        <Spacer />
        <StyledSecondaryText>© 2024 Spina Education</StyledSecondaryText>
      </Sheet>

      <ContactFormSheet />
    </div>
  );
};

export default HelpAreaSheet;
