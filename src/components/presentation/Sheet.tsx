import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import tw from 'twin.macro';
import { BackgroundOverlay } from '../../common/components/others';
import { useOutsideClick } from '../../common/hooks';

interface SheetProps {
  navigateBack: () => void;
  visible: boolean;
  backgroundColor?: string;
}

const StyledSheetWrapper = styled.div<{ backgroundColor?: string }>`
  ${tw`p-4 overflow-hidden lg:px-8 dark:bg-secondary-dark transition-all dark:text-primary-text-dark w-full 2xl:h-[80%] md:h-[90%] mx-auto mt-[6%] md:mt-[2.5%] 2xl:mt-[5%] h-[97%] md:w-8/12 2xl:w-6/12  md:rounded-2xl rounded-t-xl  bg-primary`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledSheetContainer = styled(motion.div)`
  ${tw` fixed w-full h-full top-0 left-0 z-[200]`}
`;

const Sheet = (props: PropsWithChildren & SheetProps) => {
  const { children, visible = true, navigateBack, backgroundColor } = props;
  const sheetRef = useRef<HTMLDivElement>(null);
  const isSheetDisplayed = useIsSheetDisplayed(visible);

  useOutsideClick(sheetRef, navigateBack, visible);

  return (
    isSheetDisplayed && (
      <div>
        <BackgroundOverlay overlayBaseUI isVisible={visible} />
        <StyledSheetContainer
          transition={{ type: 'Tween' }}
          initial={{ y: 1000 }}
          animate={{
            y: visible ? 0 : 1000,
          }}
        >
          <StyledSheetWrapper backgroundColor={backgroundColor} ref={sheetRef}>
            {children}
          </StyledSheetWrapper>
        </StyledSheetContainer>
      </div>
    )
  );
};

export default Sheet;

const useIsSheetDisplayed = (visible: boolean) => {
  const [isSheetDisplayed, setIsSheetDisplayed] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsSheetDisplayed(true);
    } else {
      setTimeout(() => {
        setIsSheetDisplayed(false);
      }, 300);
    }
  }, [visible]);

  return isSheetDisplayed;
};
