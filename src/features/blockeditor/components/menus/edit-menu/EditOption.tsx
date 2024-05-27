import { Entity, useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { useState, useEffect, Fragment } from "react";
import { DataTypes } from "../../../../../base/enums";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { motion } from "framer-motion";

type Option = {
  name: string;
  icon: React.ReactNode;
  color?: string;
  content?: React.ReactNode | null;
  customFunc?: () => void;
  isLarge?: boolean;
};

interface EditOptionProps {
  option: Option;
  isVisible: boolean;
  canShow: (pressedBlocks: readonly Entity[]) => boolean;
}

const StyledBackIcon = styled.div`
  ${tw`w-8 h-1 rounded-full dark:bg-white dark:bg-opacity-5   bg-tertiary mx-auto`}
`;

const StyledFurtherOptionSheetWrapper = styled.div<{ isLarge?: boolean }>`
  ${tw`bg-white pt-2 dark:bg-seconderyDark mx-auto z-40 rounded-xl md:w-[31rem] px-4 w-11/12 shadow-[0_0px_40px_1px_rgba(0,0,0,0.12)] `}
  ${({ isLarge }) => isLarge && tw`h-60`}
`;

const StyledOptionWrapper = styled.div<{ color?: string }>`
  ${tw`w-full hover:opacity-80 transition-all min-w-[4rem] p-2 bg-opacity-10  text-white rounded-lg mr-0 m-1`}
  ${({ color: backgroundColor }) => `
    color: ${backgroundColor};
    background-color: ${backgroundColor + "50"};
  `}
`;

const StyledOptionIconWrapper = styled.div`
  ${tw`text-2xl flex justify-center mt-2`}
`;

const StyledOptionTextWrapper = styled.p`
  ${tw`text-xs mt-1 opacity-60 w-full text-center font-semibold`}
`;

const EditOption: React.FC<EditOptionProps> = ({ option, isVisible, canShow }) => {
  const { name, icon, color, customFunc, content } = option;
  const [selectedBlockEntities] = useEntities((e) => e.has(DataTypes.BLOCK) && e.has(Tags.SELECTED));
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (canShow(selectedBlockEntities)) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [selectedBlockEntities.length]);

  useEffect(() => {
    setIsOptionsVisible(false);
  }, [isVisible]);

  const handleClick = () => {
    setIsOptionsVisible(true);
    if (customFunc) {
      customFunc();
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y >= 1) {
      setIsOptionsVisible(false);
    }
  };

  return (
    <Fragment>
      {show && (
        <StyledOptionWrapper color={color || "blue"} onClick={handleClick}>
          <StyledOptionIconWrapper>{icon}</StyledOptionIconWrapper>
          <StyledOptionTextWrapper>{name}</StyledOptionTextWrapper>
        </StyledOptionWrapper>
      )}

      <motion.div
        style={{ zIndex: 40 }}
        transition={{ type: "Tween" }}
        animate={{ y: isOptionsVisible && isVisible && content ? 0 : 300 }}
        initial={{ y: 200, position: "fixed", left: 0, right: 0, width: "100%", bottom: 4 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 200 }}
        onDragEnd={handleDragEnd}
      >
        <StyledFurtherOptionSheetWrapper>
          {" "}
          <StyledBackIcon />
          {content}
        </StyledFurtherOptionSheetWrapper>
      </motion.div>
    </Fragment>
  );
};

export default EditOption;
