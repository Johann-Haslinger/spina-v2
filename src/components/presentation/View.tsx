import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledViewContainer = styled.div`
  ${tw` bg-opacity-75 w-screen h-screen  bg-white  backdrop-blur-2xl `}
`;

const StyledViewWrapper = styled.div`
  ${tw`w-full h-full  overflow-y-scroll`}
`;

const StyledViewContent = styled.div`
  ${tw` mx-auto md:pt-28 pb-40  xl:pt-36 pt-20  xl:w-[51rem] w-full md:w-[45rem] px-4`}
`;

interface ViewProps {
  viewType?: "baseView" | "overlayView";
  visibe?: boolean;
}
const View = (props: ViewProps & PropsWithChildren) => {
  const { viewType = "overlayView", visibe = true, children } = props;

  return (
    <>
      <motion.div
        initial={{
          position: "fixed",
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
         
          x: viewType == "overlayView" ?  "100%" : 0,
        }}
        transition={{
          type: "tween",
        }}
        animate={{
          x: visibe ? 0 : "100%"
        }}
      >
        <StyledViewContainer>
          <StyledViewWrapper>
            <StyledViewContent> {children}</StyledViewContent>
          </StyledViewWrapper>
        </StyledViewContainer>
      </motion.div>
    </>
  );
};

export default View;
