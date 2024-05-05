import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import tw from "twin.macro";

const StyledViewContainer = styled.div<{backgroundColor?: string}>`
  ${tw`  w-screen transition-all h-screen  bg-primary dark:bg-primaryDark  backdrop-blur-2xl `}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledViewWrapper = styled.div`
  ${tw`w-full h-full  overflow-y-scroll`}
`;

const StyledViewContent = styled.div<{
  reducePaddingX?: boolean;
  isOverlayView: boolean;
}>`
  ${tw` mx-auto md:pt-28 text-primatyText dark:text-primaryTextDark pb-40  xl:pt-36 pt-20   w-full  px-4`}
  ${({ reducePaddingX: ignorePaddingX }) =>
    ignorePaddingX ? tw`md:w-[52rem]` : tw` md:w-[45rem] xl:w-[51rem] `} /* ${({ isOverlayView }) =>
    isOverlayView ? tw`md:pt-20 xl:pt-28 pt-10 ` : tw`md:pt-28 xl:pt-36 pt-20  `} */
`;

interface ViewProps {
  viewType?: "baseView" | "overlayView";
  visibe?: boolean;
  reducePaddingX?: boolean;
  overlaySidebar?: boolean;
  backgroundColor?: string;
}
const View = (props: ViewProps & PropsWithChildren) => {
  const [isDisplayed, setIsDisplayed] = useState(false);
  const { viewType = "overlayView", visibe = true, children, reducePaddingX, overlaySidebar, backgroundColor } = props;

  useEffect(() => {
    if (visibe) {
      setIsDisplayed(true);
    } else {
      setTimeout(() => {
        setIsDisplayed(false);
      }, 300);
    }
  }, [visibe]);

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
            opacity: visibe ? 0.2 : 0,
          }}
        />
        <motion.div
          initial={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: overlaySidebar ? 100 : "auto",
            x: viewType == "overlayView" ? "100%" : 0,
          }}
          transition={{
            type: "tween",
          }}
          animate={{
            x: visibe ? 0 : "100%",
          }}
        >
          <StyledViewContainer backgroundColor={backgroundColor}>
            <StyledViewWrapper>
              <StyledViewContent isOverlayView={viewType == "overlayView"} reducePaddingX={reducePaddingX}>
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
