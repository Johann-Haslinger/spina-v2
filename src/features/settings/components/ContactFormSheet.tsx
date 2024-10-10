import styled from '@emotion/styled/macro';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { IoCheckmarkCircleOutline, IoSend } from 'react-icons/io5';
import tw from 'twin.macro';
import { Story } from '../../../base/enums';
import { CloseButton, FlexBox, Section, SectionRow, Sheet, Spacer, TextInput } from '../../../components';

const StyledSecondaryText = styled.div`
  ${tw`text-secondary-text text-sm`}
`;

const StyledTextArea = styled.textarea`
  ${tw`w-full outline-none p-4 px-6 placeholder:text-placeholder-text dark:bg-tertiary-dark dark:placeholder:text-placeholder-text-dark bg-white rounded-lg h-60 mt-4`}
`;

const StyledSentMessage = styled.div`
  ${tw`text-primary dark:text-white mt-5 space-x-2 flex items-center`}
`;

const StyledIconWrapper = styled(IoCheckmarkCircleOutline)`
  ${tw`text-primary-color text-2xl`}
`;

const StyledSubmitButton = styled.button`
  ${tw`flex bg-primary-color text-primary-color dark:bg-opacity-10 bg-opacity-20 mt-5 py-1.5 px-4 rounded-full hover:opacity-50 transition duration-300`}
`;

const StyledSendIcon = styled(IoSend)`
  ${tw`mr-3 mt-1.5`}
`;

const ContactFormSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isContactFormVisible = useIsStoryCurrent(Story.OBSERVING_CONTACT_FORM_STORY);
  const isReportProblemVisible = useIsStoryCurrent(Story.OBSERVING_REPORT_PROBLEM_STORY);
  const isVisible = isContactFormVisible || isReportProblemVisible;
  const [isSent] = useState(false);

  const navigateBack = () =>
    lsc.stories.transitTo(isContactFormVisible ? Story.OBSERVING_HELP_AREA_STORY : Story.OBSERVING_COLLECTION_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />

      <form action="/success" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact" />
        <div hidden>
          <input name="bot-field" />
        </div>

        <Section>
          <SectionRow last>
            <TextInput placeholder="E-Mail" required type="email" id="email" name="email" />
          </SectionRow>
        </Section>
        <Spacer size={2} />
        <StyledSecondaryText>Wir werden uns per Email in den kommenden Tagen bei dir melden.</StyledSecondaryText>
        <Spacer size={2} />
        <StyledTextArea
          placeholder="Sag uns, wie wir dir helfen können. Verwende dafür mindestens 5 Zeichen"
          required
          id="message"
          name="message"
        />

        {isSent ? (
          <StyledSentMessage>
            <StyledIconWrapper />
            <p>Vielen Dank für deine Nachricht!</p>
          </StyledSentMessage>
        ) : (
          <div>
            <StyledSubmitButton type="submit">
              <StyledSendIcon /> <p>Nachricht senden</p>
            </StyledSubmitButton>
          </div>
        )}
      </form>
    </Sheet>
  );
};

export default ContactFormSheet;
