import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { displayButtonTexts } from "../../utils/selectDisplayText";

const StyledBackButtonWrapper = styled.div`
  ${tw`flex dark:text-primaryTextDark mb-2 space-x-2 items-center cursor-pointer`}
`;

const StyledBackButtonIcon = styled.div`
  ${tw`text-lg`}
`;

const BackButton = (props: {
  navigateBack?: () => void;
  backButtonLabel?: string;
}) => {
  const { navigateBack, backButtonLabel } = props;
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
        {backButtonLabel
          ? backButtonLabel
          : displayButtonTexts(selectedLanguage).backButtonText}
      </p>
    </StyledBackButtonWrapper>
  );
};

export default BackButton;
