import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import { PropsWithChildren, useEffect, useRef } from 'react';
import tw from 'twin.macro';

const StyledActionSheetWrapper = styled.div`
  ${tw` bg-[rgb(244,244,244)] mt-3  dark:bg-secondary-dark  w-full dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.05)] shadow-[0px_0px_60px_0px_rgba(0,0,0,0.13)] text-primary-text dark:text-primary-text-dark  backdrop-blur-2xl rounded-lg `}
`;

interface ActionSheetProps {
  visible: boolean;
  navigateBack: () => void;
  direction?: 'left' | 'right';
}

const ActionSheet = (props: PropsWithChildren & ActionSheetProps) => {
  const { visible, children, navigateBack, direction = 'right' } = props;
  const refOne = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) navigateBack();
  }, [visible]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = () => {
    if (refOne.current) {
      navigateBack();
    }
  };

  return (
    <motion.div
      ref={refOne}
      initial={{
        opacity: 0,
        scale: 0.0,
        position: 'absolute',
        right: direction === 'right' ? 12 : 'auto',
        width: '14rem',
      }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.0 }}
      transition={{ duration: 0.2 }}
    >
      <StyledActionSheetWrapper>{children}</StyledActionSheetWrapper>
    </motion.div>
  );
};

export default ActionSheet;
