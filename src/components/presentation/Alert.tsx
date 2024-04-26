import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import tw from "twin.macro";

const StyledAlertWrapper = styled.div`
  ${tw`bg-white text-black w-10/12 md:w-64 mx-auto mt-[30%]  backdrop-blur-lg bg-opacity-90 rounded-lg `}
`;

const StyledAlertTitle = styled.div`
  ${tw`text-center pt-4 font-bold`}
`;

const StyledAlertSubTitle = styled.div`
  ${tw`text-center pb-4 text-sm`}
`;

const StyledButtonWrapper = styled.div`
  ${tw`border-[rgb(221,221,221)] border-t flex`}
`;

interface AlertProps {
  visible?: boolean;
  navigateBack?: () => void;
  title?: string;
  subTitle?: string;
}

const Alert = (props: AlertProps & PropsWithChildren) => {
  const { visible = true, navigateBack, title, subTitle, children } = props;
  const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

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
          backgroundColor: visible ? "#00000020" : "#0000000",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <StyledAlertWrapper ref={alertRef}>
            <StyledAlertTitle>{title}</StyledAlertTitle>
            <StyledAlertSubTitle> {subTitle}</StyledAlertSubTitle>
            <StyledButtonWrapper>{children}</StyledButtonWrapper>
          </StyledAlertWrapper>
        </motion.div>
      </motion.div>
    )
  );
};

export default Alert;
