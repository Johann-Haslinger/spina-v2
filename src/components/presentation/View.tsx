import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import { PropsWithChildren, useEffect, useState } from 'react';
import tw from 'twin.macro';
import { BackgroundOverlay } from '../../common/components/others';

const StyledViewContainer = styled(motion.div)<{ backgroundColor?: string }>`
  ${tw`fixed top-0 overflow-hidden h-screen overflow-y-scroll left-0 w-screen `}
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${({ backgroundColor }) => !backgroundColor && tw` bg-primary dark:bg-primary-dark `}
`;

const StyledViewContent = styled.div<{
  reducePaddingX?: boolean;
  isOverlayView: boolean;
  hidePadding: boolean;
}>`
  ${tw` mx-auto overflow-y-hidden  pb-40 text-primary-text dark:text-primary-text-dark md:pt-28 xl:pt-36 pt-16 w-full overflow-hidden  px-4`}
  ${({ reducePaddingX: ignorePaddingX }) =>
    ignorePaddingX ? tw`md:w-[52rem] px-1.5` : tw` md:w-[48rem] xl:w-[51rem] 2xl:w-[56rem] `} 
  ${({ hidePadding }) => hidePadding && tw`!w-full !pt-0 px-0 !pb-0 `}
`;

interface ViewProps {
  viewType?: 'baseView' | 'overlayView';
  visible?: boolean;
  reducePaddingX?: boolean;
  overlaySidebar?: boolean;
  backgroundColor?: string;
  hidePadding?: boolean;
  handleScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}
const View = (props: ViewProps & PropsWithChildren) => {
  const {
    viewType = 'overlayView',
    visible = true,
    children,
    reducePaddingX,
    overlaySidebar,
    backgroundColor,
    hidePadding = false,

    handleScroll,
  } = props;
  const isDisplayed = useIsViewDisplayed(visible);

  return (
    isDisplayed && (
      <div>
        <BackgroundOverlay isVisible={visible} />

        <StyledViewContainer
          initial={{
            zIndex: overlaySidebar ? 100 : 'auto',
            x: viewType == 'overlayView' ? '100%' : 0,
            backgroundColor: backgroundColor,
          }}
          transition={{
            type: 'tween',
          }}
          animate={{
            x: visible ? 0 : '100%',
          }}
          backgroundColor={backgroundColor}
          onScroll={handleScroll}
        >
          <StyledViewContent
            hidePadding={hidePadding}
            isOverlayView={viewType == 'overlayView'}
            reducePaddingX={reducePaddingX}
          >
            {children}
          </StyledViewContent>
        </StyledViewContainer>
      </div>
    )
  );
};

export default View;

const useIsViewDisplayed = (visible: boolean) => {
  const [isDisplayed, setIsDisplayed] = useState(visible);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (visible) {
      setIsDisplayed(true);
    } else {
      timeoutId = setTimeout(() => {
        setIsDisplayed(false);
      }, 300);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [visible]);

  return isDisplayed;
};
