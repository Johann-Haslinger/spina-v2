import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PropsWithChildren, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';

const StyledBackButtonWrapper = styled(motion.div)`
  ${tw`flex size-7 rounded-full p-1 text-xl bg-opacity-50  transition-all bg-[#D9D9D9] dark:bg-opacity-20 dark:text-primaryTextDark mb-4 space-x-2 items-center cursor-pointer`}
`;

const StyledBackButtonIcon = styled.div`
  ${tw`text-lg`}
`;

const BackButton = (
  props: PropsWithChildren & {
    navigateBack?: () => void;
  },
) => {
  const { navigateBack, children } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { selectedLanguage } = useSelectedLanguage();

  console.log('BackButton rendered', selectedLanguage, children);

  return (
    <StyledBackButtonWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateBack}
      initial={{ x: 0 }}
      animate={{
        x: isHovered ? -3 : 0,
      }}
    >
      <StyledBackButtonIcon>
        <IoArrowBack />
      </StyledBackButtonIcon>
    </StyledBackButtonWrapper>
  );
};

export default BackButton;
