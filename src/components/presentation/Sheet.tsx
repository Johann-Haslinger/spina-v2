import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { useSelectedTheme } from "../../features/collection/hooks/useSelectedTheme";

interface SheetProps {
  navigateBack: () => void;
  visible: boolean;
}

const StyledSheetWrapper = styled.div`
  ${tw`p-4 overflow-hidden lg:px-8 dark:bg-seconderyDark transition-all dark:text-primaryTextDark w-full md:h-[90%] mx-auto mt-[6%] md:mt-[2.5%]  h-[97%] md:w-8/12 bg-opacity-95 backdrop-blur-xl  md:rounded-2xl rounded-t-xl  bg-primary`}
`;

const Sheet = (props: PropsWithChildren & SheetProps) => {
  const { children, visible = true, navigateBack } = props;
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isSheetDisplayed, setIsSheetDisplayed] = useState(false);
  const { isDarkMode } = useSelectedTheme();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [navigateBack]);

  const handleClickOutside = (e: MouseEvent) => {
    if (sheetRef.current && navigateBack && !sheetRef.current.contains(e.target as Node)) {
      navigateBack();
    }
  };

  useEffect(() => {
    if (visible) {
      setIsSheetDisplayed(true);
    } else {
      setTimeout(() => {
        setIsSheetDisplayed(false);
      }, 300);
    }
  }, [visible]);

  return (
    isSheetDisplayed && (
      <Fragment>
        <motion.div
          initial={{
            backgroundColor: "#0000010",
          }}
          animate={{
            backgroundColor: visible ? (isDarkMode ? "#00000080" : "#00000020") : "#0000000",
          }}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 100,
          }}
        />
        <motion.div
          transition={{ type: "Tween" }}
          initial={{ y: 1000 }}
          animate={{
            y: visible ? 0 : 1000,
          }}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",

            left: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          <StyledSheetWrapper ref={sheetRef}>{children}</StyledSheetWrapper>
        </motion.div>
      </Fragment>
    )
  );
};

export default Sheet;
