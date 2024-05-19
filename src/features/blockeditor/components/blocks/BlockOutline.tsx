import styled from "@emotion/styled";
import { Entity } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { IdentifierFacet, Tags } from "@leanscope/ecs-models";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import tw from "twin.macro";
import { AdditionalTags } from "../../../../base/enums";
import { useCurrentBlockeditor } from "../../hooks/useCurrentBlockeditor";

const StyledBlockWrapper = styled.div<{ isPressed: boolean; hidePaddingY: boolean }>`
  ${tw`md:mb-1  px-2  mb-0.5  rounded-md w-full  flex h-fit `}
  ${({ isPressed }) =>
    isPressed
      ? tw`bg-primaryColor  bg-opacity-10 dark:bg-opacity-100 dark:bg-seconderyDark   z-40  select-none `
      : tw`border-white`};
  ${({ hidePaddingY }) => (hidePaddingY ? tw`py-0 min-h-[32px]` : tw`py-1 min-h-[40px]`)};
`;

const StyledContentWrapper = styled.div`
  ${tw`w-full overflow-hidden h-full`}
`;

const StyledSelectionIndicatorWrapper = styled.div<{ isEdeting: boolean }>`
  ${tw`w-6 h-full z-20   flex items-center absolute top-0 right-0`}
  ${({ isEdeting }) => (isEdeting ? tw`visible` : tw`invisible`)}
`;

const StyledSelectionIndicator = styled.div<{ isVisible: boolean }>`
  ${tw`w-3 h-3  select-none rounded-full border `}
  ${({ isVisible }) =>
    isVisible
      ? tw` border-primaryColor dark:border-white dark:bg-white bg-primaryColor`
      : tw`dark:border-white border-[rgb(212,212,212)]`}
`;

interface BlockOutlineProps {
  blockEntity: Entity;
  index: number;
  hidePaddingY?: boolean;
}

const BlockOutline = (props: BlockOutlineProps & PropsWithChildren) => {
  const { blockEntity, hidePaddingY, children } = props;
  const { blockeditorState } = useCurrentBlockeditor();
  const isEditing = blockeditorState === "edit";
  const [isPressed] = useEntityHasTags(blockEntity, Tags.SELECTED);
  const blockId = blockEntity.get(IdentifierFacet)?.props.guid;
  const [isContentEditable] = useEntityHasTags(blockEntity, AdditionalTags.CONTENT_EDITABLE);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  // TODO: Custom hook to handle click outside block editor

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [blockeditorState]);

  useEffect(() => {
    if (!isEditing) {
      blockEntity.addTag(AdditionalTags.CONTENT_EDITABLE);
    }
  }, [isEditing]);

  const handleClickOutside = (event: MouseEvent) => {
    if (textBlockRef.current && !textBlockRef.current.contains(event.target as Node)) {
      setTranslateX(0);
    }
  };

  const toggleIsBlockPressed = () => {
    if (blockeditorState !== "write") {
      if (!isPressed) {
        blockEntity.removeTag(AdditionalTags.CONTENT_EDITABLE);
        blockEntity.add(Tags.SELECTED);
      } else {
        blockEntity.remove(Tags.SELECTED);
      }
    }
  };

  const handleMouseDown = () => {
    if (isEditing) {
      toggleIsBlockPressed();
    } else {
      timeoutRef.current = setTimeout(() => {
        toggleIsBlockPressed();
      }, 500);
    }
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setStartX(touch.clientX);
    timeoutRef.current = setTimeout(() => {
      if (!isContentEditable) {
        toggleIsBlockPressed();
      }
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStartX(null);
    setIsSwiping(false);
    setTranslateX(0);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - startX;
      setTranslateX(deltaX);

      if (deltaX > 50 || deltaX < -50) {
        if (!isSwiping) {
          toggleIsBlockPressed();
        }
        setIsSwiping(true);
      }
    }
  };

  const transitionStyle: React.CSSProperties = {
    transition: "transform 0.1s ease-out",
    transform: `translateX(${translateX}px)`,
  };

  return (
    blockId && (
      <Draggable key={blockId} draggableId={blockId} index={0}>
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <StyledBlockWrapper
              isPressed={isPressed}
              hidePaddingY={hidePaddingY ?? false}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={blockeditorState !== "write" ? transitionStyle : {}}
              ref={textBlockRef}
            >
              <StyledContentWrapper>{children}</StyledContentWrapper>
              <StyledSelectionIndicatorWrapper isEdeting={isEditing}>
                <StyledSelectionIndicator isVisible={isPressed && isEditing} />
              </StyledSelectionIndicatorWrapper>
            </StyledBlockWrapper>
          </div>
        )}
      </Draggable>
    )
  );
};

export default BlockOutline;
