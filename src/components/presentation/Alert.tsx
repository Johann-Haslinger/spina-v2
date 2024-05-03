import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { useSelectedTheme } from "../../features/collection/hooks/useSelectedTheme";
import { displayAlertTexts } from "../../utils/displayText";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";

const StyledAlertWrapper = styled.div`
  ${tw`bg-white dark:bg-seconderyDark overflow-hidden  text-primatyText dark:text-primaryTextDark w-10/12 md:w-64 mx-auto mt-72  backdrop-blur-lg bg-opacity-90 rounded-lg `}
`;

const StyledAlertTitle = styled.div`
  ${tw`text-center pt-4 font-bold`}
`;

const StyledAlertSubTitle = styled.div`
  ${tw`text-center pb-4 text-sm`}
`;

const StyledButtonWrapper = styled.div`
  ${tw`border-primaryBorder divide-x divide-primaryBorder dark:divide-primaryBorderDark dark:border-primaryBorderDark border-t flex`}
`;

interface AlertProps {
  visible?: boolean;
  navigateBack?: () => void;
}

const Alert = (props: AlertProps & PropsWithChildren) => {
  const { visible = true, navigateBack,  children } = props;
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useSelectedTheme();
  const { selectedLanguage } = useSelectedLanguage();

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (alertRef.current && !alertRef.current.contains(e.target as Node)) {
      navigateBack && navigateBack();
    }
  };

  useEffect(() => {
    if (visible) {
      setIsAlertDisplayed(true);
    } else {
      setTimeout(() => {
        setIsAlertDisplayed(false);
      }, 300);
    }
  }, [visible]);

  return (
    isAlertDisplayed && (
      <motion.div
        initial={{
          backgroundColor: "#0000010",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 100,
          position: "fixed",
        }}
        animate={{
          backgroundColor: visible ? (isDarkMode ? "#00000080" : "#00000020") : "#0000000",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <StyledAlertWrapper ref={alertRef}>
            <StyledAlertTitle>{displayAlertTexts(selectedLanguage).deleteAlertTitle}</StyledAlertTitle>
            <StyledAlertSubTitle> {displayAlertTexts(selectedLanguage).deleteAlertSubtitle}</StyledAlertSubTitle>
            <StyledButtonWrapper>{children}</StyledButtonWrapper>
          </StyledAlertWrapper>
        </motion.div>
      </motion.div>
    )
  );
};

export default Alert;
