import BlockOutline from "./BlockOutline";
import { IoCloseCircle, IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
import BlockTexteditor from "./BlockTexteditor";
import { Entity, EntityProps } from "@leanscope/ecs-engine";
import { FloatOrderProps } from "@leanscope/ecs-models";
import { TodoStateFacet } from "../../../../app/additionalFacets";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";
import { useRef, useEffect } from "react";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { useEntityFacets } from "@leanscope/ecs-engine/react-api/hooks/useEntityFacets";

const useTodoClickHandler = (entity: Entity) => {
  // const clickCountRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const todoState = entity.get(TodoStateFacet)?.props.todoState || 0;
  const { blockeditorState } = useCurrentBlockeditor();

  const updateTodoState = async (newTodoState: number) => {
    console.log("newTodoState", newTodoState);
    if (blockeditorState == "view" || blockeditorState == "write") {
      entity.add(new TodoStateFacet({ todoState: newTodoState }));

      // TODO: Update the todo state in the database
    }
  };

  const handleClick = async () => {
    // clickCountRef.current += 1;

    // if (clickCountRef.current === 1) {
    //   updateTodoState(0);
    //   clickTimeoutRef.current = setTimeout(() => {
    //     if (clickCountRef.current === 1) {
    //       updateTodoState(todoState === 2 || todoState === 1 ? 0 : 2);
    //     }
    //     clickCountRef.current = 0;
    //   }, 300);
    // } else if (clickCountRef.current === 2) {
    //   clearTimeout(clickTimeoutRef.current!);
    //   clickCountRef.current = 0;

    //   updateTodoState(1);
    // }

    updateTodoState(todoState === 2 || todoState === 1 ? 0 : 2);
  };

  useEffect(() => {
    return () => {
      clearTimeout(clickTimeoutRef.current!);
    };
  }, []);

  return { handleClick };
};

const StyledTodoIconWrapper = styled.div<{ todoState: number }>`
  ${tw`text-xl`}
  ${({ todoState }) => `
    ${todoState == 1 ? tw`text-seconderyText dark:text-seconderyTextDark` : ""}
    ${todoState == 2 ? tw`text-primary` : ""}
    ${todoState == 0 ? tw`text-[rgb(212,212,212)]` : ""} 
  `}
`;

const StyledContentWrapper = styled.div`
  ${tw`w-full h-full min-h-[32px] flex items-center space-x-4 select-none`}
`;

const StyledTexteditorWrapper = styled.div`
  ${tw`w-full`}
`;

const TodoBlock = (props: EntityProps & FloatOrderProps) => {
  const { entity, index } = props;
  const { handleClick } = useTodoClickHandler(entity);
  const [todoStateProps] = useEntityFacets(entity, TodoStateFacet);
  const todoState = todoStateProps?.todoState || 0;
  // const todoState = entity.get(TodoStateFacet)?.props.todoState

  return (
    <BlockOutline index={index || 0} blockEntity={entity}>
      <StyledContentWrapper>
        <StyledTodoIconWrapper onClick={handleClick} todoState={todoState}>
          {todoState == 1 ? (
            <IoCloseCircle />
          ) : todoState == 2 ? (
            <IoCheckmarkCircle />
          ) : todoState == 0 ? (
            <IoEllipseOutline />
          ) : null}
        </StyledTodoIconWrapper>
        <StyledTexteditorWrapper>
          <BlockTexteditor entity={entity} />
        </StyledTexteditorWrapper>
      </StyledContentWrapper>
    </BlockOutline>
  );
};

export default TodoBlock;
