import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import tw from "twin.macro";

const StyledViewContainer = styled.div<{ backgroundColor?: string }>`
  ${tw`  w-screen transition-all h-screen  backdrop-blur-2xl `}
  background-color: ${({ backgroundColor }) => backgroundColor};
  ${({ backgroundColor }) => !backgroundColor && tw` bg-primary dark:bg-primaryDark `}
`;

const StyledViewWrapper = styled.div`
  ${tw`w-full h-full  overflow-y-scroll`}
`;

const StyledViewContent = styled.div<{
  reducePaddingX?: boolean;
  isOverlayView: boolean;
  hidePadding: boolean;
}>`
  ${tw` mx-auto  text-primatyText dark:text-primaryTextDark pb-40 md:pt-28 xl:pt-36 pt-20    w-full  px-4`}
  ${({ reducePaddingX: ignorePaddingX }) => (ignorePaddingX ? tw`md:w-[52rem]` : tw` md:w-[45rem] xl:w-[51rem] `)} 
  ${({ hidePadding }) => hidePadding && tw`!w-full !pt-0 px-0 !pb-0 `}
`;

interface ViewProps {
  viewType?: "baseView" | "overlayView";
  visible?: boolean;
  reducePaddingX?: boolean;
  overlaySidebar?: boolean;
  backgroundColor?: string;
  hidePadding?: boolean;
  onScroll?: (e: any) => void;
}
const View = (props: ViewProps & PropsWithChildren) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const { viewType = "overlayView", visible = true, children, reducePaddingX, overlaySidebar, backgroundColor, hidePadding = false, onScroll } = props;

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
            position: "fixed",
            zIndex: overlaySidebar ? 100 : "auto",
            top: 0,
            left: 0,
            opacity: 0,
            backgroundColor: "black",
            width: "100%",
            height: "100%",
          }}
          animate={{
            opacity: visible ? 0.2 : 0,
          }}
        />
        <motion.div
          initial={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: overlaySidebar ? 100 : "auto",
            x: viewType == "overlayView" ? "100%" : 0,
            backgroundColor: backgroundColor && "white",
          }}
          transition={{
            type: "tween",
          }}
          animate={{
            x: visible ? 0 : "100%",
          }}
         
        >
          <StyledViewContainer backgroundColor={backgroundColor}>
            <StyledViewWrapper onScroll={onScroll} >
              <StyledViewContent   hidePadding={hidePadding} isOverlayView={viewType == "overlayView"} reducePaddingX={reducePaddingX}>
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
