import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import { View } from '../components';

const StyledContainerDiv = styled.div`
  ${tw`md:w-96 w-full flex flex-col justify-between md:justify-start pb-14 h-full`}
`;

const StyledEmoji = styled.p`
  ${tw`md:text-6xl text-5xl mb-8`}
`;

const StyledDescription = styled.p`
  ${tw`mt-4 md:mt-8`}
`;

const StyledTitle = styled.p`
  ${tw`text-3xl font-extrabold`}
`;

const StyledMotionDiv = styled(motion.div)`
  ${tw`h-screen overflow-hidden absolute px-4 left-0 top-0 w-screen pt-20 md:pt-32 lg:pt-48 xl:pt-60 flex justify-center`}
`;

const VerifiedEmailPage = () => {
  return (
    <View viewType="baseView">
      <StyledMotionDiv>
        <StyledContainerDiv>
          <StyledEmoji>🎉</StyledEmoji>
          <StyledTitle>E-Mail bestätigt!</StyledTitle>
          <StyledDescription>
            Vielen Dank, dass du deine E-Mail-Adresse bestätigt hast. Dein Konto ist jetzt vollständig aktiviert.
          </StyledDescription>
          <p tw="text-secondary-text mt-4">Du kannst diese Seite jetzt schließen und zu Spina zurückkehren.</p>
        </StyledContainerDiv>
      </StyledMotionDiv>
    </View>
  );
};

export default VerifiedEmailPage;
