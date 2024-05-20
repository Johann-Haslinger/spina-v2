import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Entity } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";
import { useContext, useEffect, useRef, useState } from "react";
import { IoArrowUp } from "react-icons/io5";
import tw from "twin.macro";
import { AdditionalTags } from "../../../../../base/enums";

const StyledPromptBoxWrapper = styled.div`
  ${tw`h-10 w-full pl-4  pr-1 items-center flex justify-between  bg-tertiary dark:bg-tertiaryDark mt-4 ml-0 m-8 rounded-full `}
`;

const StyledPromptInput = styled.input`
  ${tw`h-10 placeholder:text-seconderyText placeholder:text-opacity-50 dark:text-white dark:placeholder:text-seconderyTextDark bg-white bg-opacity-0 outline-none`}
`;

const StyledSubmitButton = styled.button<{ active: boolean }>`
  ${tw` transition-all flex justify-center items-center text-xl size-8 text-white text-opacity-50 dark:text-black  rounded-full`}
  ${({ active }) =>
    active
      ? tw`dark:bg-white text-white bg-black dark:bg-opacity-80 hover:opacity-50`
      : tw` dark:bg-white bg-black bg-opacity-10  dark:bg-opacity-10 dark:text-opacity-60  `}
`;

const usePromptBoxRef = (isVisible: boolean) => {
  const promptInputRef = useRef<HTMLInputElement>(null);

  const focusPromptBox = () => {
    promptInputRef.current?.focus();
  };

  useEffect(() => {
    if (isVisible) {
      focusPromptBox();
    }
  }, [isVisible]);

  return { promptInputRef };
};
const SapientorPromptBox = (props: { isVisible: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = props.isVisible;
  const { promptInputRef } = usePromptBoxRef(isVisible);
  const [prompt, setPrompt] = useState("");

  const submitPrompt = () => {
    if (prompt === "") return;
    const newPromptEntity = new Entity();
    lsc.engine.addEntity(newPromptEntity);
    newPromptEntity.add(new TextFacet({ text: prompt }));
    newPromptEntity.addTag(AdditionalTags.PROMPT);

    setPrompt("");
  };

  return (
    <StyledPromptBoxWrapper>
      <StyledPromptInput
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        ref={promptInputRef}
        placeholder="Type a message"
      />
      <StyledSubmitButton onClick={submitPrompt} active={prompt !== ""}>
        <IoArrowUp />
      </StyledSubmitButton>
    </StyledPromptBoxWrapper>
  );
};

export default SapientorPromptBox;
