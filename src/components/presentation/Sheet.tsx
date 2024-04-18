import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import tw from "twin.macro";

interface SheetProps {
  navigateBack?: () => void;
  isVisible?: boolean;
}

const StyledSheetWrapper = styled.div`
  ${tw`p-4 lg:px-8 w-full md:h-[90%] mx-auto mt-[2.5%]  h-[95%] md:w-8/12 bg-opacity-90 backdrop-blur-xl  md:rounded-2xl rounded-t-xl  bg-primary`}
`;



const Sheet = (props: PropsWithChildren & SheetProps) => {
  const { children, isVisible = true, navigateBack } = props;
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isSheetDisplayed, setIsSheetDisplayed] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      sheetRef.current &&
      navigateBack &&
      !sheetRef.current.contains(e.target as Node)
    ) {
      console.log("click outside");
      navigateBack();
    }
  };

  useEffect(() => {
    if (isVisible) {
      setIsSheetDisplayed(true);
    } else {
      setTimeout(() => {
        setIsSheetDisplayed(false);
      }, 300);
    }
  }, [isVisible]);

  return isSheetDisplayed && (
    <>
      <motion.div
        initial={{
          opacity: 0,
          backgroundColor: "black",
        }}
        animate={{
          opacity: isVisible ? 0.2 : 0,
        }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
      <motion.div
        transition={{ type: "Tween" }}
        initial={{ y: 1000 }}
        animate={{
          y: isVisible ? 0 : 1000,
        }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        <StyledSheetWrapper ref={sheetRef}>{children}</StyledSheetWrapper>
      </motion.div>
    </>
  );
};

export default Sheet;
