import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { PropsWithChildren, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../utils/selectDisplayText";

const StyledBackButtonWrapper = styled.div`
  ${tw`flex h-10 w-fit  dark:text-primaryTextDark text-sm space-x-2 items-center cursor-pointer`}
`;

const StyledBackButtonIcon = styled.div`
  ${tw`text-lg`}
`;

const BackButton = (props: PropsWithChildren &  {
  navigateBack?: () => void;

}) => {
  const { navigateBack, children } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <StyledBackButtonWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={navigateBack}
    >
      <motion.div
        initial={{ x: 0 }}
        animate={{
          x: isHovered ? -8 : 0,
        }}
      >
        <StyledBackButtonIcon>
          <IoArrowBack />
        </StyledBackButtonIcon>
      </motion.div>
      <p>
        {children
          ? children
          : displayButtonTexts(selectedLanguage).back}
      </p>
    </StyledBackButtonWrapper>
  );
};

export default BackButton;
