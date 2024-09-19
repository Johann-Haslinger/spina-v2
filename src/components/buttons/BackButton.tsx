import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledBackButtonWrapper = styled(motion.div)`
  ${tw`flex size-8 hover:scale-105 rounded-full justify-center  text-xl bg-opacity-40  transition-all bg-[#D9D9D9] dark:bg-opacity-20 dark:text-primary-text-dark mb-4 space-x-2 items-center cursor-pointer`}
`;

const BackButton = (
  props: PropsWithChildren & {
    navigateBack?: () => void;
  },
) => {
  const { navigateBack } = props;

  return (
    <StyledBackButtonWrapper onClick={navigateBack}>
      <IoArrowBack />
    </StyledBackButtonWrapper>
  );
};

export default BackButton;
