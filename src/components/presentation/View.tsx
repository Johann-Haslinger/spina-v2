import styled from '@emotion/styled/macro';
import { motion } from 'framer-motion';
import { Fragment, PropsWithChildren, useEffect, useState } from 'react';
import tw from 'twin.macro';

const StyledViewContainer = styled.div<{ backgroundColor?: string }>`
  ${tw`  w-screen overflow-hidden transition-all h-screen  backdrop-blur-2xl `}
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${({ backgroundColor }) => !backgroundColor && tw` bg-primary dark:bg-primary-dark `}
`;

const StyledViewWrapper = styled.div`
  ${tw`w-full h-full overflow-y-scroll`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledViewContent = styled.div<{
  reducePaddingX?: boolean;
  isOverlayView: boolean;
  hidePadding: boolean;
}>`
  ${tw` mx-auto overflow-hidden h-fit text-primary-text dark:text-primary-text-dark pb-60 md:pt-28 xl:pt-36 pt-16    w-full  px-4`}
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
  const [isDisplayed, setIsDisplayed] = useState(false);
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

  return (
    isDisplayed && (
      <Fragment>
        <motion.div
          initial={{
            position: 'fixed',
            zIndex: overlaySidebar ? 100 : 'auto',
            top: 0,
            left: 0,
            opacity: 0,
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
          }}
          animate={{
            opacity: visible ? 0.2 : 0,
          }}
        />
        <motion.div
          initial={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: overlaySidebar ? 100 : 'auto',
            x: viewType == 'overlayView' ? '100%' : 0,
            backgroundColor: backgroundColor && 'white',
          }}
          transition={{
            type: 'tween',
          }}
          animate={{
            x: visible ? 0 : '100%',
          }}
        >
          <StyledViewContainer backgroundColor={backgroundColor}>
            <StyledViewWrapper onScroll={handleScroll}>
              <StyledViewContent
                hidePadding={hidePadding}
                isOverlayView={viewType == 'overlayView'}
                reducePaddingX={reducePaddingX}
              >
                {children}
              </StyledViewContent>
            </StyledViewWrapper>
          </StyledViewContainer>
        </motion.div>
      </Fragment>
    )
  );
};

export default View;
