import styled from "@emotion/styled/macro";
import { delay, motion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import tw from "twin.macro";

const StyledActionSheetWrapper = styled.div`
  ${tw` bg-[rgb(244,244,244)] bg-opacity-80 w-full shadow-[0px_0px_60px_0px_rgba(0,0,0,0.13)] text-black backdrop-blur-2xl rounded-lg `}
`;

interface ActionSheetProps {
  visible: boolean;
  navigateBack: () => void;
}

const ActionSheet = (props: PropsWithChildren & ActionSheetProps) => {
  const { visible, children, navigateBack } = props;
  const refOne = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible) {
    } else {
      navigateBack();
    }
  }, [visible]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
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
        position: "absolute",
        top: "4rem",
        right: "0.75rem",
        width: "14rem",
      }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.0 }}
      transition={{ duration: 0.2 }}
    >
      <StyledActionSheetWrapper>{children}</StyledActionSheetWrapper>
    </motion.div>
  );
};

export default ActionSheet;
