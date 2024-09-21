import styled from '@emotion/styled/macro';
import { Entity, EntityProps, useEntityComponents } from '@leanscope/ecs-engine';
import { FloatOrderProps, IdentifierFacet } from '@leanscope/ecs-models';
import { useEffect, useRef } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoEllipseOutline } from 'react-icons/io5';
import tw from 'twin.macro';
import { TodoStateFacet } from '../../../../app/additionalFacets';
import { SupabaseColumn, SupabaseTable } from '../../../../base/enums';
import supabaseClient from '../../../../lib/supabase';
import { useCurrentBlockeditor } from '../../hooks/useCurrentBlockeditor';
import BlockOutline from './BlockOutline';
import BlockTexteditor from './BlockTexteditor';

const useTodoClickHandler = (entity: Entity) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const todoState = entity.get(TodoStateFacet)?.props.todoState || 0;
  const { blockeditorState } = useCurrentBlockeditor();

  const updateTodoState = async (newTodoState: number) => {
    if (blockeditorState == 'view' || blockeditorState == 'write') {
      entity.add(new TodoStateFacet({ todoState: newTodoState }));

      const id = entity.get(IdentifierFacet)?.props.guid;

      const { error } = await supabaseClient
        .from(SupabaseTable.BLOCKS)
        .update({ state: newTodoState })
        .eq(SupabaseColumn.ID, id);

      if (error) {
        console.error('Error updating block in supabase:', error);
      }
    }
  };

  const handleClick = async () => updateTodoState(todoState === 2 || todoState === 1 ? 0 : 2);

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
    ${todoState == 1 ? tw`text-primary-color dark:text-secondary-text-dark` : ''}
    ${todoState == 2 ? tw`text-primary-color dark:text-primary-text-dark` : ''}
    ${todoState == 0 ? tw` text-primary-color dark:text-primary-text-dark` : ''} 
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
  const [todoStateFacet] = useEntityComponents(entity, TodoStateFacet);
  const todoState = todoStateFacet?.props.todoState || 0;

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
