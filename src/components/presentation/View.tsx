import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledViewContainer = styled.div`
  ${tw`fixed bg-opacity-75  bg-white  backdrop-blur-2xl  p-4 md:px-6 md:pb-6 pt-16 top-0 left-0 w-screen h-screen `}
`;

const StyledViewWrapper = styled.div`
  ${tw`w-full h-full  rounded-2xl `}
`;

const StyledViewContent = styled.div`
  ${tw` mx-auto   pt-24 xl:w-[51rem] w-full md:w-[45rem] px-4`}
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
          x: viewType == "overlayView" ? "100%" : 0,
        }}
        transition={{
          type: "tween",
        }}
        animate={{
          x: visibe ? 0 : "100%",
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
