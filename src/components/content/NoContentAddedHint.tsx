import styled from '@emotion/styled';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../common/hooks/useSelectedLanguage';
import { displayAlertTexts } from '../../common/utilities/displayText';

const StyledNoConttentAddedWrapper = styled.div`
  ${tw`mx-auto  mt-32 text-center`}
`;

const StyledNoContentTitle = styled.p`
  ${tw`text-xl text-primary-text dark:text-primary-text-dark font-bold w-fit py-1 px-4 mx-auto`}
`;

const StyledNoContentSubTitle = styled.p`
  ${tw` text-secondary-text dark:text-secondary-text-dark px-2 pb-4 `}
`;

const NoContentAddedHint = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <StyledNoConttentAddedWrapper>
      <StyledNoContentTitle>{displayAlertTexts(selectedLanguage).noContentAddedTitle}</StyledNoContentTitle>
      <StyledNoContentSubTitle>{displayAlertTexts(selectedLanguage).noContentAddedSubtitle}</StyledNoContentSubTitle>
    </StyledNoConttentAddedWrapper>
  );
};

export default NoContentAddedHint;
